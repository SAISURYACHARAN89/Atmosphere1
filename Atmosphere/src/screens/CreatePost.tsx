/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    Alert,
} from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import ImagePicker from 'react-native-image-crop-picker';
import { createPost } from '../lib/api';
import { uploadImage } from '../lib/uploadImage';
import { Image as ImageIcon } from 'lucide-react-native';

type Props = {
    onClose: () => void;
    onSuccess?: () => void;
};

const CreatePost = ({ onClose, onSuccess }: Props) => {
    const { theme } = useContext(ThemeContext);
    const [selectedImage, setSelectedImage] = useState<{ uri: string; type?: string } | null>(null);
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string>('');

    const handlePickImage = async () => {
        try {
            const image = await ImagePicker.openPicker({
                mediaType: 'photo',
                cropping: true,
                cropperCircleOverlay: false,
                freeStyleCropEnabled: false,
                width: 1080,
                height: 1080,
                includeBase64: false,
                compressImageQuality: 0.8,
                cropperToolbarTitle: 'Crop Image',
            });

            if (image && image.path) {
                setSelectedImage({
                    uri: image.path,
                    type: image.mime || 'image/jpeg',
                });
            }
        } catch (error: any) {
            if (error.code !== 'E_PICKER_CANCELLED') {
                console.error('Image picker error:', error);
                Alert.alert('Error', 'Failed to pick image');
            }
        }
    };

    const handleShare = async () => {
        if (!description.trim() && !selectedImage) {
            Alert.alert('Error', 'Please add an image or description');
            return;
        }

        setLoading(true);
        try {
            const payload: { content: string; media?: { url: string; type: string }[]; tags?: string[] } = {
                content: description.trim(),
            };

            if (selectedImage) {
                // Upload image to Cloudinary first
                setUploadStatus('Uploading image...');
                const cloudinaryUrl = await uploadImage(selectedImage.uri, selectedImage.type);

                payload.media = [{
                    url: cloudinaryUrl,
                    type: 'image',
                }];
                setUploadStatus('Creating post...');
            }

            if (tags.trim()) {
                payload.tags = tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);
            }

            await createPost(payload);
            Alert.alert('Success', 'Post created successfully!', [
                { text: 'OK', onPress: () => { onSuccess?.(); onClose(); } }
            ]);
        } catch (error: any) {
            console.error('Create post error:', error);
            Alert.alert('Error', error.message || 'Failed to create post');
        } finally {
            setLoading(false);
            setUploadStatus('');
        }
    };

    const canShare = description.trim() || selectedImage;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerButton} onPress={onClose}>
                    <Text style={[styles.headerButtonText, { color: theme.text }]}>‹</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>New Post</Text>
                <TouchableOpacity
                    style={[styles.shareButton, { opacity: canShare ? 1 : 0.5 }]}
                    onPress={handleShare}
                    disabled={!canShare || loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.shareButtonText}>Share</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Upload Status Indicator */}
            {uploadStatus ? (
                <View style={styles.uploadStatus}>
                    <ActivityIndicator size="small" color="#0095f6" />
                    <Text style={[styles.uploadStatusText, { color: theme.text }]}>
                        {uploadStatus}
                    </Text>
                </View>
            ) : null}

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* Image Picker */}
                <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
                    {selectedImage ? (
                        <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
                    ) : (
                        <View style={[styles.imagePlaceholder, { borderColor: theme.border }]}>
                            <ImageIcon size={48} color={theme.placeholder || '#666'} />
                            <Text style={[styles.placeholderText, { color: theme.placeholder, marginTop: 12 }]}>
                                Tap to add photo
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Change Image Button */}
                {selectedImage && (
                    <TouchableOpacity style={styles.changeImageButton} onPress={handlePickImage}>
                        <Text style={{ color: theme.primary }}>Change Photo</Text>
                    </TouchableOpacity>
                )}

                {/* Description Input */}
                <View style={[styles.inputSection, { borderColor: theme.border }]}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>Caption</Text>
                    <TextInput
                        style={[styles.textInput, { color: theme.text, borderColor: theme.border }]}
                        placeholder="Write a caption..."
                        placeholderTextColor={theme.placeholder}
                        multiline
                        numberOfLines={4}
                        value={description}
                        onChangeText={setDescription}
                        textAlignVertical="top"
                    />
                </View>

                {/* Tags Input */}
                <View style={[styles.inputSection, { borderColor: theme.border }]}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>Tags</Text>
                    <TextInput
                        style={[styles.tagInput, { color: theme.text, borderColor: theme.border }]}
                        placeholder="startup, tech, innovation (comma separated)"
                        placeholderTextColor={theme.placeholder}
                        value={tags}
                        onChangeText={setTags}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 64,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#222',
    },
    headerButton: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerButtonText: {
        fontSize: 28,
        fontWeight: '300',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    shareButton: {
        backgroundColor: '#0095f6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        minWidth: 70,
        alignItems: 'center',
    },
    shareButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 100,
    },
    imagePicker: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    selectedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        flex: 1,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111',
    },
    placeholderIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    placeholderText: {
        fontSize: 16,
        fontWeight: '500',
    },
    changeImageButton: {
        alignSelf: 'center',
        marginBottom: 24,
        padding: 8,
    },
    inputSection: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        minHeight: 120,
        backgroundColor: '#0a0a0a',
    },
    tagInput: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        backgroundColor: '#0a0a0a',
    },
    uploadStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: 'rgba(0, 149, 246, 0.1)',
    },
    uploadStatusText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
    },
});

export default CreatePost;
