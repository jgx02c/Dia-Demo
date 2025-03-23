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
  text: string;
  timestamp: string;
  fileId: string;
} 