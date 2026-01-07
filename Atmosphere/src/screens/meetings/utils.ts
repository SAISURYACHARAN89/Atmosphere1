// Utility functions for the Meetings screen

/**
 * Formats a Date object or date string to AM/PM time format
 * @param dateLike - Date object or date string
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export function formatAMPM(dateLike: Date | string): string {
    const d = typeof dateLike === 'string' ? new Date(dateLike) : dateLike;
    const h = d.getHours();
    const m = d.getMinutes();
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

/**
 * Industry tags available for meetings
 */
export const INDUSTRY_TAGS = [
    'AI', 'ML', 'Fintech', 'HealthTech', 'EV', 'SaaS', 'E-commerce', 'EdTech', 'AgriTech',
    'Blockchain', 'IoT', 'CleanTech', 'FoodTech', 'PropTech', 'InsurTech', 'LegalTech',
    'MarTech', 'RetailTech', 'TravelTech', 'Logistics', 'Cybersecurity', 'Gaming', 'Media', 'SpaceTech'
];

/**
 * Default form values for creating a new meeting
 */
export const getDefaultCreateForm = () => ({
    title: '',
    description: '',
    scheduledAt: new Date(),
    endScheduledAt: new Date(new Date().getTime() + 60 * 60000),
    location: '',
    meetingType: 'public' as 'public' | 'private',
    category: '' as '' | 'pitch' | 'networking',
    pitchDuration: 10,
    participantType: 'all' as 'all' | 'startups' | 'investors',
    verifiedOnly: false,
    industries: [] as string[],
    maxParticipants: 50,
});
