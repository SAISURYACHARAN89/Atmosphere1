export interface ReelItem {
    _id: string;
    videoUrl: string;
    thumbnailUrl?: string;
    caption?: string;
    hashtags?: string[];
    author: {
        _id?: string;
        username: string;
        displayName?: string;
        avatarUrl?: string;
        verified?: boolean;
    };
    likesCount: number;
    commentsCount: number;
    viewsCount: number;
    sharesCount: number;
    isLiked?: boolean;
    isShared?: boolean;
    isFollowing?: boolean;
    isSaved?: boolean;
    savedId?: string;
}

export interface ReelsProps {
    userId?: string;
    initialReelId?: string;
    onBack?: () => void;
    onOpenProfile?: (userId: string) => void;
}

export interface ReelActionsProps {
    reel: ReelItem;
    likeLoading: boolean;
    saveLoading: boolean;
    onLike: () => void;
    onComment: () => void;
    onShare: () => void;
    onSave: () => void;
}
