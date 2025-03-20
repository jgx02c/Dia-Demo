import React, { useState, useEffect } from 'react';

//For Microphone Socket
import { LOCAL_IP_ADDRESS } from '@/app/constants';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import TranscriptionBox from '@/components/transcription/TranscriptionBox';
import CaseFilesBox from '@/components/transcription/CaseFilesBox';
import TranscriptionChat from '@/components/transcription/TranscriptionChat';
import { TranscriptionOnboarding } from '@/components/transcription/TranscriptionOnboarding';

// Mock data for development
const mockFiles = [
  {
    id: '1',
    name: 'Interview Recording 1',
    type: 'audio/wav',
    size: '24.5 MB'
  },
  {
    id: '2',
    name: 'Meeting Recording 2',
    type: 'audio/wav',
    size: '15.2 MB'
  }
];

const mockBookmarks = [
  {
    id: '1',
    text: 'Key Statement',
    timestamp: '00:15:30',
    fileId: '1'
  },
  {
    id: '2',
    text: 'Evidence Reference',
    timestamp: '00:45:20',
    fileId: '2'
  }
];

export default function TranscriptionPage() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [config, setConfig] = useState<{ caseId: string; databaseId: string; instructionId: string } | null>(null);   

  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Establish WebSocket connection when config is available
  useEffect(() => {
    if (!config || isConnecting) return;

    setIsConnecting(true);
    console.log("Establishing WebSocket connection with config:", config);

    const newSocket = io(`${LOCAL_IP_ADDRESS}`, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      query: {
        caseId: config.caseId,
        databaseId: config.databaseId,
        instructionId: config.instructionId
      }
    });

    newSocket.on('connect', () => {
      console.log("WebSocket connection established");
      setSocket(newSocket);
      setIsConnecting(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error("WebSocket connection error:", error);
      setIsConnecting(false);
    });

    newSocket.on('disconnect', (reason) => {
      console.log("WebSocket disconnected:", reason);
      if (reason === 'io server disconnect') {
        newSocket.connect();
      }
    });

    return () => {
      if (newSocket) {
        console.log("Cleaning up WebSocket connection");
        newSocket.close();
      }
      setIsConnecting(false);
    };
  }, [config, isConnecting]);

  // Get microphone access
  useEffect(() => {
    const requestMicrophoneAccess = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(device => device.kind === 'audioinput');
        setAudioInputDevices(audioDevices);
        if (audioDevices.length > 0) {
          setSelectedDeviceId(audioDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };
    requestMicrophoneAccess();
  }, []);

  // Setup audio stream
  useEffect(() => {
    let audioContextInstance: AudioContext | null = null;
    let processorNode: ScriptProcessorNode | null = null;
    let sourceNode: MediaStreamAudioSourceNode | null = null;
    let currentStream: MediaStream | null = null;

    const setupAudioStream = async () => {
      if (!selectedDeviceId || !socket?.connected) {
        console.log("Waiting for device selection and socket connection...");
        return;
      }

      try {
        console.log("Setting up audio stream...");

        // Get microphone stream
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { 
            deviceId: { exact: selectedDeviceId },
            sampleRate: 16000,
            channelCount: 1
          }
        });
        currentStream = stream;

        // Create audio context
        audioContextInstance = new AudioContext({ sampleRate: 16000 });
        sourceNode = audioContextInstance.createMediaStreamSource(stream);
        processorNode = audioContextInstance.createScriptProcessor(4096, 1, 1);

        let chunks: Int16Array[] = [];
        let nextTime = 0;

        processorNode.onaudioprocess = (e) => {
          if (!socket.connected) {
            console.log("Socket disconnected, stopping audio processing");
            return;
          }

          const input = e.inputBuffer.getChannelData(0);
          const buffer = new Int16Array(input.map(n => Math.floor(n * 32767)));
          chunks.push(buffer);

          const currentTime = audioContextInstance!.currentTime;

          if (currentTime > nextTime) {
            nextTime += 0.25;

            // Calculate total length and combine chunks
            const totalLength = chunks.reduce((acc, val) => acc + val.length, 0);
            const combined = new Int16Array(totalLength);
            let offset = 0;
            for (const chunk of chunks) {
              combined.set(chunk, offset);
              offset += chunk.length;
            }

            // Send audio data
            socket.emit('audio', combined.slice(0, Math.min(4000, combined.length)));
            chunks = [new Int16Array(combined.slice(4000))];
          }
        };

        sourceNode.connect(processorNode);
        processorNode.connect(audioContextInstance.destination);

        console.log("Audio stream setup complete");
      } catch (error) {
        console.error('Error setting up audio stream:', error);
      }
    };

    setupAudioStream();

    return () => {
      console.log("Cleaning up audio stream...");
      if (processorNode) {
        processorNode.disconnect();
      }
      if (sourceNode) {
        sourceNode.disconnect();
      }
      if (audioContextInstance) {
        audioContextInstance.close();
      }
      if (currentStream) {
        currentStream.getTracks().forEach(track => {
          track.stop();
          console.log("Audio track stopped");
        });
      }
    };
  }, [selectedDeviceId, socket, socket?.connected]);

  const handleStartTranscription = () => {
    if (!socket?.connected || !config) {
      console.log("Cannot start transcription - socket not connected or config not set");
      return;
    }
    console.log("Starting transcription for case:", config.caseId);
    socket.emit('start_transcription', { 
      caseId: config.caseId,
      databaseId: config.databaseId,
      instructionId: config.instructionId
    });
  };

  const handleStopTranscription = () => {
    if (!socket?.connected || !config) {
      console.log("Cannot stop transcription - socket not connected or config not set");
      return;
    }
    console.log("Stopping transcription for case:", config.caseId);
    socket.emit('stop_transcription', { caseId: config.caseId });
  };

  const handleFileSelect = (file: { id: string; name: string; type: string; size: string }) => {
    console.log('Selected file:', file, 'for case:', config?.caseId);
  };

  const handleBookmarkSelect = (bookmark: { id: string; text: string; timestamp: string; fileId: string }) => {
    console.log('Selected bookmark:', bookmark, 'for case:', config?.caseId);
  };

  const handleSendMessage = (message: string) => {
    if (!config) return;
    console.log('Sending message:', message, 'for case:', config.caseId);
  };

  const handleOnboardingComplete = (newConfig: { caseId: string; databaseId: string; instructionId: string }) => {
    console.log("Onboarding complete with config:", newConfig);
    setConfig(newConfig);
    setIsConfigured(true);
  };

  return (
    <DashboardLayout>
      {!isConfigured ? (
        <TranscriptionOnboarding
          onComplete={handleOnboardingComplete}
          onCancel={() => window.history.back()}
        />
      ) : (
        <div className="flex h-screen bg-[#2f3136] p-6 gap-6">
          {/* Left Section - Transcription and Files (45%) */}
          <div className="w-[45%] flex flex-col gap-6">
            {/* Transcription Box */}
            <div className="h-[calc(100%-24rem)] bg-[#36393e] rounded-lg">
              <TranscriptionBox
                socket={socket}
                audioDevices={audioInputDevices}
                selectedDeviceId={selectedDeviceId}
                onDeviceSelect={setSelectedDeviceId}
                onStartTranscription={handleStartTranscription}
                onStopTranscription={handleStopTranscription}
              />
            </div>

            {/* Files Box */}
            <div className="h-96 bg-[#36393e] rounded-lg">
              <CaseFilesBox
                files={mockFiles}
                bookmarks={mockBookmarks}
                onFileSelect={handleFileSelect}
                onBookmarkSelect={handleBookmarkSelect}
              />
            </div>
          </div>

          {/* Right Section - Transcription Assistant (55%) */}
          <div className="w-[55%] bg-[#36393e] rounded-lg">
            <TranscriptionChat
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
} 