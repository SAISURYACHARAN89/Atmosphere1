import AsyncStorage from '@react-native-async-storage/async-storage';

let envUrl: string | undefined;
try {
    const env = require('../../env.json');
    if (env && env.BACKEND_URL) envUrl = env.BACKEND_URL;
} catch {
    envUrl = undefined;
}

export const DEFAULT_BASE_URL = envUrl || 'http://192.168.0.106:4000';
const KEY = '@app_base_url';

export async function getBaseUrl(): Promise<string> {
    if (envUrl) return envUrl;
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
