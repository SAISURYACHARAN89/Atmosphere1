/**
 * Chats & Messaging API functions
 */
import { request } from './core';

export async function fetchChats(type?: 'group' | 'private') {
    const query = type ? `?type=${type}` : '';
    const data = await request(`/api/chats${query}`, {}, { method: 'GET' });
    return data.chats || [];
}

export async function createGroup(payload: { name: string; description?: string; participants: string[]; type?: string; image?: string }) {
    return request('/api/chats/create-group', payload, { method: 'POST' });
}

export async function getChatDetails(chatId: string) {
    return request(`/api/chats/${chatId}`, {}, { method: 'GET' });
}

export async function createOrFindChat(participantId: string) {
    return request('/api/chats', { participantId }, { method: 'POST' });
}

export async function sendMessage(chatId: string, content: string) {
    return request(`/api/messages/${chatId}`, { content }, { method: 'POST' });
}
