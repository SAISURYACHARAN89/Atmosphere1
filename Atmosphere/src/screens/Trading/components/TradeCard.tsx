import Slider from '@react-native-community/slider';
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image as RNImage, Animated, LayoutAnimation, UIManager, Platform } from 'react-native';
import Video from 'react-native-video';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActiveTrade } from '../types';
import { styles } from '../styles';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TradeCardProps {
    trade: ActiveTrade;
    isExpanded: boolean;
    isSaved: boolean;
    currentPhotoIndex: number;
    onToggleExpand: () => void;
    onToggleSave: () => void;
    onPhotoIndexChange: (index: number) => void;
    onExpressInterest: () => void;
    onChatWithOwner?: () => void;
    onOpenStartupProfile?: (id: string) => void;
    onOpenInvestorProfile?: (id: string) => void;
}

export const TradeCard: React.FC<TradeCardProps> = ({
    trade,
    isExpanded,
    isSaved,
    currentPhotoIndex,
    onToggleExpand,
    onToggleSave,
    onPhotoIndexChange,
    onExpressInterest,
    onChatWithOwner,
    onOpenStartupProfile,
    onOpenInvestorProfile
}) => {
    // Animation state
    const opacityAnim = useRef(new Animated.Value(0)).current;

    // Video controls state
    const videoRef = useRef<any>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false);
    const [isVideoPaused, setIsVideoPaused] = useState(true); // Default paused

    // Derived state
    const hasVideo = !!trade.videoUrl;
    // Construct media array: Video first if exists, then images
    const mediaItems = hasVideo
        ? [(trade.videoUrl || ''), ...trade.imageUrls]
        : trade.imageUrls;

    const totalMediaCount = mediaItems.length;
    const isCurrentItemVideo = hasVideo && currentPhotoIndex === 0;

    useEffect(() => {
        if (isExpanded) {
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            opacityAnim.setValue(0);
            setIsVideoPaused(true); // Pause when collapsed
        }
    }, [isExpanded, opacityAnim]);

    const handleNextMedia = () => {
        if (currentPhotoIndex < totalMediaCount - 1) {
            onPhotoIndexChange(currentPhotoIndex + 1);
        }
    };

    const handlePrevMedia = () => {
        if (currentPhotoIndex > 0) {
            onPhotoIndexChange(currentPhotoIndex - 1);
        }
    };

    const onSeek = (value: number) => {
        videoRef.current?.seek(value);
        setCurrentTime(value);
    };

    const getAvatarInitials = (name: string) => {
        return name ? name.substring(0, 2).toUpperCase() : 'ST';
    };

    return (
        <View style={styles.professionalTradeCard}>
            {/* Header Section */}
            <View style={styles.professionalCardHeader}>
                <TouchableOpacity
                    onPress={() => onOpenStartupProfile?.(trade.companyId)}
                    style={styles.professionalAvatar}
                >
                    {trade.user?.avatarUrl ? (
                        <RNImage source={{ uri: trade.user.avatarUrl }} style={{ width: '100%', height: '100%', borderRadius: 22 }} />
                    ) : (
                        <Text style={styles.professionalAvatarText}>{getAvatarInitials(trade.companyName)}</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.professionalCompanyInfo}
                    onPress={onToggleExpand}
                >
                    <Text style={styles.professionalCompanyName}>{trade.companyName}</Text>
                    <Text style={styles.professionalUsername}>@{trade.startupUsername || 'startup'}</Text>
                </TouchableOpacity>

                <View style={styles.professionalActions}>
                    <TouchableOpacity onPress={onToggleSave} style={styles.professionalActionBtn}>
                        <MaterialCommunityIcons
                            name={isSaved ? "bookmark" : "bookmark-outline"}
                            size={24}
                            color={isSaved ? "#fff" : "#999"}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onToggleExpand} style={styles.professionalActionBtn}>
                        <MaterialCommunityIcons
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={24}
                            color="#999"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Expanded Content */}
            {isExpanded && (
                <Animated.View style={{ opacity: opacityAnim }}>
                    <Text style={styles.professionalDescription} numberOfLines={isExpanded ? undefined : 3}>
                        {trade.description}
                    </Text>

                    {/* Media Carousel */}
                    {totalMediaCount > 0 && (
                        <View style={styles.professionalImageContainer}>
                            {isCurrentItemVideo ? (
                                <View style={{ width: '100%', height: '100%' }}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => setIsVideoPaused(!isVideoPaused)}
                                        style={{ width: '100%', height: '100%' }}
                                    >
                                        <Video
                                            ref={videoRef}
                                            source={{ uri: mediaItems[currentPhotoIndex] }}
                                            style={styles.professionalImage}
                                            controls={false}
                                            resizeMode="cover"
                                            repeat={true}
                                            paused={!isExpanded || isVideoPaused || isSeeking}
                                            muted={isMuted}
                                            onLoad={(data) => setDuration(data.duration)}
                                            onProgress={(data) => {
                                                if (!isSeeking) setCurrentTime(data.currentTime);
                                            }}
                                        />

                                        {/* Play Overlay */}
                                        {isVideoPaused && (
                                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                                                <MaterialCommunityIcons name="play-circle" size={50} color="rgba(255,255,255,0.8)" />
                                            </View>
                                        )}

                                        {/* Mute Button - Top Right */}
                                        <TouchableOpacity
                                            style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, padding: 4 }}
                                            onPress={() => setIsMuted(!isMuted)}
                                        >
                                            <MaterialCommunityIcons name={isMuted ? "volume-off" : "volume-high"} size={14} color="#fff" />
                                        </TouchableOpacity>

                                        {/* Progress Bar - Bottom */}
                                        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 20, justifyContent: 'center', paddingHorizontal: 0 }}>
                                            <Slider
                                                style={{ width: '100%', height: 40 }}
                                                minimumValue={0}
                                                maximumValue={duration}
                                                value={currentTime}
                                                minimumTrackTintColor="#fff"
                                                maximumTrackTintColor="rgba(255,255,255,0.3)"
                                                thumbTintColor="transparent"
                                                onSlidingStart={() => setIsSeeking(true)}
                                                onSlidingComplete={(val) => {
                                                    setIsSeeking(false);
                                                    onSeek(val);
                                                }}
                                                onValueChange={(val) => setCurrentTime(val)}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <RNImage
                                    source={{ uri: mediaItems[currentPhotoIndex] }}
                                    style={styles.professionalImage}
                                    resizeMode="cover"
                                />
                            )}

                            {/* Carousel Arrows */}
                            {currentPhotoIndex > 0 && (
                                <TouchableOpacity
                                    style={[styles.professionalArrow, styles.professionalArrowLeft]}
                                    onPress={handlePrevMedia}
                                >
                                    <MaterialCommunityIcons name="chevron-left" size={24} color="#fff" />
                                </TouchableOpacity>
                            )}
                            {currentPhotoIndex < totalMediaCount - 1 && (
                                <TouchableOpacity
                                    style={[styles.professionalArrow, styles.professionalArrowRight]}
                                    onPress={handleNextMedia}
                                >
                                    <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
                                </TouchableOpacity>
                            )}

                            {/* Carousel Dots */}
                            {totalMediaCount > 1 && (
                                <View style={styles.professionalIndicators}>
                                    {mediaItems.map((_, index) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.professionalDot,
                                                currentPhotoIndex === index && styles.professionalDotActive
                                            ]}
                                        />
                                    ))}
                                </View>
                            )}
                        </View>
                    )}

                    {/* Stats Grid */}
                    <View style={styles.professionalInfoGrid}>
                        <View style={styles.professionalInfoItem}>
                            <Text style={styles.professionalInfoLabel}>Revenue Status</Text>
                            <Text style={styles.professionalInfoValue}>
                                {trade.revenueStatus === 'revenue-generating' ? 'Generating' : 'Pre-Revenue'}
                            </Text>
                        </View>
                        <View style={[styles.professionalInfoItem, styles.professionalInfoItemLast]}>
                            <Text style={styles.professionalInfoLabel}>Funding Target</Text>
                            <Text style={styles.professionalInfoValue}>
                                {trade.fundingTarget ? `$${trade.fundingTarget.toLocaleString()}` : 'N/A'}
                            </Text>
                        </View>
                    </View>

                    {/* Tags */}
                    {trade.selectedIndustries && trade.selectedIndustries.length > 0 && (
                        <View style={styles.professionalTags}>
                            {trade.selectedIndustries.slice(0, 3).map((tag, idx) => (
                                <View key={idx} style={styles.professionalTag}>
                                    <Text style={styles.professionalTagText}>{tag}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View style={styles.tradeActionRow}>
                        <TouchableOpacity style={styles.chatOwnerButton} onPress={onChatWithOwner}>
                            <Text style={styles.chatOwnerText}>Chat with Owner</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.expressInterestButton, { backgroundColor: '#fff' }]} onPress={onExpressInterest}>
                            <Text style={[styles.expressInterestText, { color: '#000' }]}>Express Interest</Text>
                        </TouchableOpacity>
                    </View>

                    {/* More info (Investor/User) */}
                    {trade.user && (
                        <View style={{ marginTop: 12, borderTopWidth: 1, borderTopColor: '#333', paddingTop: 12 }}>
                            <TouchableOpacity
                                onPress={() => onOpenInvestorProfile?.(trade.user._id)}
                                style={styles.investorInfoContainer}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: '#666', fontSize: 12, textAlign: 'right' }}>Listed by</Text>
                                    <Text style={styles.investorName}>{trade.user.displayName || trade.user.username}</Text>
                                </View>
                                {trade.user.avatarUrl ? (
                                    <RNImage source={{ uri: trade.user.avatarUrl }} style={[styles.investorAvatar, { width: 32, height: 32, borderRadius: 16 }]} />
                                ) : (
                                    <View style={[styles.investorAvatar, { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }]}>
                                        <Text style={{ color: '#fff', fontSize: 12 }}>{getAvatarInitials(trade.user.displayName)}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>
            )}
        </View>
    );
};
