/**
 * Calculates a human-readable time ago string from a date
 */
export const timeAgo = (dateLike: any): string => {
    try {
        const d = new Date(dateLike);
        if (Number.isNaN(d.getTime())) return '';
        const sec = Math.floor((Date.now() - d.getTime()) / 1000);
        if (sec < 10) return 'just now';
        if (sec < 60) return `${sec}s`;
        const min = Math.floor(sec / 60);
        if (min < 60) return `${min}m`;
        const hr = Math.floor(min / 60);
        if (hr < 24) return `${hr}h`;
        const day = Math.floor(hr / 24);
        if (day < 7) return `${day}d`;
        return d.toLocaleDateString();
    } catch {
        return '';
    }
};

/**
 * Gets initial letter for avatar display
 */
export const getAvatarLetter = (author: any): string => {
    if (author && (author.displayName || author.username)) {
        return (author.displayName || author.username).charAt(0).toUpperCase();
    }
    return 'U';
};

/**
 * Gets display name from author object
 */
export const getDisplayName = (author: any): string => {
    return author?.displayName || author?.username || 'User';
};
