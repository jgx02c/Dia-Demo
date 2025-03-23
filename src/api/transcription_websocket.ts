import { Socket, io } from "socket.io-client";


class TranscriptionWebSocket {
  private socket: Socket | null = null;
  private onStatusChange: ((status: string) => void) | null = null;
  private onTranscriptionData: ((data: { text: string; is_final: boolean }) => void) | null = null;
  private onSessionStart: ((sessionId: string) => void) | null = null;
  private onSessionEnd: (() => void) | null = null;
  private onError: ((error: string) => void) | null = null;
  private onBufferUpdate: ((buffer: string) => void) | null = null;
  private onBufferClear: (() => void) | null = null;
  private onTranscriptionStarted: (() => void) | null = null;
  private onTranscriptionStopped: (() => void) | null = null;
  private isServerOffline: boolean = false;

  connect() {
    if (this.socket) return;

    this.socket = io('https://dialogica-demo-backend-c058.onrender.com/ws/transcription/stream', {
      path: '/socket.io',
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log("Socket.IO connection established");
      this.onStatusChange?.("Connected");
      this.isServerOffline = false;
      
      // Register as a transcription client
      this.socket?.emit('register_transcription');
    });

    this.socket.on('connection_established', (data: { status: string }) => {
      console.log("Connection established:", data.status);
    });

    this.socket.on('transcription_registered', (data: { status: string }) => {
      console.log("Registered as transcription client:", data.status);
    });

    // Transcription events
    this.socket.on('transcription', (data: { text: string; is_final: boolean }) => {
      //console.log("Received transcription:", data.is_final ? "final" : "partial", data.text);
      if (data.is_final) {
        this.onTranscriptionData?.(data);
        this.onBufferClear?.();
      } else {
        this.onBufferUpdate?.(data.text);
      }
    });

    this.socket.on('session_opened', (data: { session_id: string }) => {
      console.log("Transcription session opened:", data.session_id);
      this.onSessionStart?.(data.session_id);
    });

    this.socket.on('session_closed', () => {
      console.log("Transcription session closed");
      this.onSessionEnd?.();
    });

    // Transcription control events
    this.socket.on('transcription_started', (data: { status: string }) => {
      console.log("Transcription started:", data.status);
      this.onTranscriptionStarted?.();
    });

    this.socket.on('transcription_stopped', (data: { status: string }) => {
      console.log("Transcription stopped:", data.status);
      this.onTranscriptionStopped?.();
    });

    // Error handling
    this.socket.on('connect_error', (error) => {
      console.error("Connection error:", error);
      this.isServerOffline = true;
      this.onStatusChange?.("Server Offline");
      this.onError?.("Server is currently offline. Please try again later.");
    });

    this.socket.on('error', (error: { message: string }) => {
      console.error("Socket error:", error.message);
      this.onError?.(error.message);
    });

    this.socket.on('disconnect', (reason) => {
      console.log("Socket disconnected:", reason);
      this.isServerOffline = reason === 'io server disconnect' || reason === 'transport close';
      this.onStatusChange?.(this.isServerOffline ? "Server Offline" : "Disconnected");
    });
  }

  disconnect() {
    if (this.socket) {
      console.log("Disconnecting from WebSocket server");
      this.socket.disconnect();
      this.socket = null;
    }
  }

  setStatusChangeHandler(handler: (status: string) => void) {
    this.onStatusChange = handler;
  }

  setTranscriptionDataHandler(handler: (data: { text: string; is_final: boolean }) => void) {
    this.onTranscriptionData = handler;
  }

  setSessionStartHandler(handler: (sessionId: string) => void) {
    this.onSessionStart = handler;
  }

  setSessionEndHandler(handler: () => void) {
    this.onSessionEnd = handler;
  }

  setErrorHandler(handler: (error: string) => void) {
    this.onError = handler;
  }

  setBufferUpdateHandler(handler: (buffer: string) => void) {
    this.onBufferUpdate = handler;
  }

  setBufferClearHandler(handler: () => void) {
    this.onBufferClear = handler;
  }

  setTranscriptionStartedHandler(handler: () => void) {
    this.onTranscriptionStarted = handler;
  }

  setTranscriptionStoppedHandler(handler: () => void) {
    this.onTranscriptionStopped = handler;
  }

  startTranscription(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected || this.isServerOffline) {
        reject(new Error('Server is currently offline. Please try again later.'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Failed to start transcription. Please try again.'));
      }, 5000);

      this.onTranscriptionStarted = () => {
        clearTimeout(timeout);
        resolve();
      };

      this.socket.emit('start_transcription');
    });
  }

  stopTranscription(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected || this.isServerOffline) {
        console.error('Cannot stop transcription: Server is offline or disconnected');
        reject(new Error('Server is currently offline. Please try again later.'));
        return;
      }

      console.log('Attempting to stop transcription...');

      // Set up the event handler before emitting
      const handleTranscriptionStopped = (data: { status: string }) => {
        console.log('Received transcription_stopped event from server:', data.status);
        clearTimeout(timeout);
        this.socket?.off('transcription_stopped', handleTranscriptionStopped);
        this.onTranscriptionStopped?.();
        resolve();
      };

      // Add the event listener first
      this.socket.on('transcription_stopped', handleTranscriptionStopped);

      // Set up timeout after adding listener
      const timeout = setTimeout(() => {
        console.error('Stop transcription timeout - no response from server after 5s');
        this.socket?.off('transcription_stopped', handleTranscriptionStopped);
        reject(new Error('Failed to stop transcription. Please try again.'));
      }, 5000);

      // Emit the stop event last
      console.log('Emitting stop_transcription event...');
      this.socket.emit('stop_transcription');
    });
  }

  // Helper method to check connection status
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // Helper method to check if server is offline
  isOffline(): boolean {
    return this.isServerOffline;
  }
}

export const transcriptionWebSocket = new TranscriptionWebSocket();