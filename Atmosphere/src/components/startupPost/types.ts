export interface StartupCardStats {
    likes: number;
    comments: number;
    crowns: number;
    shares: number;
}

export interface StartupCard {
    id: string;
    name: string;
    displayName: string;
    verified: boolean;
    profileImage: string;
    description: string;
    stage: string;
    rounds: number;
    age: number;
    fundingRaised: number;
    fundingNeeded: number;
    stats?: StartupCardStats;
    // Extended properties from API
    originalId?: string;
    userId?: string;
    user?: string;
    startupDetailsId?: string;
    likedByCurrentUser?: boolean;
    crownedByCurrentUser?: boolean;
    isFollowing?: boolean;
    isSaved?: boolean;
    savedId?: string;
}

export interface StartupPostProps {
    post?: StartupCard;
    company?: StartupCard;
    currentUserId?: string | null;
    onOpenProfile?: (id: string) => void;
}

export interface AlertConfig {
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
}
