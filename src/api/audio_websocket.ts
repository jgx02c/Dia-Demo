import { Socket, io } from 'socket.io-client';

interface SocketError {
  message?: string;
  [key: string]: unknown;
}

interface AudioAcknowledgement {
  received: boolean;
  [key: string]: unknown;
}

class AudioWebSocket {
  private socket: Socket | null = null;
  private audioStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private onStatusChange: ((status: string) => void) | null = null;
  private onError: ((error: string) => void) | null = null;
  private isServerOffline: boolean = false;

  private maxReconnectAttempts: number = 3;
  private reconnectDelay: number = 2000;
  private isTranscribing: boolean = false;

  connect(): Promise<Socket> {
    if (this.socket?.connected) return Promise.resolve(this.socket);

    return new Promise((resolve, reject) => {
      this.socket = io('https://dialogica-demo-backend-c058.onrender.com/ws/audio-stream', {
        path: '/socket.io',
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        forceNew: true,
        autoConnect: true
      });

      this.socket.on('connect', () => {
        console.log("Socket.IO connection established");
        this.isServerOffline = false;

        this.onStatusChange?.("Connected");
        
        // Register as an audio client
        this.socket?.emit('register_audio');
        resolve(this.socket!);
      });

      this.socket.on('connect_error', (error) => {
        console.error("Connection error:", error);
        this.handleConnectionError(error);
        reject(error);
      });

      this.setupEventListeners();
    });
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connection_established', (data: { status: string }) => {
      console.log("Connection established:", data.status);
    });

    this.socket.on('audio_registered', (data: { status: string }) => {
      console.log("Registered as audio client:", data.status);
      this.onStatusChange?.("Ready");
    });

    // Error handling
    this.socket.on('error', (error: { message: string }) => {
      console.error("Socket error:", error.message);
      // Only show error if it's not a connection error (which is handled by connect_error)
      if (!error.message.includes('connection')) {
        this.onError?.(error.message);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log("Socket disconnected:", reason);
      this.handleDisconnect(reason);
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log("Reconnection attempt:", attemptNumber);
      if (attemptNumber >= this.maxReconnectAttempts) {
        this.handleMaxReconnectAttemptsReached();
      }
    });
  }

  private handleConnectionError(error: SocketError | Error) {
    this.isServerOffline = true;
    this.onStatusChange?.("Server Offline");
    const errorMessage = error instanceof Error ? error.message : String(error.message || error);
    this.onError?.(`Server is currently offline: ${errorMessage}. Please try again later.`);
    this.stopAudioStream();
  }

  private handleDisconnect(reason: string) {
    this.isServerOffline = reason === 'io server disconnect' || reason === 'transport close';
    this.onStatusChange?.(this.isServerOffline ? "Server Offline" : "Disconnected");
    this.stopAudioStream();
  }

  private handleMaxReconnectAttemptsReached() {
    this.isServerOffline = true;
    this.onStatusChange?.("Server Offline");
    this.onError?.("Unable to connect to server after multiple attempts. Please check your connection and try again.");
    this.stopAudioStream();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  disconnect() {
    this.stopAudioStream();

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.onStatusChange?.("Disconnected");
      console.log("WebSocket connection closed.");
    }
  }

  private stopAudioStream() {
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }

    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  async setupAudioStream(stream: MediaStream): Promise<void> {
    try {
      if (!this.socket?.connected || this.isServerOffline) {
        throw new Error("Server is currently offline. Please try again later.");
      }

      // Stop any existing audio processing
      this.stopAudioStream();
      
      this.audioStream = stream;
      this.audioContext = new AudioContext({
        sampleRate: 16000 // Match server's expected sample rate
      });

      const source = this.audioContext.createMediaStreamSource(stream);
      const processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      this.processor = processor;

      let chunks: Int16Array[] = [];
      let nextTime = 0;

      processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        // Convert float32 to int16 (16-bit PCM)
        const buffer = new Int16Array(input.map(n => {
          // Clamp the value between -1 and 1
          const clamped = Math.max(-1, Math.min(1, n));
          // Convert to 16-bit integer
          return Math.round(clamped * 32767);
        }));
        chunks.push(buffer);

        const currentTime = this.audioContext!.currentTime;

        if (currentTime > nextTime) {
          nextTime = currentTime + 0.25; // Send chunks every 250ms

          if (this.socket?.connected && !this.isServerOffline && this.isTranscribing) {
            const totalLength = chunks.reduce((acc, val) => acc + val.length, 0);
            const combined = new Int16Array(totalLength);

            let offset = 0;
            for (const chunk of chunks) {
              combined.set(chunk, offset);
              offset += chunk.length;
            }

            // Log detailed information about the audio data
            /*console.log('Audio data details:', {
              sampleCount: combined.length,
              byteLength: combined.byteLength,
              firstSample: combined[0],
              lastSample: combined[combined.length - 1],
              timestamp: Date.now()
            });*/

            // Create a buffer with metadata and audio data
            const metadata = {
              timestamp: Date.now(),
              sampleCount: combined.length,
              sampleRate: this.audioContext?.sampleRate
            };

            // Send metadata first
            this.socket.emit('audio_metadata', metadata);

            // Send raw audio data as binary
            this.socket.emit('audio_data', combined.buffer, (acknowledgement: AudioAcknowledgement) => {
              if (acknowledgement?.received) {
                console.log('Server acknowledged audio data');
              }
            });

            // Keep any remaining samples
            chunks = [];
          } else if (!this.isTranscribing) {
            // If not transcribing, just clear the chunks without sending
            chunks = [];
          } else {
            // If connection is lost, stop processing
            this.stopAudioStream();
            this.onStatusChange?.("Server Offline");
            this.onError?.("Server connection lost. Please try again later.");
          }
        }
      };

      source.connect(processor);
      processor.connect(this.audioContext.destination);

      this.onStatusChange?.("Streaming");
      console.log("Audio stream setup complete");

    } catch (error) {
      console.error('Error setting up audio stream:', error);
      this.onError?.(error instanceof Error ? error.message : String(error));
      this.stopAudioStream();
      throw error;
    }
  }

  setStatusChangeHandler(handler: (status: string) => void) {
    this.onStatusChange = handler;
  }

  setErrorHandler(handler: (error: string) => void) {
    this.onError = handler;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  isOffline(): boolean {
    return this.isServerOffline;
  }

  isStreaming(): boolean {
    return this.audioContext !== null && this.processor !== null;
  }

  // Add method to start transcription
  startTranscription() {
    this.isTranscribing = true;
    this.onStatusChange?.("Transcribing");
    console.log("Transcription started");
  }

  // Add method to stop transcription
  stopTranscription(): Promise<void> {
    return new Promise((resolve) => {
      this.isTranscribing = false;
      this.stopAudioStream();
      this.onStatusChange?.("Ready");
      console.log("Transcription stopped");
      resolve();
    });
  }
}

export const audioWebSocket = new AudioWebSocket();