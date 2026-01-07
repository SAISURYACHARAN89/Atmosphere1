import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Format currency value for display
 */
export const formatCurrency = (num: number): string => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num}`;
};

/**
 * Calculate funding percentage
 */
export const getFundingPercent = (raised: number, needed: number): number => {
    if (needed <= 0) return 0;
    return Math.min(100, (raised / needed) * 100);
};

/**
 * Get the content ID from company data
 */
export const getContentId = (companyData: any): string => {
    return String(
        companyData?.originalId ||
        companyData?.id ||
        companyData?.userId ||
        companyData?.user
    );
};

/**
 * Check if user has investor role
 */
export const checkIsInvestor = async (): Promise<boolean> => {
    try {
        const role = await AsyncStorage.getItem('role');
        if (role === 'investor') return true;

        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
            const userObj = JSON.parse(userJson);
            if (Array.isArray(userObj.roles) && userObj.roles[0] === 'investor') return true;
            if (userObj.accountType === 'investor') return true;
            if (userObj.role === 'investor') return true;
        }
    } catch { /* ignore */ }
    return false;
};

/**
 * Determine if this is a startup card (vs regular post)
 */
export const isStartupCard = (companyData: any): boolean => {
    return Boolean(
        companyData?.fundingRaised ||
        companyData?.fundingNeeded ||
        companyData?.stage
    );
};
