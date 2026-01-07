import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, ActivityIndicator, Animated, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { getFollowersList, getFollowingList, followUser, unfollowUser, checkFollowing } from '../../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FollowersFollowingModalProps, User, TabType } from './types';
import { styles, SCREEN_WIDTH, PAGE_SIZE } from './styles';
import UserListItem from './UserListItem';

const FollowersFollowingModal: React.FC<FollowersFollowingModalProps> = ({
    visible, onClose, userId, username = '', initialTab = 'followers',
    followersCount = 0, followingCount = 0, onUserPress,
}) => {
    const [activeTab, setActiveTab] = useState<TabType>(initialTab);
    const [followers, setFollowers] = useState<User[]>([]);
    const [following, setFollowing] = useState<User[]>([]);
    const [followersLoading, setFollowersLoading] = useState(false);
    const [followingLoading, setFollowingLoading] = useState(false);
    const [followersSkip, setFollowersSkip] = useState(0);
    const [followingSkip, setFollowingSkip] = useState(0);
    const [followersHasMore, setFollowersHasMore] = useState(true);
    const [followingHasMore, setFollowingHasMore] = useState(true);
    const [followingStatus, setFollowingStatus] = useState<Record<string, boolean>>({});
    const [followLoading, setFollowLoading] = useState<Record<string, boolean>>({});
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const scrollViewRef = useRef<ScrollView>(null);
    const tabIndicatorX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        (async () => {
            try {
                const userJson = await AsyncStorage.getItem('user');
                if (userJson) {
                    const user = JSON.parse(userJson);
                    setCurrentUserId(user._id || user.id);
                }
            } catch { }
        })();
    }, []);

    useEffect(() => {
        if (visible) {
            setActiveTab(initialTab);
            setFollowers([]); setFollowing([]);
            setFollowersSkip(0); setFollowingSkip(0);
            setFollowersHasMore(true); setFollowingHasMore(true);
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({ x: initialTab === 'followers' ? 0 : SCREEN_WIDTH, animated: false });
                tabIndicatorX.setValue(initialTab === 'followers' ? 0 : 1);
            }, 100);
        }
    }, [visible, initialTab]);

    const checkFollowStatusBatch = async (users: User[]) => {
        const newStatus: Record<string, boolean> = {};
        for (const user of users) {
            if (user._id === currentUserId) continue;
            try {
                const status = await checkFollowing(user._id);
                newStatus[user._id] = status?.isFollowing || false;
            } catch { newStatus[user._id] = false; }
        }
        setFollowingStatus(prev => ({ ...prev, ...newStatus }));
    };

    const loadFollowers = useCallback(async (reset = false) => {
        if (followersLoading || (!reset && !followersHasMore)) return;
        setFollowersLoading(true);
        try {
            const skip = reset ? 0 : followersSkip;
            const data = await getFollowersList(userId, PAGE_SIZE, skip);
            const newFollowers = data.followers || [];
            reset ? setFollowers(newFollowers) : setFollowers(prev => [...prev, ...newFollowers]);
            setFollowersSkip(skip + newFollowers.length);
            setFollowersHasMore(newFollowers.length === PAGE_SIZE);
            checkFollowStatusBatch(newFollowers);
        } catch (err) { console.error('Failed to load followers:', err); }
        finally { setFollowersLoading(false); }
    }, [userId, followersSkip, followersLoading, followersHasMore]);

    const loadFollowing = useCallback(async (reset = false) => {
        if (followingLoading || (!reset && !followingHasMore)) return;
        setFollowingLoading(true);
        try {
            const skip = reset ? 0 : followingSkip;
            const data = await getFollowingList(userId, PAGE_SIZE, skip);
            const newFollowing = data.following || [];
            reset ? setFollowing(newFollowing) : setFollowing(prev => [...prev, ...newFollowing]);
            setFollowingSkip(skip + newFollowing.length);
            setFollowingHasMore(newFollowing.length === PAGE_SIZE);
            checkFollowStatusBatch(newFollowing);
        } catch (err) { console.error('Failed to load following:', err); }
        finally { setFollowingLoading(false); }
    }, [userId, followingSkip, followingLoading, followingHasMore]);

    useEffect(() => {
        if (visible && userId) { loadFollowers(true); loadFollowing(true); }
    }, [visible, userId]);

    const toggleFollow = async (targetUserId: string) => {
        if (followLoading[targetUserId]) return;
        setFollowLoading(prev => ({ ...prev, [targetUserId]: true }));
        const wasFollowing = followingStatus[targetUserId];
        setFollowingStatus(prev => ({ ...prev, [targetUserId]: !wasFollowing }));
        try {
            wasFollowing ? await unfollowUser(targetUserId) : await followUser(targetUserId);
        } catch (err) {
            setFollowingStatus(prev => ({ ...prev, [targetUserId]: wasFollowing }));
        } finally { setFollowLoading(prev => ({ ...prev, [targetUserId]: false })); }
    };

    const removeUser = async (targetUserId: string, listType: TabType) => {
        if (followLoading[targetUserId]) return;
        setFollowLoading(prev => ({ ...prev, [targetUserId]: true }));
        try {
            await unfollowUser(targetUserId);
            listType === 'followers'
                ? setFollowers(prev => prev.filter(u => u._id !== targetUserId))
                : setFollowing(prev => prev.filter(u => u._id !== targetUserId));
            setFollowingStatus(prev => ({ ...prev, [targetUserId]: false }));
        } catch (err) { console.error('Failed to remove user:', err); }
        finally { setFollowLoading(prev => ({ ...prev, [targetUserId]: false })); }
    };

    const handleScrollEnd = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newTab = offsetX < SCREEN_WIDTH / 2 ? 'followers' : 'following';
        setActiveTab(newTab);
        Animated.spring(tabIndicatorX, { toValue: newTab === 'followers' ? 0 : 1, useNativeDriver: true, tension: 100, friction: 15 }).start();
    };

    const switchTab = (tab: TabType) => {
        setActiveTab(tab);
        scrollViewRef.current?.scrollTo({ x: tab === 'followers' ? 0 : SCREEN_WIDTH, animated: true });
        Animated.spring(tabIndicatorX, { toValue: tab === 'followers' ? 0 : 1, useNativeDriver: true, tension: 100, friction: 15 }).start();
    };

    const handleUserPress = (userId: string) => { onClose(); onUserPress?.(userId); };

    const renderFooter = (loading: boolean) => loading ? <View style={styles.footerLoader}><ActivityIndicator size="small" color="#fff" /></View> : <View style={{ height: 100 }} />;
    const renderEmpty = (loading: boolean, text: string) => loading ? null : <View style={styles.emptyContainer}><Text style={styles.emptyText}>{text}</Text></View>;
    const tabIndicatorTranslate = tabIndicatorX.interpolate({ inputRange: [0, 1], outputRange: [0, SCREEN_WIDTH / 2] });

    return (
        <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.backButton}><ArrowLeft size={24} color="#fff" /></TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>{username || 'Profile'}</Text>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.tabBar}>
                    <TouchableOpacity style={styles.tab} onPress={() => switchTab('followers')}>
                        <Text style={[styles.tabText, activeTab === 'followers' && styles.tabTextActive]}>{followersCount} followers</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab} onPress={() => switchTab('following')}>
                        <Text style={[styles.tabText, activeTab === 'following' && styles.tabTextActive]}>{followingCount} following</Text>
                    </TouchableOpacity>
                    <Animated.View style={[styles.tabIndicator, { transform: [{ translateX: tabIndicatorTranslate }] }]} />
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{activeTab === 'followers' ? 'All followers' : 'All following'}</Text>
                </View>

                <ScrollView ref={scrollViewRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={handleScrollEnd} style={styles.scrollView}>
                    <View style={styles.listContainer}>
                        <FlatList
                            data={followers}
                            keyExtractor={item => item._id}
                            renderItem={({ item }) => (
                                <UserListItem user={item} listType="followers" currentUserId={currentUserId} isFollowing={followingStatus[item._id]} isLoading={followLoading[item._id] || false} onToggleFollow={toggleFollow} onRemove={removeUser} onPress={handleUserPress} />
                            )}
                            onEndReached={() => loadFollowers(false)}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={() => renderFooter(followersLoading)}
                            ListEmptyComponent={() => renderEmpty(followersLoading, 'No followers yet')}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={followers.length === 0 ? styles.emptyList : undefined}
                        />
                    </View>
                    <View style={styles.listContainer}>
                        <FlatList
                            data={following}
                            keyExtractor={item => item._id}
                            renderItem={({ item }) => (
                                <UserListItem user={item} listType="following" currentUserId={currentUserId} isFollowing={followingStatus[item._id]} isLoading={followLoading[item._id] || false} onToggleFollow={toggleFollow} onRemove={removeUser} onPress={handleUserPress} />
                            )}
                            onEndReached={() => loadFollowing(false)}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={() => renderFooter(followingLoading)}
                            ListEmptyComponent={() => renderEmpty(followingLoading, 'Not following anyone yet')}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={following.length === 0 ? styles.emptyList : undefined}
                        />
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

export default FollowersFollowingModal;
