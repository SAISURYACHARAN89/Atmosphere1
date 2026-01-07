import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { fetchReels, likeReel, unlikeReel, checkReelShared, followUser, unfollowUser, getReel, getUserReels, saveReel, unsaveReel } from '../../lib/api';
import { Video as VideoIcon } from 'lucide-react-native';
import Video from 'react-native-video';
import ReelCommentsOverlay from '../../components/ReelCommentsOverlay';
import ShareModal from '../../components/ShareModal';
import { getImageSource } from '../../lib/image';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ReelItem, ReelsProps } from './types';
import { styles, COLORS, ITEM_HEIGHT, SCREEN_WIDTH } from './styles';
import ReelActions from './ReelActions';

const Reels = ({ userId, initialReelId, onBack, onOpenProfile }: ReelsProps) => {
    const [reels, setReels] = useState<ReelItem[]>([]);
    const flatListRef = useRef<FlatList>(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Modal states
    const [commentsReelId, setCommentsReelId] = useState<string | null>(null);
    const [shareReelId, setShareReelId] = useState<string | null>(null);
    const [shareAlreadyShared, setShareAlreadyShared] = useState(false);

    // Loading states
    const [likeLoading, setLikeLoading] = useState<Set<string>>(new Set());
    const [followLoading, setFollowLoading] = useState<Set<string>>(new Set());
    const [saveLoading, setSaveLoading] = useState<Set<string>>(new Set());

    // Expanded caption states
    const [expandedCaptions, setExpandedCaptions] = useState<Set<string>>(new Set());

    // Comment input
    const [commentText, setCommentText] = useState('');

    // Get current user ID
    useEffect(() => {
        (async () => {
            try {
                const stored = await AsyncStorage.getItem('user');
                if (stored) {
                    const u = JSON.parse(stored);
                    setCurrentUserId(u?._id || u?.id || null);
                }
            } catch { }
        })();
    }, []);

    useEffect(() => {
        loadReels();
    }, [userId, initialReelId]);

    // Scroll to initial reel if present
    useEffect(() => {
        if (initialReelId && reels.length > 0 && flatListRef.current) {
            const index = reels.findIndex(r => r._id === initialReelId);
            if (index >= 0) {
                setTimeout(() => {
                    flatListRef.current?.scrollToIndex({ index, animated: false });
                    setCurrentIndex(index);
                }, 100);
            }
        }
    }, [initialReelId, reels]);

    const loadReels = async () => {
        try {
            let data: any[] = [];
            if (userId) {
                data = await getUserReels(userId, 30, 0);
            } else {
                data = await fetchReels(30, 0);
            }

            if (initialReelId) {
                const alreadyExists = data.find((r: any) => r._id === initialReelId);
                if (!alreadyExists) {
                    try {
                        const targetReel = await getReel(initialReelId);
                        if (targetReel) {
                            data = [targetReel, ...data];
                        }
                    } catch (e) {
                        console.warn('Failed to load initial reel:', e);
                    }
                }
            }

            const reelsWithDefaults = data.map((reel: any) => ({
                ...reel,
                sharesCount: reel.sharesCount || 0,
                isLiked: reel.isLiked || false,
                isShared: false,
                isFollowing: reel.author?.isFollowing || reel.isFollowing || false,
            }));
            setReels(reelsWithDefaults);
        } catch (err) {
            console.warn('Failed to load reels:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = useCallback(async (reelId: string) => {
        if (likeLoading.has(reelId)) return;
        const reel = reels.find(r => r._id === reelId);
        if (!reel) return;

        const wasLiked = reel.isLiked;
        setReels(prev => prev.map(r =>
            r._id === reelId
                ? { ...r, isLiked: !wasLiked, likesCount: wasLiked ? Math.max(0, r.likesCount - 1) : r.likesCount + 1 }
                : r
        ));

        setLikeLoading(prev => new Set(prev).add(reelId));
        try {
            if (wasLiked) await unlikeReel(reelId);
            else await likeReel(reelId);
        } catch {
            setReels(prev => prev.map(r =>
                r._id === reelId
                    ? { ...r, isLiked: wasLiked, likesCount: wasLiked ? r.likesCount + 1 : Math.max(0, r.likesCount - 1) }
                    : r
            ));
        } finally {
            setLikeLoading(prev => { const next = new Set(prev); next.delete(reelId); return next; });
        }
    }, [reels, likeLoading]);

    const handleFollow = useCallback(async (authorId: string, reelId: string) => {
        if (!authorId || followLoading.has(authorId)) return;
        const reel = reels.find(r => r._id === reelId);
        if (!reel) return;

        const wasFollowing = reel.isFollowing;
        setReels(prev => prev.map(r => r.author?._id === authorId ? { ...r, isFollowing: !wasFollowing } : r));
        setFollowLoading(prev => new Set(prev).add(authorId));

        try {
            if (wasFollowing) await unfollowUser(authorId);
            else await followUser(authorId);
        } catch {
            setReels(prev => prev.map(r => r.author?._id === authorId ? { ...r, isFollowing: wasFollowing } : r));
        } finally {
            setFollowLoading(prev => { const next = new Set(prev); next.delete(authorId); return next; });
        }
    }, [reels, followLoading]);

    const handleOpenComments = useCallback((reelId: string) => setCommentsReelId(reelId), []);

    const handleOpenShare = useCallback(async (reelId: string) => {
        try {
            const result = await checkReelShared(reelId);
            setShareAlreadyShared(result.shared || false);
        } catch { setShareAlreadyShared(false); }
        setShareReelId(reelId);
    }, []);

    const handleCommentAdded = useCallback((newCount?: number) => {
        if (commentsReelId) {
            setReels(prev => prev.map(r =>
                r._id === commentsReelId ? { ...r, commentsCount: typeof newCount === 'number' ? newCount : r.commentsCount + 1 } : r
            ));
        }
    }, [commentsReelId]);

    const handleCommentDeleted = useCallback(() => {
        if (commentsReelId) {
            setReels(prev => prev.map(r => r._id === commentsReelId ? { ...r, commentsCount: Math.max(0, r.commentsCount - 1) } : r));
        }
    }, [commentsReelId]);

    const handleShareComplete = useCallback((sharesCount: number) => {
        if (shareReelId) {
            setReels(prev => prev.map(r => r._id === shareReelId ? { ...r, sharesCount, isShared: true } : r));
        }
    }, [shareReelId]);

    const handleCommentInputPress = () => {
        const currentReel = reels[currentIndex];
        if (currentReel) setCommentsReelId(currentReel._id);
    };

    const toggleCaptionExpand = (reelId: string) => {
        setExpandedCaptions(prev => {
            const next = new Set(prev);
            next.has(reelId) ? next.delete(reelId) : next.add(reelId);
            return next;
        });
    };

    const handleSave = useCallback(async (reelId: string) => {
        if (saveLoading.has(reelId)) return;
        const reel = reels.find(r => r._id === reelId);
        if (!reel) return;

        const wasSaved = reel.isSaved;
        setReels(prev => prev.map(r => r._id === reelId ? { ...r, isSaved: !wasSaved } : r));
        setSaveLoading(prev => new Set(prev).add(reelId));

        try {
            if (wasSaved && reel.savedId) {
                await unsaveReel(reel.savedId);
            } else {
                const result = await saveReel(reelId);
                if (result?.savedId || result?._id) {
                    setReels(prev => prev.map(r => r._id === reelId ? { ...r, savedId: result.savedId || result._id } : r));
                }
            }
        } catch {
            setReels(prev => prev.map(r => r._id === reelId ? { ...r, isSaved: wasSaved } : r));
        } finally {
            setSaveLoading(prev => { const next = new Set(prev); next.delete(reelId); return next; });
        }
    }, [reels, saveLoading]);

    const handleProfilePress = useCallback((authorId: string) => {
        if (authorId && onOpenProfile) onOpenProfile(authorId);
    }, [onOpenProfile]);

    const renderReel = ({ item, index }: { item: ReelItem; index: number }) => {
        const isActive = index === currentIndex;
        const authorName = item.author.displayName || item.author.username || 'User';
        const authorAvatar = item.author.avatarUrl;
        const isExpanded = expandedCaptions.has(item._id);

        const captionText = item.caption || '';
        const hashtagRegex = /#\w+/g;
        const extractedHashtags = captionText.match(hashtagRegex) || [];
        const hashtags = item.hashtags || extractedHashtags;
        const captionWithoutHashtags = captionText.replace(hashtagRegex, '').trim();

        return (
            <View style={styles.reelWrapper}>
                <View style={styles.reelContainer}>
                    {isActive && item.videoUrl ? (
                        <Video
                            source={{ uri: item.videoUrl }}
                            style={styles.video}
                            resizeMode="cover"
                            repeat
                            paused={false}
                            muted={false}
                            bufferConfig={{ minBufferMs: 2000, maxBufferMs: 5000, bufferForPlaybackMs: 1000, bufferForPlaybackAfterRebufferMs: 2000 }}
                            onError={(e) => console.log('Video error:', e)}
                        />
                    ) : (
                        <Image source={{ uri: item.thumbnailUrl || item.videoUrl }} style={styles.video} resizeMode="cover" />
                    )}

                    <View style={styles.overlay}>
                        <View style={styles.leftContent}>
                            <View style={styles.userRow}>
                                <TouchableOpacity style={styles.avatarContainer} onPress={() => item.author._id && handleProfilePress(item.author._id)}>
                                    {authorAvatar ? (
                                        <Image source={getImageSource(authorAvatar)} style={styles.avatar} />
                                    ) : (
                                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                            <Text style={styles.avatarText}>{authorName.charAt(0).toUpperCase()}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => item.author._id && handleProfilePress(item.author._id)}>
                                    <Text style={styles.username}>{item.author.username}</Text>
                                </TouchableOpacity>
                                {!item.isFollowing && item.author._id && item.author._id !== currentUserId && (
                                    <TouchableOpacity style={styles.followBtn} onPress={() => handleFollow(item.author._id!, item._id)} disabled={followLoading.has(item.author._id!)}>
                                        <Text style={styles.followBtnText}>Follow</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {captionText && (
                                <TouchableOpacity onPress={() => toggleCaptionExpand(item._id)} activeOpacity={0.8}>
                                    {isExpanded ? (
                                        <View>
                                            <Text style={styles.caption}>{captionWithoutHashtags}</Text>
                                            {hashtags.length > 0 && <Text style={styles.hashtags}>{hashtags.join(' ')}</Text>}
                                        </View>
                                    ) : (
                                        <Text style={styles.caption} numberOfLines={1}>
                                            {captionWithoutHashtags.length > 40 ? `${captionWithoutHashtags.substring(0, 40)}...` : captionWithoutHashtags}
                                            {captionWithoutHashtags.length > 40 && <Text style={styles.moreText}> more</Text>}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>

                        <ReelActions
                            reel={item}
                            likeLoading={likeLoading.has(item._id)}
                            saveLoading={saveLoading.has(item._id)}
                            onLike={() => handleLike(item._id)}
                            onComment={() => handleOpenComments(item._id)}
                            onShare={() => handleOpenShare(item._id)}
                            onSave={() => handleSave(item._id)}
                        />
                    </View>
                </View>
            </View>
        );
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index || 0);
    }).current;

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (reels.length === 0) {
        return (
            <View style={[styles.container, styles.center]}>
                <VideoIcon size={64} color="#666" />
                <Text style={styles.emptyText}>No reels yet</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={reels}
                renderItem={renderReel}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                snapToAlignment="start"
                decelerationRate="fast"
                disableIntervalMomentum={true}
                bounces={false}
                extraData={currentIndex}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
                contentContainerStyle={{ flexGrow: 1 }}
                removeClippedSubviews={true}
                initialNumToRender={3}
                maxToRenderPerBatch={4}
                scrollEventThrottle={16}
                onScrollToIndexFailed={(info) => {
                    setTimeout(() => flatListRef.current?.scrollToIndex({ index: info.index, animated: false }), 500);
                }}
            />

            <View style={styles.commentInputContainer}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Add comment..."
                    placeholderTextColor="#888"
                    value={commentText}
                    onChangeText={setCommentText}
                    onFocus={handleCommentInputPress}
                />
            </View>

            {commentsReelId && (
                <ReelCommentsOverlay
                    reelId={commentsReelId}
                    visible={!!commentsReelId}
                    onClose={() => setCommentsReelId(null)}
                    onCommentAdded={handleCommentAdded}
                    onCommentDeleted={handleCommentDeleted}
                />
            )}

            {shareReelId && (
                <ShareModal
                    contentId={shareReelId}
                    type="reel"
                    visible={!!shareReelId}
                    onClose={() => setShareReelId(null)}
                    onShareComplete={handleShareComplete}
                    alreadyShared={shareAlreadyShared}
                    contentTitle={reels.find(r => r._id === shareReelId)?.caption || 'Reel'}
                    contentImage={reels.find(r => r._id === shareReelId)?.thumbnailUrl || reels.find(r => r._id === shareReelId)?.videoUrl}
                    contentOwner={reels.find(r => r._id === shareReelId)?.author.displayName || reels.find(r => r._id === shareReelId)?.author.username}
                />
            )}
        </View>
    );
};

export default Reels;
