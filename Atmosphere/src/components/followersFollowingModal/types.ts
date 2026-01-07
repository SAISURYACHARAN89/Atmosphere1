export interface User {
    _id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    verified?: boolean;
}

export type TabType = 'followers' | 'following';

export interface FollowersFollowingModalProps {
    visible: boolean;
    onClose: () => void;
    userId: string;
    username?: string;
    initialTab?: TabType;
    followersCount?: number;
    followingCount?: number;
    onUserPress?: (userId: string) => void;
}

export interface UserListItemProps {
    user: User;
    listType: TabType;
    currentUserId: string | null;
    isFollowing: boolean;
    isLoading: boolean;
    onToggleFollow: (userId: string) => void;
    onRemove: (userId: string, listType: TabType) => void;
    onPress: (userId: string) => void;
}
