import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    ActivityIndicator,
    Dimensions,
    Animated,
    ScrollView,
} from 'react-native';
import { ArrowLeft, X as CloseIcon } from 'lucide-react-native';
import { getFollowersList, getFollowingList, followUser, unfollowUser, checkFollowing } from '../lib/api';
import { getImageSource } from '../lib/image';
import VerifiedBadge from './VerifiedBadge';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PAGE_SIZE = 20;

interface User {
    _id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    verified?: boolean;
}

interface FollowersFollowingModalProps {
    visible: boolean;
    onClose: () => void;
    userId: string;
    username?: string;
    initialTab?: 'followers' | 'following';
    followersCount?: number;
    followingCount?: number;
    onUserPress?: (userId: string) => void;
}

const FollowersFollowingModal: React.FC<FollowersFollowingModalProps> = ({
    visible,
    onClose,
    userId,
    username = '',
    initialTab = 'followers',
    followersCount = 0,
    followingCount = 0,
    onUserPress,
}) => {
    const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);
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

    // Horizontal scroll for content
    const scrollViewRef = useRef<ScrollView>(null);
    const tabIndicatorX = useRef(new Animated.Value(0)).current;

    // Get current user ID
    useEffect(() => {
        (async () => {
            try {
                const userJson = await AsyncStorage.getItem('user');
                if (userJson) {
                    const user = JSON.parse(userJson);
                    setCurrentUserId(user._id || user.id);
                }
            } catch { /* ignore */ }
        })();
    }, []);

    // Reset state when modal opens
    useEffect(() => {
        if (visible) {
            setActiveTab(initialTab);
            setFollowers([]);
            setFollowing([]);
            setFollowersSkip(0);
            setFollowingSkip(0);
            setFollowersHasMore(true);
            setFollowingHasMore(true);

            // Scroll to correct tab
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    x: initialTab === 'followers' ? 0 : SCREEN_WIDTH,
                    animated: false,
                });
                tabIndicatorX.setValue(initialTab === 'followers' ? 0 : 1);
            }, 100);
        }
    }, [visible, initialTab]);

    // Load followers
    const loadFollowers = useCallback(async (reset = false) => {
        if (followersLoading || (!reset && !followersHasMore)) return;
        setFollowersLoading(true);
        try {
            const skip = reset ? 0 : followersSkip;
            const data = await getFollowersList(userId, PAGE_SIZE, skip);
            const newFollowers = data.followers || [];

            if (reset) {
                setFollowers(newFollowers);
            } else {
                setFollowers(prev => [...prev, ...newFollowers]);
            }

            setFollowersSkip(skip + newFollowers.length);
            setFollowersHasMore(newFollowers.length === PAGE_SIZE);

            // Check follow status for new users
            checkFollowStatusBatch(newFollowers);
        } catch (err) {
            console.error('Failed to load followers:', err);
        } finally {
            setFollowersLoading(false);
        }
    }, [userId, followersSkip, followersLoading, followersHasMore]);

    // Load following
    const loadFollowing = useCallback(async (reset = false) => {
        if (followingLoading || (!reset && !followingHasMore)) return;
        setFollowingLoading(true);
        try {
            const skip = reset ? 0 : followingSkip;
            const data = await getFollowingList(userId, PAGE_SIZE, skip);
            const newFollowing = data.following || [];

            if (reset) {
                setFollowing(newFollowing);
            } else {
                setFollowing(prev => [...prev, ...newFollowing]);
            }

            setFollowingSkip(skip + newFollowing.length);
            setFollowingHasMore(newFollowing.length === PAGE_SIZE);

            // Check follow status for new users
            checkFollowStatusBatch(newFollowing);
        } catch (err) {
            console.error('Failed to load following:', err);
        } finally {
            setFollowingLoading(false);
        }
    }, [userId, followingSkip, followingLoading, followingHasMore]);

    // Check follow status for users in batch
    const checkFollowStatusBatch = async (users: User[]) => {
        const newStatus: Record<string, boolean> = {};
        for (const user of users) {
            if (user._id === currentUserId) continue;
            try {
                const status = await checkFollowing(user._id);
                newStatus[user._id] = status?.isFollowing || false;
            } catch {
                newStatus[user._id] = false;
            }
        }
        setFollowingStatus(prev => ({ ...prev, ...newStatus }));
    };

    // Initial load
    useEffect(() => {
        if (visible && userId) {
            loadFollowers(true);
            loadFollowing(true);
        }
    }, [visible, userId]);

    // Toggle follow
    const toggleFollow = async (targetUserId: string) => {
        if (followLoading[targetUserId]) return;

        setFollowLoading(prev => ({ ...prev, [targetUserId]: true }));
        const wasFollowing = followingStatus[targetUserId];

        // Optimistic update
        setFollowingStatus(prev => ({ ...prev, [targetUserId]: !wasFollowing }));

        try {
            if (wasFollowing) {
                await unfollowUser(targetUserId);
            } else {
                await followUser(targetUserId);
            }
        } catch (err) {
            // Revert on error
            setFollowingStatus(prev => ({ ...prev, [targetUserId]: wasFollowing }));
            console.error('Failed to toggle follow:', err);
        } finally {
            setFollowLoading(prev => ({ ...prev, [targetUserId]: false }));
        }
    };

    // Handle scroll end to update active tab
    const handleScrollEnd = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newTab = offsetX < SCREEN_WIDTH / 2 ? 'followers' : 'following';
        setActiveTab(newTab);

        Animated.spring(tabIndicatorX, {
            toValue: newTab === 'followers' ? 0 : 1,
            useNativeDriver: true,
            tension: 100,
            friction: 15,
        }).start();
    };

    // Switch tabs programmatically
    const switchTab = (tab: 'followers' | 'following') => {
        setActiveTab(tab);
        scrollViewRef.current?.scrollTo({
            x: tab === 'followers' ? 0 : SCREEN_WIDTH,
            animated: true,
        });

        Animated.spring(tabIndicatorX, {
            toValue: tab === 'followers' ? 0 : 1,
            useNativeDriver: true,
            tension: 100,
            friction: 15,
        }).start();
    };

    // Remove user from list (unfollow)
    const removeUser = async (targetUserId: string, listType: 'followers' | 'following') => {
        if (followLoading[targetUserId]) return;

        setFollowLoading(prev => ({ ...prev, [targetUserId]: true }));

        try {
            await unfollowUser(targetUserId);
            // Remove from local list
            if (listType === 'followers') {
                setFollowers(prev => prev.filter(u => u._id !== targetUserId));
            } else {
                setFollowing(prev => prev.filter(u => u._id !== targetUserId));
            }
            // Update follow status
            setFollowingStatus(prev => ({ ...prev, [targetUserId]: false }));
        } catch (err) {
            console.error('Failed to remove user:', err);
        } finally {
            setFollowLoading(prev => ({ ...prev, [targetUserId]: false }));
        }
    };

    // Render user item
    const renderUserItem = ({ item }: { item: User }, listType: 'followers' | 'following') => {
        const isCurrentUser = item._id === currentUserId;
        const isFollowingUser = followingStatus[item._id];
        const isLoading = followLoading[item._id];

        return (
            <TouchableOpacity
                style={styles.userItem}
                onPress={() => {
                    onClose();
                    onUserPress?.(item._id);
                }}
                activeOpacity={0.7}
            >
                <Image
                    source={getImageSource(item.avatarUrl)}
                    style={styles.avatar}
                />
                <View style={styles.userInfo}>
                    <View style={styles.nameRow}>
                        <Text style={styles.username} numberOfLines={1}>
                            {item.username}
                        </Text>
                        {item.verified && <VerifiedBadge size={14} />}
                    </View>
                    <Text style={styles.displayName} numberOfLines={1}>
                        {item.displayName || item.username}
                    </Text>
                </View>
                {!isCurrentUser && (
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            isFollowingUser ? styles.messageButton : styles.followBackButton,
                        ]}
                        onPress={(e) => {
                            e.stopPropagation();
                            if (!isFollowingUser) {
                                toggleFollow(item._id);
                            }
                            // Message functionality would go here
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.actionButtonText}>
                                {isFollowingUser ? 'Message' : 'Follow back'}
                            </Text>
                        )}
                    </TouchableOpacity>
                )}
                {!isCurrentUser && (
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            removeUser(item._id, listType);
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#888" />
                        ) : (
                            <CloseIcon size={18} color="#888" />
                        )}
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    };

    const renderFooter = (loading: boolean) => {
        if (!loading) return <View style={{ height: 100 }} />;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#fff" />
            </View>
        );
    };

    const renderEmpty = (loading: boolean, text: string) => {
        if (loading) return null;
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{text}</Text>
            </View>
        );
    };

    const tabIndicatorTranslate = tabIndicatorX.interpolate({
        inputRange: [0, 1],
        outputRange: [0, SCREEN_WIDTH / 2],
    });

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.backButton}>
                        <ArrowLeft size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {username || 'Profile'}
                    </Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Tabs */}
                <View style={styles.tabBar}>
                    <TouchableOpacity
                        style={styles.tab}
                        onPress={() => switchTab('followers')}
                    >
                        <Text style={[styles.tabText, activeTab === 'followers' && styles.tabTextActive]}>
                            {followersCount} followers
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.tab}
                        onPress={() => switchTab('following')}
                    >
                        <Text style={[styles.tabText, activeTab === 'following' && styles.tabTextActive]}>
                            {followingCount} following
                        </Text>
                    </TouchableOpacity>
                    {/* Tab indicator */}
                    <Animated.View
                        style={[
                            styles.tabIndicator,
                            { transform: [{ translateX: tabIndicatorTranslate }] },
                        ]}
                    />
                </View>

                {/* Section header */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        {activeTab === 'followers' ? 'All followers' : 'All following'}
                    </Text>
                </View>

                {/* Swipeable content */}
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleScrollEnd}
                    scrollEventThrottle={16}
                    style={styles.scrollView}
                >
                    {/* Followers list */}
                    <View style={styles.listContainer}>
                        <FlatList
                            data={followers}
                            keyExtractor={(item) => item._id}
                            renderItem={(props) => renderUserItem(props, 'followers')}
                            onEndReached={() => loadFollowers(false)}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={() => renderFooter(followersLoading)}
                            ListEmptyComponent={() => renderEmpty(followersLoading, 'No followers yet')}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={followers.length === 0 ? styles.emptyList : undefined}
                        />
                    </View>

                    {/* Following list */}
                    <View style={styles.listContainer}>
                        <FlatList
                            data={following}
                            keyExtractor={(item) => item._id}
                            renderItem={(props) => renderUserItem(props, 'following')}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 12,
        // paddingTop: 48,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    placeholder: {
        width: 40,
    },
    tabBar: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        position: 'relative',
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
    },
    tabText: {
        color: '#888',
        fontSize: 14,
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        width: SCREEN_WIDTH / 2,
        height: 1,
        backgroundColor: '#fff',
    },
    sectionHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    listContainer: {
        width: SCREEN_WIDTH,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#333',
    },
    userInfo: {
        flex: 1,
        marginLeft: 12,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    username: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    displayName: {
        color: '#888',
        fontSize: 13,
        marginTop: 2,
    },
    actionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: 8,
    },
    messageButton: {
        backgroundColor: '#333',
    },
    followBackButton: {
        backgroundColor: '#0095f6',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    removeButton: {
        padding: 8,
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyText: {
        color: '#888',
        fontSize: 16,
    },
    emptyList: {
        flex: 1,
    },
});

export default FollowersFollowingModal;
