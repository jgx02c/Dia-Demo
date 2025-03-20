import { AudioFile, Bookmark } from '@/types/transcription';

export const mockFiles: AudioFile[] = [
    {
        id: '1',
        name: 'Smith Deposition.mp3',
        type: 'audio/mp3',
        duration: '30:00',
        date: '2024-10-10',
        size: '28.5 MB'
    },
    {
        id: '2',
        name: 'Green Testimony.mp3',
        type: 'audio/mp3',
        duration: '45:15',
        date: '2024-10-10',
        size: '42.3 MB'
    }
];

export const mockBookmarks: Bookmark[] = [
    {
        id: '1',
        fileId: '1',
        text: 'Key testimony about intersection visibility',
        timestamp: '12:30'
    },
    {
        id: '2',
        fileId: '1',
        text: 'Discussion of pedestrian behavior',
        timestamp: '15:45'
    },
    {
        id: '3',
        fileId: '2',
        text: 'Witness describes accident scene',
        timestamp: '23:10'
    }
]; 