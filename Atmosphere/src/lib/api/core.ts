/**
 * Core API client - base request function
 */
import { getBaseUrl, DEFAULT_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_BASE = DEFAULT_BASE_URL;

export async function request(path: string, body: any = {}, options: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE' } = {}) {
    const method = options.method || 'POST';
    const base = await getBaseUrl().catch(() => DEFAULT_BASE);

    let url = `${base}${path}`;

    const token = await AsyncStorage.getItem('token');
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (method === 'GET') {
        headers['Cache-Control'] = 'no-cache';
        headers.Pragma = 'no-cache';
    }
    const fetchOptions: any = { method, headers };

    if (method === 'GET') {
        const query = Object.keys(body || {}).map(k => `${encodeURIComponent(k)}=${encodeURIComponent((body as any)[k])}`).join('&');
        if (query) url += (url.includes('?') ? '&' : '?') + query;
    } else {
        fetchOptions.body = JSON.stringify(body);
    }

    const res = await fetch(url, fetchOptions);
    if (res.status === 304) return {};
    const text = await res.text();
    let data: any = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }

    if (!res.ok) {
        const message = data && data.error ? data.error : res.statusText || 'Unknown error';
        throw new Error(message);
    }

    return data;
}

export { getBaseUrl };
