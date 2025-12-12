import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import TopNavbar from '../components/TopNavbar';
import { BOTTOM_NAV_HEIGHT } from '../lib/layout';
import { ThemeContext } from '../contexts/ThemeContext';
import StartupPost from '../components/StartupPost';
import { fetchStartupPosts } from '../lib/api';
import { getBaseUrl } from '../lib/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Post {
    id: string;
    originalId?: string; // Track original ID for unicity logic
    name: string;
    displayName: string;
    verified: boolean;
    profileImage: string;
    description: string;
    stage: string;
    rounds: number;
    age: number;
    fundingRaised: number;
    fundingNeeded: number;
    stats: { likes: number; comments: number; crowns: number; shares: number };
}

interface HomeProps {
    onNavigate?: (route: 'notifications' | 'chats') => void;
    onChatSelect?: (chatId: string) => void;
    onOpenProfile?: (userId: string) => void;
}

const PAGE_SIZE = 10;

const Home: React.FC<HomeProps> = ({ onNavigate, onChatSelect: _onChatSelect, onOpenProfile }) => {
    const { theme } = useContext(ThemeContext);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    
    // Pagination State
    const [backendSkip, setBackendSkip] = useState(0);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    // Fetch current user
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const userJson = await AsyncStorage.getItem('user');
                if (userJson) {
                    const user = JSON.parse(userJson);
                    setCurrentUserId(user._id || user.id);
                }
            } catch (err) {
                console.error('Error fetching current user:', err);
            }
        };
        fetchCurrentUser();
    }, []);

    // Fetch unread count - only when currentUserId changes
    const fetchUnreadCount = useCallback(async () => {
        try {
            if (!currentUserId) return;
            const baseUrl = await getBaseUrl();
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const headers: any = { 'Content-Type': 'application/json' };
            headers.Authorization = `Bearer ${token}`;

            const url = `${baseUrl}/api/chats`;
            const response = await fetch(url, { credentials: 'include', headers });

            if (response.ok) {
                const data = await response.json();
                const chats = data.chats || [];
                const totalUnread = chats.reduce((sum: number, chat: any) => {
                    const unreadForUser = chat.unreadCounts?.[currentUserId] || 0;
                    return sum + unreadForUser;
                }, 0);
                setUnreadCount(totalUnread);
            }
        } catch (err) {
            console.error('Error fetching unread count:', err);
        }
    }, [currentUserId]);

    useEffect(() => {
        if (currentUserId) {
            fetchUnreadCount();
        }
    }, [currentUserId, fetchUnreadCount]);

    const normalizeData = (data: any[]) => {
        return (data || []).map((p: any) => ({
            id: String(p.id || p._id || Math.random()) + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5), // Ensure unique key for looping
            originalId: String(p.id || p._id),
            userId: String(
                p.userId ||
                (p.user && (typeof p.user === 'string' ? p.user : (p.user._id || p.user.id))) ||
                ''
            ),
            startupDetailsId: String(p._id || p.startupDetailsId || ''),
            name: String(p.name || p.companyName || 'Unknown'),
            displayName: String(p.displayName || ''),
            verified: Boolean(p.verified || false),
            profileImage: p.profileImage || 'https://via.placeholder.com/400x240.png?text=Startup',
            description: String(p.description || p.about || ''),
            stage: String(p.stage || 'unknown'),
            rounds: Number(p.rounds || 0),
            age: Number(p.age || 0),
            fundingRaised: Number(p.fundingRaised || 0),
            fundingNeeded: Number(p.fundingNeeded || 0),
            stats: p.stats || { likes: 0, comments: 0, crowns: 0, shares: 0 },
            likedByCurrentUser: Boolean(p.likedByCurrentUser),
            crownedByCurrentUser: Boolean(p.crownedByCurrentUser),
            isFollowing: Boolean(p.isFollowing),
        }));
    };

    const loadPosts = async (isRefresh = false) => {
        if (loadingMore && !isRefresh) return;
        
        try {
            if (isRefresh) {
                setLoading(true);
                setError(null);
            } else {
                setLoadingMore(true);
            }

            // If refresh, start from 0. Else use current backendSkip.
            let skipToUse = isRefresh ? 0 : backendSkip;
            
            // Fetch logic with loop check
            let data = await fetchStartupPosts(PAGE_SIZE, skipToUse);
            let nextSkip = skipToUse + data.length;

            // Loop Logic: If we got fewer items than requested (or 0), we reached the end.
            // But if we have duplicates or empty backend, we might spiral.
            // Strategy: If 0 items returned && we have existing posts, fetch from 0 again.
            if (data.length === 0 && posts.length > 0 && !isRefresh) {
                console.log('[Home] Reached end of feed, looping back to start');
                skipToUse = 0;
                data = await fetchStartupPosts(PAGE_SIZE, 0); // Re-fetch from start
                nextSkip = data.length; // Update skip for next time
            }

            const normalized = normalizeData(data);

            if (isRefresh) {
                setPosts(normalized);
                setBackendSkip(nextSkip);
            } else {
                setPosts(prev => [...prev, ...normalized]);
                setBackendSkip(nextSkip);
            }
            
            setInitialLoadDone(true);

        } catch (err) {
            console.error('Failed to fetch posts:', err);
            if (isRefresh) setError('Failed to load posts');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Initial load
    useEffect(() => {
        loadPosts(true);
    }, []);

    const renderFooter = () => {
        if (!loadingMore) return <View style={{ height: BOTTOM_NAV_HEIGHT + 50 }} />;
        return (
            <View style={[styles.centerLoader, { paddingBottom: BOTTOM_NAV_HEIGHT + 50 }]}>
                <ActivityIndicator size="small" color={theme.primary} />
            </View>
        );
    };

    const renderContent = () => {
        if (loading && !initialLoadDone) {
            return (
                <View style={styles.centerLoader}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={[styles.loadingText, { color: theme.text }]}>Loading posts...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centerLoader}>
                    <Text style={[styles.errorText, styles.errorColor]}>Error: {error}</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[styles.listContent]}
                renderItem={({ item }) => <StartupPost post={item} currentUserId={currentUserId} onOpenProfile={onOpenProfile} />}
                onEndReached={() => loadPosts(false)}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                showsVerticalScrollIndicator={false}
            />
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <TopNavbar
                title="Atmosphere"
                messagesCount={unreadCount}
                onNotificationsPress={() => onNavigate?.('notifications')}
                onChatsPress={() => onNavigate?.('chats')}
            />
            {renderContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    listContent: { padding: 0, paddingTop: 56 },
    centerLoader: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 20 },
    loadingText: { marginTop: 12, fontSize: 14 },
    errorText: { fontSize: 14 },
    errorColor: { color: '#e74c3c' },
});

export default Home;
