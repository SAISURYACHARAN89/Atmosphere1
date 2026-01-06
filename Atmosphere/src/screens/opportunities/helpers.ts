// Opportunities page helper functions

// Helper to get badge variant color
export const getBadgeColor = (type: string): string => {
    switch (type) {
        case 'grant': return '#3b82f6';
        case 'incubator': return '#8b5cf6';
        case 'accelerator': return '#22c55e';
        case 'physical': return '#3b82f6';
        case 'virtual': return '#8b5cf6';
        case 'hybrid': return '#f59e0b';
        default: return '#6b7280';
    }
};

// Helper to format date as "Dec 31, 2024"
export const formatDate = (dateStr: string): string => {
    if (!dateStr) return 'TBD';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    } catch {
        return dateStr;
    }
};
