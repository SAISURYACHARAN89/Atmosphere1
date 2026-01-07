export interface SelectedVideo {
    uri: string;
    type?: string;
    fileName?: string;
    duration?: number;
    thumbnail?: string;
    isTrimmed?: boolean;
}

export type ReelStep = 'trim' | 'details';

export interface CreateReelProps {
    onClose: () => void;
    onSuccess?: () => void;
}
