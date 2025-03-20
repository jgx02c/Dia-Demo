export interface AudioFile {
  id: string;
  name: string;
  type: string;
  duration: string;
  date: string;
  size: string;
}

export interface Bookmark {
  id: string;
  fileId: string;
  text: string;
  timestamp: string;
}

export interface TranscriptionChatMessage {
  message: string;
} 