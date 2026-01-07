export interface VideoCallProps {
    meetingId: string;
    onLeave: () => void;
}

export interface RemoteUser {
    uid: number;
}

export interface AgoraConfig {
    appId: string;
    token: string;
    channelName: string;
    uid: number;
}

export interface CallControlsProps {
    micMuted: boolean;
    videoMuted: boolean;
    onToggleMic: () => void;
    onToggleVideo: () => void;
    onSwitchCamera: () => void;
    onLeave: () => void;
}
