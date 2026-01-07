/**
 * Miscellaneous API functions (notifications, settings, uploads, etc.)
 */
import { request, getBaseUrl } from './core';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Notifications
export async function fetchNotifications(limit = 50, skip = 0) {
    const data = await request('/api/notifications', { limit, skip }, { method: 'GET' });
    return { notifications: data.notifications || [], unreadCount: data.unreadCount || 0 };
}

export async function markNotificationRead(notificationId: string) {
    return request(`/api/notifications/${encodeURIComponent(notificationId)}/read`, {}, { method: 'PUT' });
}

export async function markAllNotificationsRead() {
    return request('/api/notifications/read-all', {}, { method: 'PUT' });
}

// Settings
export async function getSettings() {
    const data = await request('/api/settings', {}, { method: 'GET' });
    return data.settings || {};
}

export async function updateSettings(payload: { displayName?: string; username?: string; phone?: string }) {
    return request('/api/settings', payload, { method: 'PUT' });
}

export async function changePassword(currentPassword: string, newPassword: string) {
    return request('/api/settings/password', { currentPassword, newPassword }, { method: 'PUT' });
}

// KYC
export async function getKycStatus() {
    const data = await request('/api/settings/kyc', {}, { method: 'GET' });
    return data || { kycCompleted: false };
}

export async function markKycComplete() {
    return request('/api/settings/kyc', {}, { method: 'PUT' });
}

// Jobs, Grants, Events
export async function fetchJobs(limit = 20, skip = 0) {
    const data = await request('/api/jobs', { limit, skip }, { method: 'GET' });
    return data.jobs || [];
}

export async function fetchGrants(limit = 20, skip = 0) {
    const data = await request('/api/grants', { limit, skip }, { method: 'GET' });
    return data || [];
}

export async function fetchEvents(limit = 20, skip = 0) {
    const data = await request('/api/events', { limit, skip }, { method: 'GET' });
    return data || [];
}

// Search
export async function searchEntities(query: string, type = 'all', limit = 20, skip = 0) {
    const data = await request('/api/search', { q: query, type, limit, skip }, { method: 'GET' });
    return data.results ?? {};
}

// My Team
export async function fetchMyTeam() {
    const data = await request('/api/my-team', {}, { method: 'GET' });
    return data || [];
}

export async function addToMyTeam(memberId: string) {
    return request('/api/my-team', { memberId }, { method: 'POST' });
}

export async function removeFromMyTeam(memberId: string) {
    return request(`/api/my-team/${encodeURIComponent(memberId)}`, {}, { method: 'DELETE' });
}

// Uploads
export async function uploadImage(imageUri: string, fileName?: string, mimeType?: string): Promise<string> {
    const baseUrl = await getBaseUrl();
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', { uri: imageUri, name: fileName || 'image.jpg', type: mimeType || 'image/jpeg' } as any);
    const uploadRes = await fetch(`${baseUrl}/api/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
    if (!uploadRes.ok) { const err = await uploadRes.json().catch(() => ({})); throw new Error(err.error || 'Failed to upload image'); }
    const uploadData = await uploadRes.json();
    return uploadData.url;
}

export async function uploadDocument(fileUri: string, fileName: string, mimeType: string): Promise<string> {
    const baseUrl = await getBaseUrl();
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    const isImage = mimeType && mimeType.startsWith('image/');
    const fieldName = isImage ? 'image' : 'file';
    const endpoint = isImage ? '/api/upload' : '/api/upload/document';
    formData.append(fieldName, { uri: fileUri, name: fileName || (isImage ? 'image.jpg' : 'document.pdf'), type: mimeType || (isImage ? 'image/jpeg' : 'application/pdf') } as any);
    const uploadRes = await fetch(`${baseUrl}${endpoint}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
    if (!uploadRes.ok) { const err = await uploadRes.json().catch(() => ({})); throw new Error(err.error || 'Failed to upload document'); }
    const uploadData = await uploadRes.json();
    return uploadData.url;
}

// Unified Share
export async function shareContent(payload: { userIds: string[]; contentId: string; contentType: 'post' | 'reel' | 'startup' | 'trade'; contentTitle?: string; contentImage?: string; contentOwner?: string }) {
    return request('/api/shares/send', payload, { method: 'POST' });
}
