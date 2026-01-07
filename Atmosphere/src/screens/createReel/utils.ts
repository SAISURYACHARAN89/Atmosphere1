import { Platform } from 'react-native';

export const MAX_VIDEO_DURATION = 60; // 1 minute max for reels

/**
 * Sanitize URI for proper video loading across platforms
 */
export const getCleanUri = (uri: string): string => {
    if (!uri) return '';
    if (Platform.OS === 'android') {
        if (uri.startsWith('content://')) return uri;
        if (!uri.startsWith('file://') && !uri.startsWith('http')) {
            return `file://${uri}`;
        }
    }
    return uri;
};

/**
 * Get displayable image URI - adds file:// on Android if needed
 */
export const getDisplayUri = (path: string): string => {
    return Platform.OS === 'android' && !path.startsWith('file://') && !path.startsWith('http') && !path.startsWith('content://')
        ? `file://${path}`
        : path;
};

/**
 * Format duration in seconds to MM:SS format
 */
export const formatDuration = (seconds?: number): string => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};
