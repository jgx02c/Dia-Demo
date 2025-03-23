import { Socket, io } from 'socket.io-client';

const LOCAL_IP_ADDRESS = 'http://localhost:8000';

interface AudioConfigCallbacks {
  onDevicesUpdate: (devices: MediaDeviceInfo[]) => void;
  onDeviceSelect: (deviceId: string) => void;
  onBitRateUpdate: (bitRate: string) => void;
  onSocketUpdate: (socket: Socket | null) => void;
  onStreamUpdate: (stream: MediaStream | null) => void;
  onContextUpdate: (context: AudioContext | null) => void;
}

export const initializeWebSocket = (callbacks: Pick<AudioConfigCallbacks, 'onSocketUpdate'>) => {
  const newSocket = io(LOCAL_IP_ADDRESS, { transports: ['websocket'] });
  console.log("WebSocket connection established.");
  callbacks.onSocketUpdate(newSocket);

  return () => {
    newSocket.close();
    console.log("WebSocket connection closed.");
  };
};

export const requestMicrophoneAccess = async (
  callbacks: Pick<AudioConfigCallbacks, 'onDevicesUpdate' | 'onDeviceSelect'>
) => {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter(device => device.kind === 'audioinput');
    callbacks.onDevicesUpdate(audioDevices);
    if (audioDevices.length > 0) {
      callbacks.onDeviceSelect(audioDevices[0].deviceId);
    }
  } catch (error) {
    console.error('Error accessing microphone:', error);
  }
};

export const updateBitRate = async (
  selectedDeviceId: string,
  callbacks: Pick<AudioConfigCallbacks, 'onBitRateUpdate'>
) => {
  if (!selectedDeviceId) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined }
    });

    const audioTrack = stream.getAudioTracks()[0];
    const settings = audioTrack.getSettings();

    if (settings.sampleRate) {
      callbacks.onBitRateUpdate(`${settings.sampleRate}`);
      console.log(`${settings.sampleRate} Hz`);
    }

    // Clean up the temporary stream
    stream.getTracks().forEach(track => track.stop());
  } catch (error) {
    console.error('Error getting bit rate:', error);
  }
};

export const setupAudioStream = async (
  selectedDeviceId: string,
  socket: Socket | null,
  callbacks: Pick<AudioConfigCallbacks, 'onStreamUpdate' | 'onContextUpdate'>
): Promise<(() => void) | undefined> => {
  try {
    if (!selectedDeviceId) return;

    const constraints = { audio: { deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined } };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    const audioContext = new AudioContext({
      sampleRate: 16000
    });

    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    let chunks: Int16Array[] = [];
    let nextTime = 0;

    processor.onaudioprocess = function (e) {
      const input = e.inputBuffer.getChannelData(0);
      const buffer = new Int16Array(input.map(n => Math.floor(n * 32767)));
      chunks.push(buffer);

      const currentTime = audioContext.currentTime;

      if (currentTime > nextTime) {
        nextTime += 0.25;

        if (socket && socket.connected) {
          const totalLength = chunks.reduce((acc, val) => acc + val.length, 0);
          const combined = new Int16Array(totalLength);

          let offset = 0;
          for (const chunk of chunks) {
            combined.set(chunk, offset);
            offset += chunk.length;
          }

          socket.emit('audio', combined.slice(0, Math.min(4000, combined.length)));
          chunks = [new Int16Array(combined.slice(4000))];
        }
      }
    };

    source.connect(processor);
    processor.connect(audioContext.destination);
    
    callbacks.onStreamUpdate(stream);
    callbacks.onContextUpdate(audioContext);

    return () => {
      stream.getTracks().forEach(track => track.stop());
      audioContext.close();
      callbacks.onStreamUpdate(null);
      callbacks.onContextUpdate(null);
    };
  } catch (error) {
    console.error('Error accessing microphone:', error);
    callbacks.onStreamUpdate(null);
    callbacks.onContextUpdate(null);
    return undefined;
  }
}; 