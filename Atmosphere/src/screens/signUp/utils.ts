import { AccountTypeOption } from './types';

/**
 * Available account types for registration
 */
export const ACCOUNT_TYPES: AccountTypeOption[] = [
    { value: 'personal', label: 'Personal', description: 'For individual users and founders' },
    { value: 'startup', label: 'Startup', description: 'For startups and companies' },
    { value: 'investor', label: 'Investor', description: 'For investors and VCs' },
];

/**
 * Get status color for verification states
 */
export const getStatusColor = (status: string): string => {
    switch (status) {
        case 'sending':
        case 'verifying':
            return '#8e8e8e';
        case 'sent':
            return '#4ade80';
        case 'verified':
            return '#22c55e';
        case 'error':
            return '#ef4444';
        default:
            return '#8e8e8e';
    }
};
