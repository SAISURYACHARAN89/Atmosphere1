/**
 * Cache Management Utilities
 * Handles clearing and managing AsyncStorage caches
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CACHE_KEYS = {
    HOME_FEED: 'ATMOSPHERE_HOME_FEED_CACHE',
    SAVED_POSTS: 'ATMOSPHERE_SAVED_POSTS_CACHE',
};

/**
 * Clear a specific cache by key
 */
export async function clearCache(cacheKey: string) {
    try {
        await AsyncStorage.removeItem(cacheKey);
        console.log(`[Cache] Cleared ${cacheKey}`);
    } catch (e) {
        console.error(`[Cache] Failed to clear ${cacheKey}:`, e);
    }
}

/**
 * Clear all startup-related caches
 * Call this when startup data is updated
 */
export async function clearStartupCaches() {
    try {
        await Promise.all([
            clearCache(CACHE_KEYS.HOME_FEED),
            clearCache(CACHE_KEYS.SAVED_POSTS),
        ]);
        console.log('[Cache] Cleared all startup-related caches');
    } catch (e) {
        console.error('[Cache] Failed to clear startup caches:', e);
    }
}

/**
 * Clear all caches
 */
export async function clearAllCaches() {
    try {
        const keys = Object.values(CACHE_KEYS);
        await Promise.all(keys.map(key => clearCache(key)));
        console.log('[Cache] Cleared all caches');
    } catch (e) {
        console.error('[Cache] Failed to clear all caches:', e);
    }
}
