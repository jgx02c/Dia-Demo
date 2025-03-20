export interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: {
    name: string;
    avatar: string;
    isUser: boolean;
  };
  attachments?: ContextFile[];
}

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread?: boolean;
}

export interface ContextFile {
  id: string;
  name: string;
  type: string;
  size: string;
  selected: boolean;
}

export interface Case {
  id: string;
  title: string;
  files: ContextFile[];
}

export interface ChatContextProps {
  context?: string;
  selectedFiles: ContextFile[];
  caseId: string;
} 