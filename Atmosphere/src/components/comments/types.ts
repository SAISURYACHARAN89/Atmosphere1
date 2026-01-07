// Shared types for comments components
export type Comment = any;

export interface ReplyingTo {
    id: string;
    username: string;
    parentCommentId: string; // Always the top-level comment ID
}

export type CommentType = 'startup' | 'post' | 'reel';

export interface CommentsOverlayBaseProps {
    visible: boolean;
    onClose: () => void;
    onCommentAdded?: (newCount?: number) => void;
    onCommentDeleted?: (newCount?: number) => void;
}

export interface StartupCommentsProps extends CommentsOverlayBaseProps {
    startupId: string;
    type?: 'startup' | 'post';
}

export interface ReelCommentsProps extends CommentsOverlayBaseProps {
    reelId: string;
}
