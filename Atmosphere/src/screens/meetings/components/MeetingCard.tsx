import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Meeting, MeetingCardProps } from '../types';
import { formatAMPM } from '../utils';
import { cardStyles as styles } from '../Meetings.styles';

/**
 * MeetingCard component - displays a single meeting with host info, time, and actions
 */
const MeetingCard = ({ meeting, onJoin, joinLabel = 'Join', isExpanded, onToggleExpand }: MeetingCardProps) => {
    const hostName = meeting.host?.displayName || meeting.hostName || meeting.organizer?.displayName || 'Unknown';
    const hostAvatar = meeting.host?.avatarUrl || meeting.hostAvatar || meeting.organizer?.avatarUrl;
    const isVerified = meeting.host?.verified || meeting.isVerified || meeting.organizer?.verified;
    const participantCount = typeof meeting.participants === 'number'
        ? meeting.participants
        : (Array.isArray(meeting.participantsDetail) ? meeting.participantsDetail.length : 0);

    const getClockLabel = () => {
        if (!meeting.startTime && !meeting.scheduledAt) return 'Starts soon';
        const now = new Date();
        const start = meeting.scheduledAt ? new Date(meeting.scheduledAt) : new Date(meeting.startTime!);
        const end = meeting.endTime ? new Date(meeting.endTime) : new Date(start.getTime() + 45 * 60000);
        if (now >= start && now <= end) return 'Ongoing';
        return `Starts at ${formatAMPM(start)}`;
    };

    const category = meeting.category || (meeting.industries?.[0] ? 'Pitch' : 'Networking');

    return (
        <View style={styles.card}>
            {/* ROW 1: Avatar + Title/Host + Join Button */}
            <View style={styles.cardRow1}>
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    {hostAvatar ? (
                        <Image source={{ uri: hostAvatar }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                            <Text style={styles.avatarText}>{hostName.charAt(0).toUpperCase()}</Text>
                        </View>
                    )}
                </View>

                {/* Title + Host */}
                <View style={styles.cardMiddle}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{meeting.title || 'Untitled Meeting'}</Text>
                    <View style={styles.hostRow}>
                        <Text style={styles.hostText}>by {hostName}</Text>
                        {isVerified && (
                            <MaterialIcons name="verified" size={14} color="#666" style={{ marginLeft: 4 }} />
                        )}
                    </View>
                </View>

                {/* Join Button */}
                <TouchableOpacity style={styles.joinBtn} onPress={onJoin}>
                    <Text style={styles.joinBtnText}>{joinLabel}</Text>
                </TouchableOpacity>
            </View>

            {/* ROW 2: Eligible + Time + Participants + Category */}
            <View style={styles.cardRow2}>
                {/* Left group: Eligible + Time + Participants */}
                <View style={styles.leftGroup}>
                    {meeting.eligible !== false && (
                        <View style={styles.eligibleBadge}>
                            <Text style={styles.eligibleText}>Eligible</Text>
                        </View>
                    )}
                    <View style={styles.timeGroup}>
                        <MaterialIcons name="access-time" size={12} color="#666" />
                        <Text style={styles.metaText}>{getClockLabel()}</Text>
                    </View>
                    <View style={styles.participantsGroup}>
                        <MaterialIcons name="people-outline" size={12} color="#666" />
                        <Text style={styles.metaText}>{participantCount}</Text>
                    </View>
                </View>

                {/* Right: Category badge */}
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{category === 'pitch' ? 'Pitch' : 'Networking'}</Text>
                </View>
            </View>

            {/* ROW 3: Expand Arrow */}
            {meeting.description && (
                <TouchableOpacity style={styles.expandRow} onPress={onToggleExpand}>
                    <MaterialIcons
                        name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                        size={20}
                        color="#666"
                    />
                </TouchableOpacity>
            )}

            {/* Expanded Description */}
            {isExpanded && meeting.description && (
                <View style={styles.expandedContent}>
                    {meeting.industries && meeting.industries.length > 0 && (
                        <View style={styles.industryTags}>
                            {meeting.industries.slice(0, 2).map((tag: string, idx: number) => (
                                <View key={idx} style={styles.industryTag}>
                                    <Text style={styles.industryTagText}>{tag}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    <Text style={styles.descriptionText}>{meeting.description}</Text>
                </View>
            )}
        </View>
    );
};

export default MeetingCard;
