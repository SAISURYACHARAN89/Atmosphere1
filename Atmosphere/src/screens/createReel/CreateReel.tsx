/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { createThumbnail } from 'react-native-create-thumbnail';
import { createReel, uploadVideo, uploadDocument } from '../../lib/api';
import Icon from 'react-native-vector-icons/Ionicons';
import Video, { VideoRef } from 'react-native-video';
import VideoTrimmer from '../../components/VideoTrimmer';
import { ThemeContext } from '../../contexts/ThemeContext';
import Slider from '@react-native-community/slider';

import { SelectedVideo, ReelStep, CreateReelProps } from './types';
import { styles, COLORS } from './styles';
import { getCleanUri, getDisplayUri, formatDuration, MAX_VIDEO_DURATION } from './utils';

const CreateReel = ({ onClose, onSuccess }: CreateReelProps) => {
    const { theme } = useContext(ThemeContext) as any;

    // Step state: 'trim' (step 1) or 'details' (step 2)
    const [step, setStep] = useState<ReelStep>('trim');

    const [selectedVideo, setSelectedVideo] = useState<SelectedVideo | null>(null);
    const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [thumbnails, setThumbnails] = useState<string[]>([]);
    const [videoReady, setVideoReady] = useState(false);
    const [videoError, setVideoError] = useState<string | null>(null);

    // Trimmer states
    const [showTrimmer, setShowTrimmer] = useState(false);

    const [seekTime, setSeekTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef<VideoRef>(null);

    // Initial load: Open Picker
    useEffect(() => {
        if (!selectedVideo) {
            handlePickVideo();
        }
    }, []);

    const handlePickVideo = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'video',
                quality: 0.5,
                videoQuality: 'low',
            });

            if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                if (!asset.uri) {
                    Alert.alert('Error', 'Selected video has no URI');
                    return;
                }

                // Check video duration - max 1 minute
                if (asset.duration && asset.duration > MAX_VIDEO_DURATION) {
                    Alert.alert(
                        'Video Too Long',
                        `Reels can be a maximum of ${MAX_VIDEO_DURATION} seconds (1 minute). Please select a shorter video or use the trim feature.`,
                        [{ text: 'OK' }]
                    );
                }

                const uri = asset.uri;
                setVideoReady(false);
                setVideoError(null);
                setSelectedVideo({
                    uri: uri,
                    type: asset.type,
                    fileName: asset.fileName,
                    duration: asset.duration,
                });
                setStep('trim');
                setIsPlaying(false);
                setTimeout(() => {
                    setVideoReady(true);
                    setIsPlaying(true);
                }, 1000);
            } else if (!selectedVideo) {
                onClose();
            }
        } catch (error: any) {
            console.error('Video picker error:', error);
            Alert.alert('Error', error?.message || 'Failed to pick video');
        }
    };

    const generateThumbnails = async (uri: string, duration: number) => {
        if (!uri || !duration) return;
        const numThumbs = 6;
        const interval = duration / numThumbs;
        const newThumbnails: string[] = [];

        try {
            for (let i = 0; i < numThumbs; i++) {
                const time = Math.floor(i * interval * 1000);
                try {
                    const cleanUri = getCleanUri(uri);
                    const thumb = await createThumbnail({
                        url: cleanUri,
                        timeStamp: time,
                        format: 'jpeg',
                        cacheName: `thumb_${i}_${Date.now()}`
                    });
                    newThumbnails.push(getDisplayUri(thumb.path));
                } catch (e) {
                    console.warn(`Thumbnail gen failed frame ${i}`, e);
                }
            }
            // console.log(`Generated ${newThumbnails.length} thumbnails`);
            setThumbnails(newThumbnails);
        } catch (error) {
            console.error('Error generating thumbnails:', error);
        }
    };

    const handleTrimComplete = (trimmedVideoUri: string) => {
        if (!trimmedVideoUri) return;
        setSelectedVideo({
            uri: trimmedVideoUri,
            type: 'video/mp4',
            fileName: 'trimmed_video.mp4',
            isTrimmed: true,
        });
        setCoverPhoto(null);
        setSeekTime(0);
        setIsPlaying(true);
        setShowTrimmer(false);
    };

    const handleNext = () => {
        if (!selectedVideo) return;
        setIsPlaying(false);
        setSeekTime(0);
        setStep('details');

        if (selectedVideo.duration) {
            generateThumbnails(selectedVideo.uri, selectedVideo.duration);
        }
    };

    const handleSliderChange = (value: number) => {
        setSeekTime(value);
        setIsPlaying(false);
        if (videoRef.current) {
            videoRef.current.seek(value);
        }
    };

    const handleShare = async () => {
        if (!selectedVideo) return;
        setLoading(true);
        try {
            setUploadStatus('Uploading video...');
            const uploadResult = await uploadVideo(selectedVideo.uri);

            setUploadStatus('Processing cover...');
            let finalCoverUrl = uploadResult.thumbnailUrl;

            let coverUriToUpload = coverPhoto;

            if (!coverUriToUpload && selectedVideo.duration) {
                try {
                    const cleanUri = getCleanUri(selectedVideo.uri);
                    // console.log('Generating cover from video at', seekTime, 'URI:', cleanUri);
                    const thumb = await createThumbnail({
                        url: cleanUri,
                        timeStamp: Math.floor(seekTime * 1000),
                        format: 'jpeg',
                        cacheName: `cover_${Date.now()}`
                    });
                    coverUriToUpload = getDisplayUri(thumb.path);
                    // console.log('Generated Cover URI:', coverUriToUpload);
                } catch (e) {
                    console.warn('Failed to generate cover at seek time, using default', e);
                }
            }

            if (coverUriToUpload) {
                try {
                    setUploadStatus('Uploading cover...');
                    // console.log('Uploading cover:', coverUriToUpload);
                    const uploadedUrl = await uploadDocument(
                        coverUriToUpload,
                        'cover.jpg',
                        'image/jpeg'
                    );
                    finalCoverUrl = uploadedUrl;
                } catch (e) {
                    console.error('Failed to upload cover photo', e);
                }
            }

            setUploadStatus('Creating reel...');
            const payload = {
                videoUrl: uploadResult.url,
                thumbnailUrl: finalCoverUrl,
                caption: caption.trim(),
                tags: tags.trim() ? tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean) : [],
                duration: uploadResult.duration || selectedVideo.duration || 0,
                seekTime: coverPhoto ? undefined : seekTime,
            };
            await createReel(payload);
            Alert.alert('Success', 'Reel created successfully!', [
                { text: 'OK', onPress: () => { onSuccess?.(); onClose(); } }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to create reel');
        } finally {
            setLoading(false);
            setUploadStatus('');
        }
    };

    // Render Step 1: Trim / Full Screen Preview
    const renderStep1 = () => {
        const safeUri = selectedVideo ? getCleanUri(selectedVideo.uri) : null;

        return (
            <View style={styles.fullScreenContainer}>
                {selectedVideo && videoReady && safeUri ? (
                    <Video
                        ref={videoRef}
                        source={{ uri: safeUri }}
                        style={styles.fullScreenVideo}
                        resizeMode="contain"
                        repeat={false}
                        muted={true}
                        paused={!isPlaying}
                        disableFocus={true}
                        playInBackground={false}
                        playWhenInactive={false}
                        onLoad={(data) => {
                            // console.log('Step 1 Video Loaded:', data.duration);
                            setSelectedVideo(prev => prev ? ({ ...prev, duration: data.duration }) : null);
                            setVideoError(null);
                        }}
                        onEnd={() => {
                            if (videoRef.current) {
                                videoRef.current.seek(0);
                            }
                        }}
                        onError={(e) => {
                            console.error('Video load error:', e);
                            setVideoError('Failed to load video');
                            setVideoReady(false);
                        }}
                    />
                ) : selectedVideo ? (
                    <View style={[styles.fullScreenVideo, { alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' }]}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={{ color: '#fff', marginTop: 16, fontSize: 16 }}>Preparing video...</Text>
                        <Text style={{ color: '#888', marginTop: 8, fontSize: 12 }}>This may take a moment</Text>
                    </View>
                ) : null}

                <View style={styles.step1Header}>
                    <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
                        <Icon name="close" size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                        <Text style={styles.nextBtnText}>Next</Text>
                        <Icon name="chevron-forward" size={16} color="#000" />
                    </TouchableOpacity>
                </View>

                <View style={styles.step1Footer}>
                    <TouchableOpacity style={styles.trimBtn} onPress={() => setShowTrimmer(true)}>
                        <Icon name="cut-outline" size={24} color="#fff" />
                        <Text style={styles.trimBtnText}>Trim Video</Text>
                    </TouchableOpacity>
                </View>

                {showTrimmer && selectedVideo && (
                    <VideoTrimmer
                        videoUri={selectedVideo.uri}
                        onTrimComplete={handleTrimComplete}
                        onCancel={() => setShowTrimmer(false)}
                        theme={theme}
                    />
                )}
            </View>
        );
    };

    // Render Step 2: Details
    const renderStep2 = () => (
        <View style={[styles.container, { backgroundColor: theme.background || COLORS.background }]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => {
                    setStep('trim');
                    setIsPlaying(true);
                }}>
                    <Icon name="chevron-back" size={28} color={theme.text || COLORS.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text || COLORS.text }]}>New Reel</Text>
                <TouchableOpacity
                    style={[styles.shareButton, { opacity: loading ? 0.5 : 1 }]}
                    onPress={handleShare}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.shareButtonText}>Post</Text>}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                {selectedVideo && (
                    <View style={styles.detailsVideoPreview}>
                        <Video
                            ref={videoRef}
                            source={{ uri: getCleanUri(selectedVideo.uri) }}
                            style={styles.previewVideo}
                            resizeMode="cover"
                            paused={true}
                            onLoad={(data) => {
                                if (!selectedVideo.duration || thumbnails.length === 0) {
                                    // console.log('Step 2 Video Loaded (Failsafe)', data.duration);
                                    setSelectedVideo(prev => prev ? ({ ...prev, duration: data.duration }) : null);
                                    generateThumbnails(selectedVideo.uri, data.duration);
                                }
                            }}
                        />
                        <View style={styles.coverSelectorContainer}>
                            <Text style={styles.helperText}>Select Cover Frame</Text>
                            <View style={styles.timelineContainer}>
                                <View style={styles.filmstripContainer}>
                                    {thumbnails.map((thumb, index) => (
                                        <View key={`thumb_${index}`} style={styles.filmstripFrameContainer}>
                                            <Image source={{ uri: thumb }} style={styles.filmstripFrame} resizeMode="cover" />
                                        </View>
                                    ))}
                                </View>
                                <Slider
                                    style={styles.sliderOverlay}
                                    minimumValue={0}
                                    maximumValue={selectedVideo.duration || 10}
                                    value={seekTime}
                                    onValueChange={handleSliderChange}
                                    minimumTrackTintColor="transparent"
                                    maximumTrackTintColor="transparent"
                                    thumbTintColor="#fff"
                                />
                            </View>
                        </View>
                    </View>
                )}

                <View style={styles.detailsForm}>
                    <TextInput
                        style={[styles.captionInput, { color: theme.text || COLORS.text }]}
                        placeholder="Write a caption..."
                        placeholderTextColor={COLORS.textPlaceholder}
                        multiline
                        value={caption}
                        onChangeText={setCaption}
                    />
                    <View style={styles.divider} />
                    <Text style={[styles.inputLabel, { color: theme.text || COLORS.text }]}>Tags</Text>
                    <TextInput
                        style={[styles.tagInput, { color: theme.text || COLORS.text, borderColor: theme.border }]}
                        placeholder="#startup #tech"
                        placeholderTextColor={COLORS.textPlaceholder}
                        value={tags}
                        onChangeText={setTags}
                    />
                </View>
            </ScrollView>
        </View>
    );

    if (step === 'trim') return renderStep1();
    return renderStep2();
};

export default CreateReel;
