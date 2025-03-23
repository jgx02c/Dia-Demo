import type { AudioFile, Bookmark } from '@/types/transcription';

export const mockFiles: AudioFile[] = [
  {
    id: '1',
    name: 'Interview Recording 1',
    type: 'audio/wav',
    duration: '45:30',
    date: '2024-03-15',
    size: '24.5 MB'
  },
  {
    id: '2',
    name: 'Meeting Recording 2',
    type: 'audio/wav',
    duration: '32:15',
    date: '2024-03-16',
    size: '15.2 MB'
  }
];

export const mockBookmarks: Bookmark[] = [
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