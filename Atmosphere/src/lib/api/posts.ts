/**
 * Posts API functions
 */
import { request } from './core';

export async function fetchMyPosts() {
    const data = await request('/api/posts/me', {}, { method: 'GET' });
    return data.posts ?? [];
}

export async function createPost(payload: { content: string; media?: { url: string; type: string }[]; tags?: string[] }) {
    return request('/api/posts', payload, { method: 'POST' });
}

export async function getPostById(postId: string) {
    const data = await request(`/api/posts/${encodeURIComponent(postId)}`, {}, { method: 'GET' });
    return data.post || data || null;
}

export async function getPostsByUser(userId: string) {
    try {
        const data = await request('/api/posts', { userId }, { method: 'GET' });
        return (data.posts ?? data) || [];
    } catch {
        try {
            const data2 = await request(`/api/posts/user/${encodeURIComponent(userId)}`, {}, { method: 'GET' });
            return (data2.posts ?? data2) || [];
        } catch { throw new Error('Failed to fetch posts for user'); }
    }
}

export async function fetchExplorePosts(limit = 20, skip = 0) {
    const data = await request('/api/posts', { limit, skip }, { method: 'GET' });
    return data.posts ?? [];
}

// Post likes
export async function likePost(postId: string) {
    return request(`/api/likes/post/${encodeURIComponent(postId)}`, {}, { method: 'POST' });
}

export async function unlikePost(postId: string) {
    return request(`/api/likes/post/${encodeURIComponent(postId)}`, {}, { method: 'DELETE' });
}

export async function getPostLikes(postId: string) {
    const data = await request(`/api/likes/post/${encodeURIComponent(postId)}`, {}, { method: 'GET' });
    return data.likes || [];
}

// Post comments
export async function addComment(postId: string, text: string, parent?: string) {
    return request(`/api/comments/${encodeURIComponent(postId)}/comments`, { text, parent }, { method: 'POST' });
}

export async function getComments(postId: string) {
    const data = await request(`/api/comments/${encodeURIComponent(postId)}/comments`, {}, { method: 'GET' });
    return data.comments || [];
}

export async function deleteComment(commentId: string) {
    return request(`/api/comments/${encodeURIComponent(commentId)}`, {}, { method: 'DELETE' });
}

export async function getCommentReplies(commentId: string) {
    const data = await request(`/api/comments/${encodeURIComponent(commentId)}/replies`, {}, { method: 'GET' });
    return data.replies || [];
}

// Post crowns
export async function crownPost(postId: string) {
    return request(`/api/crowns/post/${encodeURIComponent(postId)}`, {}, { method: 'POST' });
}

export async function uncrownPost(postId: string) {
    return request(`/api/crowns/post/${encodeURIComponent(postId)}`, {}, { method: 'DELETE' });
}

export async function getPostCrowns(postId: string) {
    const data = await request(`/api/crowns/post/${encodeURIComponent(postId)}`, {}, { method: 'GET' });
    return data.crowns || [];
}

// Post sharing
export async function sharePost(postId: string, userIds: string[] = []) {
    return request('/api/shares', { postId, userIds }, { method: 'POST' });
}

export async function checkPostShared(postId: string) {
    return request(`/api/shares/check/${postId}`, {}, { method: 'GET' });
}

// Saved posts
export async function savePost(postId: string) {
    return request('/api/saved', { postId }, { method: 'POST' });
}

export async function fetchSavedPosts() {
    const data = await request('/api/saved', {}, { method: 'GET' });
    return data || [];
}

export async function unsavePost(savedId: string) {
    return request(`/api/saved/${encodeURIComponent(savedId)}`, {}, { method: 'DELETE' });
}

export async function getSavedPosts() {
    const data = await request('/api/saved', {}, { method: 'GET' });
    return data || [];
}
