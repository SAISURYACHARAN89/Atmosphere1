import React from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { X as CloseIcon } from 'lucide-react-native';
import { getImageSource } from '../../lib/image';
import VerifiedBadge from '../VerifiedBadge';
import { UserListItemProps } from './types';
import { styles } from './styles';

/**
 * UserListItem - Individual user row in followers/following list
 */
const UserListItem: React.FC<UserListItemProps> = ({
    user,
    listType,
    currentUserId,
    isFollowing,
    isLoading,
    onToggleFollow,
    onRemove,
    onPress,
}) => {
    const isCurrentUser = user._id === currentUserId;

    return (
        <TouchableOpacity
            style={styles.userItem}
            onPress={() => onPress(user._id)}
            activeOpacity={0.7}
        >
            <Image source={getImageSource(user.avatarUrl)} style={styles.avatar} />
            <View style={styles.userInfo}>
                <View style={styles.nameRow}>
                    <Text style={styles.username} numberOfLines={1}>{user.username}</Text>
                    {user.verified && <VerifiedBadge size={14} />}
                </View>
                <Text style={styles.displayName} numberOfLines={1}>
                    {user.displayName || user.username}
                </Text>
            </View>
            {!isCurrentUser && (
                <TouchableOpacity
                    style={[styles.actionButton, isFollowing ? styles.messageButton : styles.followBackButton]}
                    onPress={(e) => {
                        e.stopPropagation();
                        if (!isFollowing) onToggleFollow(user._id);
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.actionButtonText}>
                            {isFollowing ? 'Message' : 'Follow back'}
                        </Text>
                    )}
                </TouchableOpacity>
            )}
            {!isCurrentUser && (
                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={(e) => {
                        e.stopPropagation();
                        onRemove(user._id, listType);
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

export default UserListItem;
