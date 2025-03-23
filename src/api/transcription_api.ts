import { transcriptionWebSocket } from './transcription_websocket';
import { audioWebSocket } from './audio_websocket';

export const startTranscription = async (): Promise<void> => {
  try {
    if (transcriptionWebSocket.isOffline()) {
      throw new Error('Server is currently offline. Please try again later.');
    }
    await transcriptionWebSocket.startTranscription();
  } catch (error) {
    console.error('Error starting transcription:', error);
    // Only throw if it's not a server offline error
    if (!(error instanceof Error && error.message.includes('offline'))) {
      throw new Error('Failed to start transcription. Please try again.');
    }
    throw error;
  }
};

export const stopTranscription = async (): Promise<void> => {
  try {
    if (transcriptionWebSocket.isOffline()) {
      throw new Error('Server is currently offline. Please try again later.');
    }

    // Stop both audio and transcription in parallel
    await Promise.all([
      audioWebSocket.stopTranscription(),
      transcriptionWebSocket.stopTranscription()
    ]);
  } catch (error) {
    console.error('Error stopping transcription:', error);
    // Only throw if it's not a server offline error
    if (!(error instanceof Error && error.message.includes('offline'))) {
      throw new Error('Failed to stop transcription. Please try again.');
    }
    throw error;
  }
};
