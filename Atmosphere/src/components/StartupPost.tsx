/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import { NavigationContext } from '@react-navigation/native';
import { followUser, unfollowUser, checkFollowing } from '../lib/api';
import { getImageSource } from '../lib/image';
import { useEffect } from 'react';
import { Alert } from 'react-native';

type StartupCard = {
    id: string;
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
    stats?: { likes: number; comments: number; crowns: number; shares: number };
};

const StartupPost = ({ post, company, currentUserId, onOpenProfile }: { post?: StartupCard; company?: StartupCard; currentUserId?: string | null; onOpenProfile?: (id: string) => void }) => {
    const companyData = post || company;
    useContext(ThemeContext); // keep theme context in case other components rely on it
    const [liked, setLiked] = useState(false);
    const stats = companyData?.stats || { likes: 0, comments: 0, crowns: 0, shares: 0 };
    const [likes, setLikes] = useState<number>(stats.likes || 0);
    const [followed, setFollowed] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        const init = async () => {
            try {
                const target = (companyData as any).userId || (companyData as any).user || null;
                if (!target) return;
                const res = await checkFollowing(String(target));
                if (!mounted) return;
                setFollowed(Boolean(res?.isFollowing));
            } catch {
                // ignore init errors
            }
        };
        init();
        return () => { mounted = false; };
    }, [companyData]);

    const navigation = useContext(NavigationContext) as any | undefined;

    if (!companyData) return null;

    const toggleLike = () => {
        setLiked((v) => {
            setLikes((l) => (v ? l - 1 : l + 1));
            return !v;
        });
    };

    const totalFunding = (companyData.fundingRaised || 0) + (companyData.fundingNeeded || 0);
    const fundingPercent = totalFunding > 0 ? ((companyData.fundingRaised || 0) / totalFunding) * 100 : 0;

    const formatCurrency = (num: number) => {
        if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
        return `$${num}`;
    };

    return (
        <View style={[styles.card, { backgroundColor: '#070707', borderColor: '#0b0b0b' }]}>
            <View style={styles.headerTop}>
                <TouchableOpacity style={styles.headerLeftRow} activeOpacity={0.8} onPress={() => {
                    try {
                        const rawTarget = (companyData as any).userId || (companyData as any).user || companyData.id;
                        const targetId = rawTarget ? String(rawTarget) : null;
                        if (onOpenProfile && targetId) {
                            onOpenProfile(targetId);
                            return;
                        }
                        if (targetId && navigation && typeof navigation.navigate === 'function') {
                            navigation.navigate('Profile', { userId: targetId });
                            return;
                        }
                        console.warn('StartupPost: no navigation available to open profile for', targetId);
                    } catch (err) {
                        console.warn('StartupPost: navigation error', err);
                    }
                }}>
                    <Image source={getImageSource(companyData.profileImage)} style={styles.avatar} onError={(e) => { console.warn('StartupPost avatar error', e.nativeEvent, companyData.profileImage); }} />
                    <View style={styles.headerLeft}>
                        <Text style={[styles.companyName, { color: '#fff' }]}>{companyData.name}</Text>
                        {companyData.verified && <Text style={styles.verifiedSmall}>Verified startup</Text>}
                    </View>
                </TouchableOpacity>
                {((companyData as any).userId || (companyData as any).user || companyData.id) !== String(currentUserId) && (
                    <TouchableOpacity
                        onPress={async () => {
                            if (followLoading) return;
                            const newState = !followed;
                            setFollowed(newState); // optimistic
                            setFollowLoading(true);
                            try {
                                const targetId = (companyData as any).userId || (companyData as any).user || companyData.id;
                                if (!targetId) throw new Error('Missing target user id');
                                if (newState) {
                                    await followUser(String(targetId));
                                } else {
                                    await unfollowUser(String(targetId));
                                }
                            } catch (err: any) {
                                // revert optimistic
                                setFollowed(!newState);
                                Alert.alert('Error', err?.message || 'Could not update follow status');
                            } finally {
                                setFollowLoading(false);
                            }
                        }}
                        style={[styles.followBtn, followed && styles.followBtnActive]}
                        disabled={followLoading}
                    >
                        <Text style={[styles.followBtnText, followed && styles.followBtnTextActive]}>{followed ? 'Following' : 'Follow'}</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.imageWrap}>
                <Image source={getImageSource(companyData.profileImage)} style={styles.mainImage} resizeMode="cover" onError={(e) => { console.warn('StartupPost main image error', e.nativeEvent, companyData.profileImage); }} />
            </View>

            <View style={styles.actionsRow}>
                <View style={styles.statItemRow}>
                    <TouchableOpacity style={styles.statItem} onPress={toggleLike}>
                        <Text style={[styles.heart, { color: liked ? '#e74c3c' : '#ddd' }]}>❤</Text>
                        <Text style={[styles.statCount, { color: '#ddd' }]}>{likes}</Text>
                    </TouchableOpacity>
                    <View style={styles.statItem}><Text style={[styles.statIcon, { color: '#ddd' }]}>👑</Text><Text style={[styles.statCount, { color: '#ddd' }]}>{stats.crowns}</Text></View>
                    <View style={styles.statItem}><Text style={[styles.statIcon, { color: '#ddd' }]}>💬</Text><Text style={[styles.statCount, { color: '#ddd' }]}>{stats.comments}</Text></View>
                    <View style={styles.statItem}><Text style={[styles.statIcon, { color: '#ddd' }]}>📤</Text><Text style={[styles.statCount, { color: '#ddd' }]}>{stats.shares}</Text></View>
                </View>
            </View>

            <View style={styles.body}>
                <Text style={styles.whatsLabel}>WHAT'S {companyData.name.toUpperCase()}</Text>
                <Text style={styles.descriptionFull}>{companyData.description}</Text>

                <View style={styles.stageRow}>
                    <Text style={styles.stageText}>STAGE : <Text style={styles.stageValue}>{String(companyData.stage || 'MVP LAUNCHED')}</Text></Text>
                </View>

                <View style={styles.pillsRow}>
                    <View style={styles.pill}><Text style={styles.pillText}>Rvnu generating</Text></View>
                    <View style={styles.pill}><Text style={styles.pillText}>Rounds : {companyData.rounds ?? 0}</Text></View>
                    <View style={styles.pill}><Text style={styles.pillText}>Age : {companyData.age ?? 0} yr</Text></View>
                </View>

                <Text style={styles.currentRound}>Current round : <Text style={styles.currentRoundValue}>Series A</Text></Text>

                <View style={styles.fundingBarWrap}>
                    <View style={styles.fundingBarTrack}>
                        <View style={[styles.fundingFilled, { width: `${fundingPercent}%` }]} />
                    </View>
                    <View style={styles.fundingLabelsRow}>
                        <Text style={styles.filledLabel}>{formatCurrency(companyData.fundingRaised ?? 0)} Filled</Text>
                        <Text style={styles.totalLabel}>{formatCurrency(companyData.fundingNeeded ?? 0)}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderRadius: 8,
        marginVertical: 8,
        overflow: 'hidden',
        marginHorizontal: 12
    },
    headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 },
    headerLeftRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    headerLeft: { marginLeft: 10 },
    avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#333', borderWidth: 2, borderColor: '#111' },
    followBtn: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
    followBtnActive: { backgroundColor: '#111', borderColor: '#111' },
    followBtnText: { color: '#fff', fontWeight: '700' },
    followBtnTextActive: { color: '#fff' },
    companyName: { fontWeight: '700', fontSize: 16 },
    verifiedSmall: { color: '#bbb', fontSize: 12, marginTop: 2 },
    imageWrap: { paddingHorizontal: 12, paddingTop: 8 },
    mainImage: { width: '100%', height: 420, backgroundColor: '#222', borderRadius: 6 },
    actionsRow: { paddingHorizontal: 12, paddingTop: 12 },
    statItemRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statCount: { fontSize: 12, fontWeight: '600' },
    heart: { fontSize: 18 },
    statIcon: { fontSize: 14 },
    body: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 16 },
    whatsLabel: { color: '#bbb', fontSize: 12, marginBottom: 8 },
    descriptionFull: { color: '#ddd', fontSize: 14, lineHeight: 20, marginBottom: 12 },
    stageRow: { marginTop: 8, marginBottom: 8 },
    stageText: { color: '#bbb', fontSize: 12 },
    stageValue: { color: '#fff', fontWeight: '700' },
    pillsRow: { flexDirection: 'row', gap: 8, marginTop: 10, marginBottom: 12 },
    pill: { borderWidth: 1, borderColor: '#222', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#111' },
    pillText: { color: '#ddd', fontWeight: '700' },
    currentRound: { color: '#bbb', marginTop: 12, marginBottom: 8 },
    currentRoundValue: { color: '#fff', fontWeight: '700' },
    fundingBarWrap: { marginTop: 8 },
    fundingBarTrack: { height: 18, borderRadius: 10, backgroundColor: '#0f0f0f', overflow: 'hidden' },
    fundingFilled: { height: '100%', backgroundColor: '#888888' },
    fundingLabelsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    filledLabel: { color: '#bbb' },
    totalLabel: { color: '#bbb' },
});

export default StartupPost;
