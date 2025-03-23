import React, { useState, useEffect } from 'react';
import { audioWebSocket } from '@/api/audio_websocket';
import { startTranscription, stopTranscription } from '@/api/transcription_api';
import { sendMessage } from '@/api/insight_api';
import { requestMicrophoneAccess } from '@/utils/audioConfig';

import TranscriptionBox from '@/components/TranscriptionBox';
import CaseFilesBox from '@/components/CaseFilesBox';
import InsightChat from '@/components/InsightChat';

export default function DemoPage() {
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);

  // Initialize WebSocket connection
  useEffect(() => {
    let mounted = true;

    const initializeConnection = async () => {
      try {
        await audioWebSocket.connect();
        console.log('WebSocket connection initialized');
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        if (mounted) {
          setIsStreaming(false);
        }
      }
    };

    initializeConnection();
    
    // Set up status handlers
    audioWebSocket.setStatusChangeHandler((status) => {
      console.log('Audio WebSocket status:', status);
      if (mounted) {
        setIsStreaming(status === 'Streaming');
      }
    });

    audioWebSocket.setErrorHandler((error) => {
      console.error('Audio WebSocket error:', error);
      if (mounted) {
        setIsStreaming(false);
      }
    });

    return () => {
      mounted = false;
      audioWebSocket.disconnect();
    };
  }, []);

  // Get microphone access
  useEffect(() => {
    requestMicrophoneAccess({
      onDevicesUpdate: setAudioInputDevices,
      onDeviceSelect: setSelectedDeviceId
    });
  }, []);

  const handleStartTranscription = async () => {
    try {
      // Ensure we have a connection before setting up the stream
      if (!audioWebSocket.isConnected()) {
        console.log('Reconnecting to WebSocket before setting up audio stream...');
        await audioWebSocket.connect();
      }

      // Set up the audio stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: selectedDeviceId } }
      });
      
      await audioWebSocket.setupAudioStream(stream);
      await startTranscription();
      audioWebSocket.startTranscription();
      setIsStreaming(true);
      console.log('Transcription started');
    } catch (error) {
      console.error('Error starting transcription:', error);
      setIsStreaming(false);
    }
  };

  const handleStopTranscription = async () => {
    try {
      await stopTranscription();
      audioWebSocket.stopTranscription();
      setIsStreaming(false);
      console.log('Transcription stopped');
    } catch (error) {
      console.error('Error stopping transcription:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    try {
      await sendMessage(message);
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex h-screen bg-[#2f3136] p-6 gap-6">
      {/* Left Section - Transcription and Files (45%) */}
      <div className="w-[45%] flex flex-col gap-6">
        {/* Transcription Box */}
        <div className="h-[calc(100%-24rem)] bg-[#36393e] rounded-lg">
          <TranscriptionBox
            audioDevices={audioInputDevices}
            selectedDeviceId={selectedDeviceId}
            onDeviceSelect={setSelectedDeviceId}
            onStartTranscription={handleStartTranscription}
            onStopTranscription={handleStopTranscription}
            isStreaming={isStreaming}
          />
        </div>

        {/* Files Box */}
        <div className="h-96 bg-[#36393e] rounded-lg">
          <CaseFilesBox/>
        </div>
      </div>

      {/* Right Section - Transcription Assistant (55%) */}
      <div className="w-[55%] bg-[#36393e] rounded-lg">
        <InsightChat
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
} 