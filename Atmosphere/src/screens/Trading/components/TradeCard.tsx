import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image as RNImage, Animated, LayoutAnimation, UIManager, Platform } from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
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
    onOpenInvestorProfile,
}) => {
    // Animation value for opacity (uses native driver for smoothness)
    const opacityAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

    // Video play/pause state - default to playing when expanded
    const [isVideoPaused, setIsVideoPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(false);
    const videoRef = useRef<any>(null);
    const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Auto-hide controls after 1.5 seconds
    const showControlsTemporarily = () => {
        setShowControls(true);
        if (controlsTimer.current) clearTimeout(controlsTimer.current);
        controlsTimer.current = setTimeout(() => {
            setShowControls(false);
        }, 1500);
    };

    // Reset video state when collapsed
    useEffect(() => {
        if (!isExpanded) {
            setIsVideoPaused(false);
            setShowControls(false);
        }
    }, [isExpanded]);

    // Animate when isExpanded changes
    useEffect(() => {
        // ... (existing animation code)
        LayoutAnimation.configureNext({
            duration: 200,
            update: { type: LayoutAnimation.Types.easeInEaseOut },
            create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
            delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
        });

        // Smooth opacity fade
        Animated.timing(opacityAnim, {
            toValue: isExpanded ? 1 : 0,
            duration: 200,
            useNativeDriver: true, // Native driver for smooth animation
        }).start();
    }, [isExpanded, opacityAnim]);

    // Combine images and video into one media array - video is last
    // ... (existing media count logic)
    const imageCount = trade.imageUrls?.length || 0;
    const hasVideo = !!trade.videoUrl;
    const totalMediaCount = imageCount + (hasVideo ? 1 : 0);
    const isCurrentItemVideo = hasVideo && currentPhotoIndex === imageCount;

    return (
        <View style={styles.professionalTradeCard}>
            {/* Header Row - Startup info on left, Investor info on right (when expanded) */}
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onToggleExpand}
                style={[styles.collapsedCardRow, isExpanded && styles.expandedCardHeader]}
            >
                {/* Startup Info - Avatar is clickable for navigation, rest expands card */}
                <View style={styles.startupInfoTouchable}>
                    {/* Avatar - Only this is clickable for profile navigation */}
                    <TouchableOpacity
                        onPress={(e) => {
                            e.stopPropagation();
                            // Only navigate if expanded AND companyId is a valid MongoDB ObjectId (24 hex chars)
                            const isValidMongoId = trade.companyId && /^[0-9a-fA-F]{24}$/.test(trade.companyId);
                            if (isExpanded && onOpenStartupProfile && isValidMongoId) {
                                onOpenStartupProfile(trade.companyId);
                            } else {
                                onToggleExpand();
                            }
                        }}
                        activeOpacity={0.7}
                    >
                        {trade.imageUrls && trade.imageUrls.length > 0 && trade.imageUrls[0] ? (
                            <RNImage
                                source={{ uri: trade.imageUrls[0] }}
                                style={styles.collapsedAvatar}
                            />
                        ) : (
                            <View style={styles.collapsedAvatar}>
                                <Text style={styles.collapsedAvatarText}>
                                    {trade.companyName[0]}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Company Info - Name and Description stacked (not clickable for navigation) */}
                    <View style={styles.collapsedCompanyInfo}>
                        <Text style={styles.collapsedCompanyName}>{trade.companyName}</Text>
                        {!isExpanded && (
                            <Text style={styles.collapsedDescription} numberOfLines={2}>
                                {trade.description || 'No description provided'}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Investor Info - Top Right (only when expanded, hide only if user is a startup account) */}
                {isExpanded && trade.user && (trade.user.displayName || trade.user.username) &&
                    !((trade.user as any).roles?.includes('startup') || (trade.user as any).accountType === 'startup') && (
                        <View style={styles.investorInfoContainer}>
                            <Text style={styles.investorName} numberOfLines={1}>
                                {trade.user.displayName || `@${trade.user.username}`}
                            </Text>
                            {/* Investor Avatar - Only this is clickable for profile navigation */}
                            <TouchableOpacity
                                onPress={(e) => {
                                    e.stopPropagation();
                                    if (onOpenInvestorProfile && trade.user?._id) {
                                        onOpenInvestorProfile(trade.user._id);
                                    }
                                }}
                                activeOpacity={0.7}
                            >
                                {trade.user.avatarUrl ? (
                                    <RNImage
                                        source={{ uri: trade.user.avatarUrl }}
                                        style={styles.investorAvatar}
                                    />
                                ) : (
                                    <View style={[styles.investorAvatar, { alignItems: 'center', justifyContent: 'center' }]}>
                                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                                            {(trade.user.displayName || trade.user.username || 'I')[0].toUpperCase()}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
            </TouchableOpacity>

            {/* Expanded Content - LayoutAnimation handles smooth transition */}
            {isExpanded && (
                <Animated.View style={{ opacity: opacityAnim }}>
                    {/* Description Below Profile Pic (Full Size) */}
                    <Text style={styles.expandedDescription}>
                        {trade.description || 'No description provided'}
                    </Text>

                    {/* Industry Tags - Now below description */}
                    {trade.selectedIndustries && trade.selectedIndustries.length > 0 && (
                        <View style={styles.professionalTags}>
                            {trade.selectedIndustries.map((industry, idx) => (
                                <View key={idx} style={styles.professionalTag}>
                                    <Text style={styles.professionalTagText}>{industry}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Media Carousel (Images + Video at end) */}
                    {totalMediaCount > 0 && (
                        <View style={styles.professionalImageContainer}>
                            {isCurrentItemVideo ? (
                                // Show Video Player - Tap to toggle play/pause
                                <View style={{ width: '100%', height: '100%' }}>
                                    <Video
                                        ref={videoRef}
                                        source={{ uri: trade.videoUrl }}
                                        style={styles.professionalImage}
                                        controls={false}
                                        resizeMode="cover"
                                        repeat={true}
                                        paused={!isExpanded || isVideoPaused}
                                        muted={isMuted}
                                        onLoad={(data: any) => {
                                            setDuration(data.duration);
                                            // Show controls initially for 2 seconds
                                            showControlsTemporarily();
                                        }}
                                        onProgress={(data: any) => setCurrentTime(data.currentTime)}
                                    />
                                    {/* Touch overlay on top of video */}
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => {
                                            console.log('[TradeCard Video] Tap detected');
                                            setIsVideoPaused(!isVideoPaused);
                                            showControlsTemporarily();
                                        }}
                                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}
                                    >
                                        {/* Play icon overlay when paused (only when controls visible) */}
                                        {showControls && isVideoPaused && (
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                                                <MaterialCommunityIcons name="play-circle" size={50} color="rgba(255,255,255,0.8)" />
                                            </View>
                                        )}
                                    </TouchableOpacity>

                                    {/* Mute Button - Bottom Right (only when controls visible) */}
                                    {showControls && (
                                        <TouchableOpacity
                                            style={{ position: 'absolute', bottom: 30, right: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 15, padding: 6, zIndex: 20 }}
                                            onPress={() => setIsMuted(!isMuted)}
                                        >
                                            <MaterialCommunityIcons name={isMuted ? "volume-off" : "volume-high"} size={18} color="#fff" />
                                        </TouchableOpacity>
                                    )}

                                    {/* Progress Bar - Bottom */}
                                    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 20, justifyContent: 'center' }}>
                                        <Slider
                                            style={{ width: '100%', height: 40 }}
                                            minimumValue={0}
                                            maximumValue={duration || 1}
                                            value={currentTime}
                                            minimumTrackTintColor="#fff"
                                            maximumTrackTintColor="rgba(255,255,255,0.3)"
                                            thumbTintColor="transparent"
                                            onSlidingComplete={(val: number) => {
                                                videoRef.current?.seek(val);
                                                setCurrentTime(val);
                                            }}
                                        />
                                    </View>
                                </View>
                            ) : (
                                // Show Image
                                <RNImage
                                    source={{ uri: trade.imageUrls?.[currentPhotoIndex] }}
                                    style={styles.professionalImage}
                                />
                            )}

                            {/* Navigation Arrows */}
                            {totalMediaCount > 1 && (
                                <>
                                    {/* Left Arrow */}
                                    {currentPhotoIndex > 0 && (
                                        <TouchableOpacity
                                            style={[styles.professionalArrow, styles.professionalArrowLeft]}
                                            onPress={() => onPhotoIndexChange(currentPhotoIndex - 1)}
                                        >
                                            <MaterialCommunityIcons name="chevron-left" size={22} color="#fff" />
                                        </TouchableOpacity>
                                    )}

                                    {/* Right Arrow */}
                                    {currentPhotoIndex < totalMediaCount - 1 && (
                                        <TouchableOpacity
                                            style={[styles.professionalArrow, styles.professionalArrowRight]}
                                            onPress={() => onPhotoIndexChange(currentPhotoIndex + 1)}
                                        >
                                            <MaterialCommunityIcons name="chevron-right" size={22} color="#fff" />
                                        </TouchableOpacity>
                                    )}

                                    {/* Media Indicators (Dots) */}
                                    <View style={styles.professionalIndicators}>
                                        {Array.from({ length: totalMediaCount }).map((_, idx) => (
                                            <View
                                                key={idx}
                                                style={[
                                                    styles.professionalDot,
                                                    idx === currentPhotoIndex && styles.professionalDotActive
                                                ]}
                                            />
                                        ))}
                                    </View>
                                </>
                            )}
                        </View>
                    )}

                    {/* Info Grid */}
                    <View style={styles.professionalInfoGrid}>
                        <View style={styles.professionalInfoItem}>
                            <Text style={styles.professionalInfoLabel}>Revenue</Text>
                            <Text style={styles.professionalInfoValue}>
                                {trade.revenueStatus === 'revenue-generating' ? 'Revenue Generating' : 'Pre Revenue'}
                            </Text>
                        </View>
                        {trade.fundingTarget ? (
                            <View style={styles.professionalInfoItem}>
                                <Text style={styles.professionalInfoLabel}>Valuation</Text>
                                <Text style={styles.professionalInfoValue}>
                                    ${trade.fundingTarget.toLocaleString()}
                                </Text>
                            </View>
                        ) : null}
                        <View style={styles.professionalInfoItem}>
                            <Text style={styles.professionalInfoLabel}>Age</Text>
                            <Text style={styles.professionalInfoValue}>{trade.companyAge || 'N/A'}</Text>
                        </View>
                        <View style={[styles.professionalInfoItem, styles.professionalInfoItemLast]}>
                            <Text style={styles.professionalInfoLabel}>Range</Text>
                            <Text style={styles.professionalInfoValue}>
                                {trade.sellingRangeMin}% - {trade.sellingRangeMax}%
                            </Text>
                        </View>
                    </View>

                    {/* Action Buttons - Express Interest + Save side by side */}
                    <View style={styles.actionButtonsRow}>
                        <TouchableOpacity style={styles.expressInterestButton} onPress={onExpressInterest}>
                            <Text style={styles.expressInterestText}>Express Interest</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.saveButtonOutline, isSaved && { backgroundColor: '#4a4a4a' }]}
                            onPress={onToggleSave}
                        >
                            <MaterialCommunityIcons
                                name={isSaved ? "bookmark" : "bookmark-outline"}
                                size={20}
                                color="#fff"
                            />
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
        </View>
    );
};
