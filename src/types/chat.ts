export interface ContextFile {
    id: string;
    name: string;
    type: string;
    size: string;
    selected: boolean;
}

export type Message = {
    id: string;
    content: string;
    timestamp: string;
    isUser: boolean;
    isLoading?: boolean;
    isStreaming?: boolean;
};

export interface TranscriptionChatProps {
    onSendMessage: (message: string) => void;
}

export interface InsightData {
    text: string;
} 