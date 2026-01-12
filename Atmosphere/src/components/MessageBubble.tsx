import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ThemeContext } from '../contexts/ThemeContext';
import { getImageSource } from '../lib/image';

interface Message {
    _id: string;
    body: string;
    type?: 'text' | 'image' | 'file' | 'video' | 'audio' | 'share';
    sender: {
        _id: string;
        displayName: string;
        username: string;
        avatarUrl?: string;
    };
    createdAt?: string;
    status?: 'sent' | 'delivered' | 'read';
    replyTo?: {
        _id: string;
        body: string;
        sender?: { displayName: string };
    };
    meta?: {
        sharedContent?: {
            id: string;
            type: 'post' | 'reel' | 'startup';
            title?: string;
            image?: string;
            owner?: string;
        };
        isApplicationMessage?: boolean;
        applicantId?: string;
    };
}

interface MessageBubbleProps {
    message: Message;
    isMe: boolean;
    showSenderName?: boolean;
    onLongPress?: (message: Message) => void;
    onReplyPress?: (message: Message) => void;
    onContentPress?: (content: any) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
    message,
    isMe,
    showSenderName = false,
    onLongPress,
    onReplyPress,
    onContentPress
}) => {
    const { theme } = useContext(ThemeContext);

    const timestamp = message.createdAt
        ? new Date(message.createdAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
        : '';

    const renderStatus = () => {
        if (!isMe) return null;
        switch (message.status) {
            case 'read':
                return <MaterialIcons name="done-all" size={14} color="#4FC3F7" />;
            case 'delivered':
                return <MaterialIcons name="done-all" size={14} color="rgba(255,255,255,0.7)" />;
            case 'sent':
            default:
                return <MaterialIcons name="done" size={14} color="rgba(255,255,255,0.6)" />;
        }
    };

    const renderSharedContent = () => {
        if (message.type !== 'share' || !message.meta?.sharedContent) return null;
        const content = message.meta.sharedContent;
        const isStartup = content.type === 'startup';
        const isReel = content.type === 'reel';

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.sharedCard, { backgroundColor: theme.background || '#222' }]}
                onPress={() => onContentPress?.(content)}
            >
                <View style={styles.sharedHeader}>
                    <Image
                        source={getImageSource(isStartup ? (content.image || '') : (content.owner || ''))}
                        style={styles.sharedAvatar}
                    />
                    <Text style={[styles.sharedOwner, { color: theme.text }]} numberOfLines={1}>
                        {content.title || (isReel ? 'Reel' : 'Post')}
                    </Text>
                    <MaterialIcons name="chevron-right" size={20} color={theme.placeholder} />
                </View>
                {content.image ? (
                    <Image
                        source={getImageSource(content.image)}
                        style={[styles.sharedImage, isReel ? { aspectRatio: 9 / 16 } : { aspectRatio: 16 / 9 }]}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.sharedImage, { backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' }]}>
                        <MaterialIcons name={isReel ? "videocam" : isStartup ? "business" : "article"} size={32} color="#666" />
                    </View>
                )}
                <View style={[styles.sharedFooter, { borderTopColor: theme.border }]}>
                    <Text style={[styles.sharedType, { color: theme.primary }]}>
                        {isReel ? 'Watch Reel' : isStartup ? 'View Startup' : 'View Post'}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderApplicationMessage = () => {
        const body = message.body || (message as any).content || '';
        const lines = body.split('\n');
        const title = lines[0] || 'Job Application';
        const qaLines: { question: string; answer: string }[] = [];
        let i = 1;

        while (i < lines.length) {
            const line = lines[i];
            if (line && (line.includes('**Q') || line.match(/^Q\d+:/))) {
                const question = line.replace(/\*\*/g, '').trim();
                let answer = '';
                i++;
                while (i < lines.length) {
                    const nextLine = lines[i];
                    if (!nextLine || nextLine.includes('**Q') || nextLine.match(/^Q\d+:/) || nextLine.includes('📄 Resume')) {
                        break;
                    }
                    answer += (answer ? '\n' : '') + nextLine;
                    i++;
                }
                if (question && answer.trim()) {
                    qaLines.push({ question, answer: answer.trim() });
                }
            } else {
                i++;
            }
        }

        const resumeMatch = body.match(/📄 Resume:\s*(https?:\/\/[^\s]+)/);
        const resumeUrl = resumeMatch ? resumeMatch[1] : null;
        const bodyWithoutTitle = lines.slice(1).join('\n').trim();
        const showRawContent = qaLines.length === 0 && bodyWithoutTitle && !resumeUrl;

        return (
            <View style={styles.applicationCard}>
                <View style={styles.applicationHeader}>
                    <MaterialIcons name="description" size={20} color="#22c55e" />
                    <Text style={styles.applicationTitle}>{title.replace(/📋|\*\*/g, '').trim()}</Text>
                </View>
                {qaLines.length > 0 && qaLines.map((qa, index) => (
                    <View key={index} style={styles.qaItem}>
                        <Text style={styles.questionText}>{qa.question}</Text>
                        <Text style={styles.answerText}>{qa.answer}</Text>
                    </View>
                ))}
                {showRawContent && (
                    <Text style={styles.answerText}>{bodyWithoutTitle}</Text>
                )}
                {qaLines.length === 0 && !showRawContent && !resumeUrl && (
                    <Text style={[styles.answerText, { fontStyle: 'italic', color: '#888' }]}>
                        No application details provided
                    </Text>
                )}
                {resumeUrl && (
                    <TouchableOpacity
                        style={styles.resumeLink}
                        onPress={() => Linking.openURL(resumeUrl)}
                    >
                        <MaterialIcons name="picture-as-pdf" size={20} color="#ef4444" />
                        <Text style={styles.resumeLinkText}>View Resume (PDF)</Text>
                        <MaterialIcons name="open-in-new" size={16} color="#888" />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onLongPress={() => onLongPress?.(message)}
            style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowThem]}
        >
            {!isMe && (
                <Image
                    source={getImageSource(message.sender.avatarUrl || 'https://via.placeholder.com/32')}
                    style={styles.senderAvatar}
                />
            )}
            <View style={[
                styles.messageBubble,
                isMe
                    ? [styles.myMessage, { backgroundColor: theme.primary }]
                    : [styles.theirMessage, { backgroundColor: theme.cardBackground || '#3B3B3B' }],
                message.type === 'share' && styles.sharedBubble
            ]}>
                {message.replyTo && (
                    <TouchableOpacity
                        style={[styles.replyPreview, { borderLeftColor: isMe ? 'rgba(255,255,255,0.5)' : theme.primary }]}
                        onPress={() => onReplyPress?.(message)}
                    >
                        <Text style={styles.replyName} numberOfLines={1}>
                            {message.replyTo.sender?.displayName || 'User'}
                        </Text>
                        <Text style={styles.replyText} numberOfLines={1}>
                            {message.replyTo.body}
                        </Text>
                    </TouchableOpacity>
                )}
                {showSenderName && !isMe && (
                    <Text style={[styles.senderName, { color: theme.primary }]}>
                        {message.sender.displayName || message.sender.username}
                    </Text>
                )}
                <View style={styles.messageContent}>
                    {message.type === 'share' ? (
                        renderSharedContent()
                    ) : message.meta?.isApplicationMessage || message.body?.startsWith('📋 New Application') ? (
                        renderApplicationMessage()
                    ) : (
                        <Text style={styles.messageText}>{message.body}</Text>
                    )}
                    <View style={[styles.metaRow, message.type === 'share' && { marginTop: 4 }]}>
                        <Text style={styles.timestamp}>{timestamp}</Text>
                        {renderStatus()}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    messageRow: {
        flexDirection: 'row',
        marginVertical: 4,
        alignItems: 'flex-end',
        gap: 8,
        paddingHorizontal: 8
    },
    messageRowMe: { justifyContent: 'flex-end' },
    messageRowThem: { justifyContent: 'flex-start' },
    senderAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#444'
    },
    messageBubble: {
        maxWidth: '75%',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        elevation: 1,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2
    },
    sharedBubble: {
        paddingHorizontal: 4,
        paddingTop: 4,
        maxWidth: '80%',
        backgroundColor: 'transparent'
    },
    myMessage: { borderBottomRightRadius: 6 },
    theirMessage: { borderBottomLeftRadius: 6 },
    replyPreview: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderLeftWidth: 3,
        borderRadius: 4,
        paddingLeft: 10,
        paddingVertical: 6,
        marginBottom: 8
    },
    replyName: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
        fontWeight: '600'
    },
    replyText: {
        color: 'rgba(255,255,255,0.65)',
        fontSize: 13
    },
    senderName: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 4
    },
    messageContent: {
        flexDirection: 'column',
        gap: 4
    },
    messageText: {
        color: '#fff',
        fontSize: 15,
        lineHeight: 21
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 4,
        marginTop: 2
    },
    timestamp: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.55)'
    },
    sharedCard: {
        borderRadius: 16,
        overflow: 'hidden',
        minWidth: 200,
    },
    sharedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        gap: 8
    },
    sharedAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#444'
    },
    sharedOwner: {
        fontSize: 13,
        fontWeight: '600',
        flex: 1
    },
    sharedImage: {
        width: '100%',
        height: undefined,
        backgroundColor: '#000'
    },
    sharedFooter: {
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center'
    },
    sharedType: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    applicationCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 12,
        minWidth: 220,
        maxWidth: 280,
    },
    applicationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    applicationTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    qaItem: { marginBottom: 10 },
    questionText: {
        color: '#888',
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 4,
    },
    answerText: {
        color: '#fff',
        fontSize: 13,
        lineHeight: 18,
    },
    resumeLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    resumeLinkText: {
        color: '#4FC3F7',
        fontSize: 13,
        fontWeight: '500',
        flex: 1,
    },
});

export default MessageBubble;
