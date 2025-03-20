import React, { useState } from 'react';
import type { PreviewItem, CaseFile, Transcription, Bookmark } from '@/types/case-details';
import type { StrategyInstruction } from '@/types/strategy';

interface DocumentPreviewProps {
  item: PreviewItem;
  onClose: () => void;
}

export default function DocumentPreview({ item, onClose }: DocumentPreviewProps) {
  const [showSettings, setShowSettings] = useState(false);

  const getItemTitle = () => {
    switch (item.type) {
      case 'document':
        return (item.data as CaseFile).name;
      case 'transcription':
        return (item.data as Transcription).title;
      case 'bookmark':
        return (item.data as Bookmark).title;
      case 'strategy':
        return (item.data as StrategyInstruction).title;
      default:
        return '';
    }
  };

  const getItemDetails = () => {
    switch (item.type) {
      case 'document':
        const file = item.data as CaseFile;
        return `${file.type} • ${file.size}`;
      case 'transcription':
        const transcription = item.data as Transcription;
        return `${transcription.type} • ${transcription.duration}`;
      case 'bookmark':
        const bookmark = item.data as Bookmark;
        return bookmark.type;
      case 'strategy':
        const strategy = item.data as StrategyInstruction;
        return `Strategy • ${strategy.documentType}`;
      default:
        return '';
    }
  };

  const getPreviewIcon = () => {
    switch (item.type) {
      case 'document':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        );
      case 'transcription':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        );
      case 'bookmark':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        );
      case 'strategy':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        );
      default:
        return null;
    }
  };

  const getItemContent = () => {
    switch (item.type) {
      case 'bookmark':
        const bookmark = item.data as Bookmark;
        return bookmark.excerpt;
      case 'strategy':
        const strategy = item.data as StrategyInstruction;
        return strategy.description;
      default:
        return null;
    }
  };

  const getItemStatus = () => {
    if (item.type === 'transcription') {
      const transcription = item.data as Transcription;
      return transcription.status;
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="bg-[#2f3136] border-b border-[#4f545c] p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-[#b9bbbe]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {getPreviewIcon()}
              </svg>
              <div>
                <h2 className="text-xl font-semibold text-[#dcddde]">{getItemTitle()}</h2>
                <span className="text-[#b9bbbe] text-sm">{getItemDetails()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#2f3136] p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* Preview Content */}
            <div className="bg-[#36393e] border border-[#4f545c] rounded-lg p-6">
              {/* Status Bar */}
              {getItemStatus() && (
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#4f545c]">
                  <span className="text-[#dcddde] font-medium">Status</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      getItemStatus() === 'completed' ? 'bg-green-400' :
                      getItemStatus() === 'processing' ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`} />
                    <span className="text-[#b9bbbe] text-sm capitalize">{getItemStatus()}</span>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="space-y-4">
                {getItemContent() ? (
                  <div className="text-[#dcddde] leading-relaxed">
                    {getItemContent()}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-[#b9bbbe] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {getPreviewIcon()}
                    </svg>
                    <p className="text-[#dcddde] font-medium">Preview not available</p>
                    <p className="text-[#b9bbbe] text-sm mt-2">This file type cannot be previewed</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute top-14 right-4 w-56 bg-[#36393e] border border-[#4f545c] rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2">
              <div className="space-y-0.5">
                <button className="w-full text-left px-3 py-2 text-[#b9bbbe] hover:bg-[#2f3136] rounded-md transition-colors flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
                <button className="w-full text-left px-3 py-2 text-[#b9bbbe] hover:bg-[#2f3136] rounded-md transition-colors flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
                <div className="h-px bg-[#4f545c] my-1"></div>
                <button className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-400/10 rounded-md transition-colors flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 