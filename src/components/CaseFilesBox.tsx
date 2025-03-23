import React, { useState } from 'react';
import { DemoScript } from './DemoScript';

interface CaseFile {
  id: string;
  name: string;
  type: string;
  size: string;
}

interface Bookmark {
  id: string;
  text: string;
  timestamp: string;
  fileId: string;
}

export default function CaseFilesBox() {
  const [activeTab, setActiveTab] = useState<'files' | 'bookmarks' | 'script'>('script');
  const [searchTerm, setSearchTerm] = useState('');
  const files: CaseFile[] = [
    { id: '1', name: 'Interview Recording 1', type: 'audio', size: '12.5 MB' },
    { id: '2', name: 'Case Notes', type: 'document', size: '1.2 MB' },
    { id: '3', name: 'Evidence Photo 1', type: 'image', size: '3.4 MB' }
  ];
  const bookmarks: Bookmark[] = [
    { id: '1', text: 'Important admission at 2:30', timestamp: '2:30', fileId: '1' },
    { id: '2', text: 'Key detail about location', timestamp: '5:45', fileId: '1' },
    { id: '3', text: 'Reference to earlier case', timestamp: '8:15', fileId: '1' }
  ];

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileSelect = (file: CaseFile) => {
    console.log('Selected file:', file);
    // Handle file selection logic here
  };

  const handleBookmarkSelect = (bookmark: Bookmark) => {
    console.log('Selected bookmark:', bookmark);
    // Handle bookmark selection logic here
  };

  return (
    <div className="flex flex-col h-full bg-[#2f3136] rounded-lg overflow-hidden">
      {/* Header with Tabs */}
      <div className="bg-[#2f3136]">
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('script')}
              className={`px-4 py-2 rounded-t-lg transition-colors relative ${
                activeTab === 'script'
                  ? 'bg-[#36393e] text-[#dcddde]'
                  : 'text-[#b9bbbe] hover:bg-[#36393e]/50 hover:text-[#dcddde]'
              }`}
            >
              Demo Script
              {activeTab === 'script' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#5865f2]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`px-4 py-2 rounded-t-lg transition-colors relative ${
                activeTab === 'files'
                  ? 'bg-[#36393e] text-[#dcddde]'
                  : 'text-[#b9bbbe] hover:bg-[#36393e]/50 hover:text-[#dcddde]'
              }`}
            >
              Evidence
              {activeTab === 'files' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#5865f2]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`px-4 py-2 rounded-t-lg transition-colors relative ${
                activeTab === 'bookmarks'
                  ? 'bg-[#36393e] text-[#dcddde]'
                  : 'text-[#b9bbbe] hover:bg-[#36393e]/50 hover:text-[#dcddde]'
              }`}
            >
              Bookmarks
              {activeTab === 'bookmarks' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#5865f2]" />
              )}
            </button>
          </div>

          {activeTab !== 'script' && (
            <div className="relative w-56">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full h-8 px-3 bg-[#36393e] border border-[#4f545c] rounded-md pl-8 focus:outline-none focus:border-[#5865f2] placeholder-[#72767d] text-sm"
              />
              <svg
                className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-[#72767d]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          )}
        </div>
        <div className="h-[2px] bg-[#4f545c] mt-0" />
      </div>

      {/* Content */}
      {activeTab === 'script' ? (
        <DemoScript />
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {activeTab === 'files' ? (
            <>
              {filteredFiles.map((file) => (
                <button
                  key={file.id}
                  onClick={() => handleFileSelect(file)}
                  className="w-full p-3 bg-[#36393e] rounded-md hover:bg-[#40444b] transition-colors flex items-center space-x-3"
                >
                  <svg className="w-5 h-5 text-[#b9bbbe]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <div className="flex-1 text-left">
                    <p className="text-[#dcddde]">{file.name}</p>
                    <p className="text-[#72767d] text-sm">{file.size}</p>
                  </div>
                </button>
              ))}
              {filteredFiles.length === 0 && (
                <div className="text-center py-8 text-[#b9bbbe]">
                  No files found
                </div>
              )}
            </>
          ) : (
            <>
              {filteredBookmarks.map((bookmark) => (
                <button
                  key={bookmark.id}
                  onClick={() => handleBookmarkSelect(bookmark)}
                  className="w-full p-3 bg-[#36393e] rounded-md hover:bg-[#40444b] transition-colors text-left"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#dcddde] font-medium">
                      {files.find(f => f.id === bookmark.fileId)?.name}
                    </span>
                    <span className="text-[#72767d] text-sm">{bookmark.timestamp}</span>
                  </div>
                  <p className="text-[#b9bbbe] text-sm line-clamp-2">{bookmark.text}</p>
                </button>
              ))}
              {filteredBookmarks.length === 0 && (
                <div className="text-center py-8 text-[#b9bbbe]">
                  No bookmarks found
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
} 