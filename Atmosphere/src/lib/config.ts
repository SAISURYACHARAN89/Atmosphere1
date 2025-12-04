import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEFAULT_BASE_URL = 'http://10.0.2.2:4000';
const KEY = '@app_base_url';

export async function getBaseUrl(): Promise<string> {
    try {
        const v = await AsyncStorage.getItem(KEY);
        if (v) return v;
    } catch {
        // ignore
    }
    return DEFAULT_BASE_URL;
}

export async function setBaseUrl(url: string): Promise<void> {
    try {
        await AsyncStorage.setItem(KEY, url);
    } catch {
        // ignore
    }
}

export default { getBaseUrl, setBaseUrl, DEFAULT_BASE_URL };
