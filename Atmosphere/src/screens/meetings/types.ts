// Types for the Meetings screen

export type Meeting = {
    _id?: string;
    id?: number | string;
    host?: any;
    hostName?: string;
    hostAvatar?: string;
    title: string;
    industries?: string[];
    category?: string;
    eligible?: boolean;
    participants?: number;
    startTime?: string | Date;
    endTime?: string | Date;
    isVerified?: boolean;
    description?: string;
    organizer?: any;
    scheduledAt?: string | Date;
    participantsDetail?: any[];
};

export type CreateMeetingForm = {
    title: string;
    description: string;
    scheduledAt: Date;
    endScheduledAt: Date;
    location: string;
    meetingType: 'public' | 'private';
    category: '' | 'pitch' | 'networking';
    pitchDuration: number;
    participantType: 'all' | 'startups' | 'investors';
    verifiedOnly: boolean;
    industries: string[];
    maxParticipants: number;
};

export type MeetingCardProps = {
    meeting: Meeting;
    onJoin: () => void;
    joinLabel?: string;
    isExpanded: boolean;
    onToggleExpand: () => void;
};
