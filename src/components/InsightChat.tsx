import React, { useState, useRef, useEffect } from 'react';
import type { ContextFile, Message, TranscriptionChatProps} from '@/types/chat';
import { insightWebSocket } from '@/api/insight_websocket';

export default function InsightChat({
  onSendMessage,
}: TranscriptionChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [attachments, setAttachments] = useState<ContextFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("🔄 Setting up insight WebSocket connection...");
    
    insightWebSocket.connect({
      onInsightStart: () => {
        console.log("🎬 INSIGHT UI: Starting new insight generation");
        const newMessage: Message = {
          id: Date.now().toString(),
          content: "",
          timestamp: new Date().toISOString(),
          isUser: false,
          isStreaming: true
        };
        setCurrentStreamingMessage(newMessage);
        setMessages(prev => [...prev, newMessage]);
      },
      
      onInsightData: (data) => {
        if (data.type !== 'insight') {
          console.warn("⚠️ Received non-insight data:", data);
          return;
        }
        
        console.log("📨 INSIGHT UI: Received insight chunk");
        setCurrentStreamingMessage(prev => {
          if (!prev) {
            console.warn("⚠️ Received insight data but no active streaming message");
            return null;
          }
          
          const updated = {
            ...prev,
            content: prev.content + data.text
          };
          
          // Update in messages array
          setMessages(messages => 
            messages.map(msg => 
              msg.id === prev.id ? updated : msg
            )
          );
          
          return updated;
        });
      },
      
      onInsightFinished: () => {
        console.log("🎭 INSIGHT UI: Generation complete");
        setCurrentStreamingMessage(prev => {
          if (!prev) {
            console.warn("⚠️ Received completion but no active streaming message");
            return null;
          }
          
          const completed = {
            ...prev,
            isStreaming: false
          };
          
          // Update final state in messages array
          setMessages(messages => 
            messages.map(msg => 
              msg.id === prev.id ? completed : msg
            )
          );
          
          return null;
        });
      },
      
      onError: (err) => {
        console.error("💥 INSIGHT UI: Error occurred:", err.message);
        setError(err.message);
        // Clear streaming state on error
        setCurrentStreamingMessage(null);
      },
      
      onStatusChange: (status) => {
        console.log("🔄 INSIGHT UI: Connection status changed:", status);
      }
    });

    return () => {
      console.log("👋 INSIGHT UI: Cleaning up WebSocket connection");
      insightWebSocket.disconnect();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      timestamp: new Date().toISOString(),
      isUser: true
    };

    setMessages(prev => [...prev, newMessage]);
    onSendMessage(inputMessage);
    setInputMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-4 ${message.isUser ? 'justify-end' : ''}`}
          >
            {!message.isUser && (
              <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            )}
            <div className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'}`}>
              <span className="text-[#72767d] text-xs">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
              <div className={`mt-1 px-4 py-2 rounded-lg ${
                message.isUser
                  ? 'bg-[#5865f2] text-white max-w-sm ml-12'
                  : 'bg-[#2f3136] text-[#dcddde] border border-[#4f545c] max-w-5xl mr-4'
              }`}>
                <p className="whitespace-pre-wrap text-sm">
                  {message.content}
                  {currentStreamingMessage?.id === message.id && "▊"}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-[#36393e]">
        {attachments.length > 0 && (
          <div className="mb-2 p-2 bg-[#2f3136] rounded-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-[#b9bbbe]">Attachments:</span>
              <button
                onClick={() => setAttachments([])}
                className="text-[#b9bbbe] hover:text-[#dcddde]"
              >
                Clear all
              </button>
            </div>
            <div className="space-y-1">
              {attachments.map(file => (
                <div key={file.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-[#b9bbbe]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="text-[#dcddde]">{file.name}</span>
                    <span className="text-[#72767d]">({file.size})</span>
                  </div>
                  <button
                    onClick={() => setAttachments(prev => prev.filter(f => f.id !== file.id))}
                    className="text-[#b9bbbe] hover:text-[#dcddde]"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="flex-1 flex items-center bg-[#2f3136] rounded-md">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask about the transcription..."
              className="flex-1 px-3 py-2 bg-transparent text-[#dcddde] placeholder-[#72767d] text-sm resize-none focus:outline-none"
              rows={1}
            />
            <div className="flex items-center px-2 space-x-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    const newAttachments: ContextFile[] = Array.from(files).map(file => ({
                      id: Math.random().toString(),
                      name: file.name,
                      type: file.type,
                      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                      selected: true
                    }));
                    setAttachments(prev => [...prev, ...newAttachments]);
                  }
                }}
                className="hidden"
                multiple
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 text-[#b9bbbe] hover:text-[#dcddde] transition-colors rounded"
                title="Upload files"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <button
                type="submit"
                disabled={!inputMessage.trim() && attachments.length === 0}
                className="p-1.5 bg-[#5865f2] text-white rounded hover:bg-[#4752c4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </form>
        {error && <div className="mt-2 text-xs text-red-500">{error}</div>}
        <p className="mt-2 text-xs text-[#72767d]">Press Enter to send, Shift + Enter for new line</p>
      </div>
    </div>
  );
} 