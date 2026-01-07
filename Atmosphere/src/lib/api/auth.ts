/**
 * Authentication API functions
 */
import { request } from './core';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function login(email: string, password: string) {
    return request('/api/auth/login', { email, password });
}

export async function register({ email, username, password, displayName, accountType = 'personal' }: {
    email: string; username: string; password: string; displayName?: string; accountType?: string
}) {
    return request('/api/auth/register', { email, username, password, displayName, accountType });
}

export async function forgotPassword(email: string) {
    return request('/api/auth/forgot-password', { email }, { method: 'POST' });
}

export async function verifyOtpCheck(email: string, code: string) {
    return request('/api/auth/verify-otp', { email, code }, { method: 'POST' });
}

export async function resetPassword(email: string, code: string, newPassword: string) {
    return request('/api/auth/reset-password', { email, code, newPassword }, { method: 'POST' });
}

export async function verifyEmail(code: string, email?: string) {
    return request('/api/auth/verify-email', { code, email }, { method: 'POST' });
}

export async function resendOtp(email: string) {
    return request('/api/auth/resend-otp', { email }, { method: 'POST' });
}

export async function fetchAndStoreUserRole() {
    const data = await request('/api/profile', {}, { method: 'GET' });
    let role = '';
    if (Array.isArray(data?.user?.roles)) role = data.user.roles[0] || '';
    else if (Array.isArray(data?.roles)) role = data.roles[0] || '';
    else role = data?.user?.roles || data?.roles || '';
    if (role) await AsyncStorage.setItem('role', role);
    return role;
}
