import React, { useState } from 'react';
import { Socket } from 'socket.io-client';

interface Speaker {
  id: string;
  name: string;
  color: string;
  isUnidentified?: boolean;
}

interface Sentence {
  text: string;
  speaker?: string;
}

interface TranscriptionBoxProps {
  socket: Socket | null;
  audioDevices: MediaDeviceInfo[];
  selectedDeviceId: string;
  onDeviceSelect: (deviceId: string) => void;
  onStartTranscription: () => void;
  onStopTranscription: () => void;
}

const speakerColors: { [key: string]: string } = {
  speaker1: '#5865f2', // Discord blue
  speaker2: '#3ba55c', // Discord green
  default: '#b9bbbe', // Discord grey
};

export default function TranscriptionBox({
  socket,
  audioDevices,
  selectedDeviceId,
  onDeviceSelect,
  onStartTranscription,
  onStopTranscription,
}: TranscriptionBoxProps) {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speakers, setSpeakers] = useState<Speaker[]>([
    { id: '1', name: 'John Smith', color: '#5865f2' },
    { id: '2', name: 'Sarah Johnson', color: '#3ba55c' },
    { id: 'unidentified-1', name: 'Unknown Speaker 1', color: '#ed4245', isUnidentified: true },
  ]);
  const [showSpeakers, setShowSpeakers] = useState(false);
  const [showMicSettings, setShowMicSettings] = useState(false);
  const [transcriptions, setTranscriptions] = useState<Sentence[]>([]);
  const [buffer, setBuffer] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Ready");

  React.useEffect(() => {
    if (!socket) return;

    socket.on("transcription_buffer", (data: { buffer: string }) => {
      console.log("Received buffer:", data.buffer);
      setBuffer(data.buffer);
    });

    socket.on("clear_buffer", () => {
      setBuffer('');
    });

    socket.on("transcription_data", (data: { text: string, speaker?: string }) => {
      console.log("Received transcription data:", data);
      setTranscriptions(prev => [...prev, { text: data.text, speaker: data.speaker }]);
    });

    return () => {
      socket.off("transcription_buffer");
      socket.off("clear_buffer");
      socket.off("transcription_data");
    };
  }, [socket]);

  const handleStartTranscription = () => {
    if (!socket) return;
    setIsTranscribing(true);
    setConnectionStatus("Recording");
    onStartTranscription();
  };

  const handleStopTranscription = () => {
    if (!socket) return;
    setIsTranscribing(false);
    setConnectionStatus("Ready");
    onStopTranscription();
  };

  const handleAssignSpeaker = (speakerId: string, newName: string) => {
    setSpeakers(speakers.map(speaker => 
      speaker.id === speakerId 
        ? { ...speaker, name: newName, isUnidentified: false }
        : speaker
    ));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Main Transcription Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="whitespace-pre-wrap text-[#dcddde] font-mono">
          {transcriptions.map((sentence, index) => (
            <span
              key={index}
              style={{
                color: speakerColors[sentence.speaker || "default"],
                display: "block",
                margin: "2px 0",
                padding: "2px",
              }}
            >
              {sentence.text}
            </span>
          ))}
          {buffer && <div className="text-[#72767d]">{buffer}</div>}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-[#36393e]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSpeakers(true)}
              className="p-1.5 text-[#b9bbbe] hover:text-[#dcddde] transition-colors rounded"
              title="Speaker Assignment"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
            <button
              onClick={() => setShowMicSettings(true)}
              className="p-1.5 text-[#b9bbbe] hover:text-[#dcddde] transition-colors rounded"
              title="Microphone Settings"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <span className={`px-2 py-1 rounded text-xs flex items-center gap-2 ${
              isTranscribing 
                ? 'bg-green-500/10 text-green-400'
                : 'bg-[#4f545c] text-[#b9bbbe]'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                connectionStatus === "Recording" 
                  ? 'bg-green-500' 
                  : connectionStatus === "Connecting..." 
                    ? 'bg-yellow-500'
                    : connectionStatus === "Connection Error"
                      ? 'bg-red-500'
                      : 'bg-[#72767d]'
              }`} />
              {connectionStatus}
            </span>
          </div>
          <button
            onClick={isTranscribing ? handleStopTranscription : handleStartTranscription}
            className={`p-1.5 rounded flex items-center space-x-2 text-sm ${
              isTranscribing 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-[#5865f2] hover:bg-[#4752c4] text-white'
            } transition-colors`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isTranscribing ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M10 9v6m4-6v6" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Speaker Assignment Modal */}
      {showSpeakers && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#36393e] rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-[#4f545c] flex justify-between items-center">
              <h3 className="text-[#dcddde] font-medium">Speaker Assignment</h3>
              <button
                onClick={() => setShowSpeakers(false)}
                className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-2">
              {speakers.map((speaker) => (
                <div 
                  key={speaker.id}
                  className="flex items-center justify-between p-3 bg-[#2f3136] rounded-md border border-[#4f545c]"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: speaker.color }}
                    />
                    {speaker.isUnidentified ? (
                      <input
                        type="text"
                        value={speaker.name}
                        onChange={(e) => handleAssignSpeaker(speaker.id, e.target.value)}
                        className="bg-[#36393e] text-[#dcddde] px-3 py-1.5 rounded-md border border-[#4f545c] focus:outline-none focus:ring-1 focus:ring-[#5865f2] placeholder-[#72767d]"
                      />
                    ) : (
                      <span className="text-[#dcddde]">{speaker.name}</span>
                    )}
                  </div>
                  {speaker.isUnidentified && (
                    <button
                      onClick={() => handleAssignSpeaker(speaker.id, speaker.name)}
                      className="px-3 py-1.5 bg-[#4f545c] text-[#dcddde] rounded-md hover:bg-[#5d6269] transition-colors text-sm"
                    >
                      Assign
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Microphone Settings Modal */}
      {showMicSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#36393e] rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-[#4f545c] flex justify-between items-center">
              <h3 className="text-[#dcddde] font-medium">Microphone Settings</h3>
              <button
                onClick={() => setShowMicSettings(false)}
                className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#b9bbbe] mb-2">Input Device</label>
                <select 
                  value={selectedDeviceId}
                  onChange={(e) => onDeviceSelect(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#2f3136] border border-[#4f545c] rounded-md text-[#dcddde] focus:outline-none focus:ring-1 focus:ring-[#5865f2]"
                >
                  {audioDevices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Microphone ${device.deviceId}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#b9bbbe] mb-2">Input Volume</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="75"
                  className="w-full"
                />
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setShowMicSettings(false)}
                  className="px-4 py-2 bg-[#5865f2] text-white text-sm rounded-md hover:bg-[#4752c4] transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 