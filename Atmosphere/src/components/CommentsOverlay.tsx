import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Animated, Easing, Dimensions } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import { getStartupComments, addStartupComment, deleteComment, deleteStartupComment, getComments, addComment, getProfile, getStartupCommentReplies, getCommentReplies } from '../lib/api';
import Icon from 'react-native-vector-icons/Feather';

// Import shared components and utilities
import { Comment, ReplyingTo, commentStyles as styles, SHEET_HEIGHT, timeAgo, getAvatarLetter, getDisplayName } from './comments';
import CommentInput from './comments/CommentInput';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CommentsOverlayProps {
    startupId: string;
    visible: boolean;
    onClose: () => void;
    onCommentAdded?: (newCount?: number) => void;
    onCommentDeleted?: (newCount?: number) => void;
    type?: 'startup' | 'post';
}

const CommentsOverlay = ({ startupId, visible, onClose, onCommentAdded, onCommentDeleted, type = 'startup' }: CommentsOverlayProps) => {
    const { theme } = useContext(ThemeContext);
    const anim = useRef(new Animated.Value(0)).current;
    const inputRef = useRef<TextInput>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [text, setText] = useState('');
    const [meId, setMeId] = useState<string | null>(null);
    const [showDeleteFor, setShowDeleteFor] = useState<string | null>(null);
    const [replyingTo, setReplyingTo] = useState<ReplyingTo | null>(null);
    const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
    const [repliesLoading, setRepliesLoading] = useState<Set<string>>(new Set());
    const [repliesData, setRepliesData] = useState<{ [key: string]: Comment[] }>({});

    useEffect(() => {
        let mounted = true;
        const fetch = async () => {
            if (!visible) return;
            setLoading(true);
            try {
                let data = [];
                if (type === 'post') {
                    data = await getComments(String(startupId));
                } else {
                    data = await getStartupComments(String(startupId));
                }
                if (mounted) setComments(data || []);
                try {
                    const profile = await getProfile();
                    const id = profile?.user?._id || profile?.user?.id || profile?.id || null;
                    if (mounted && id) setMeId(String(id));
                } catch {
                    // ignore errors while fetching profile
                }
            } catch (err) {
                console.warn('CommentsOverlay: failed to load comments', err);
                if (mounted) setComments([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetch();
        return () => { mounted = false; };
    }, [visible, startupId, type]);

    // Animate in/out when `visible` changes
    useEffect(() => {
        if (visible) {
            Animated.timing(anim, { toValue: 1, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
        } else {
            Animated.timing(anim, { toValue: 0, duration: 240, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start();
        }
    }, [visible, anim]);

    const loadReplies = async (commentId: string) => {
        if (repliesLoading.has(commentId)) return;
        setRepliesLoading(prev => new Set(prev).add(commentId));
        try {
            let replies = [];
            if (type === 'post') {
                replies = await getCommentReplies(commentId);
            } else {
                replies = await getStartupCommentReplies(commentId);
            }
            setRepliesData(prev => ({ ...prev, [commentId]: replies }));
            setExpandedReplies(prev => new Set(prev).add(commentId));
        } catch (err) {
            console.warn('Failed to load replies:', err);
        } finally {
            setRepliesLoading(prev => {
                const next = new Set(prev);
                next.delete(commentId);
                return next;
            });
        }
    };

    const toggleReplies = (commentId: string) => {
        if (expandedReplies.has(commentId)) {
            setExpandedReplies(prev => {
                const next = new Set(prev);
                next.delete(commentId);
                return next;
            });
        } else {
            loadReplies(commentId);
        }
    };

    const handleReply = (comment: Comment, parentCommentId?: string) => {
        const username = getDisplayName(comment.author);
        const topLevelParentId = parentCommentId || String(comment._id || comment.id);
        setReplyingTo({
            id: String(comment._id || comment.id),
            username,
            parentCommentId: topLevelParentId,
        });
        inputRef.current?.focus();
    };

    const cancelReply = () => {
        setReplyingTo(null);
    };

    const submit = async () => {
        if (!text.trim() || submitting) return;
        setSubmitting(true);
        try {
            let newComment;
            const parentId = replyingTo?.parentCommentId || undefined;
            if (type === 'post') {
                newComment = await addComment(String(startupId), text.trim(), parentId);
            } else {
                newComment = await addStartupComment(String(startupId), text.trim(), parentId);
            }

            const commentObj = newComment?.comment || newComment || { text: text.trim(), createdAt: new Date().toISOString() };
            if (replyingTo?.username) {
                commentObj.replyToUsername = replyingTo.username;
            }

            if (parentId) {
                setRepliesData(prev => ({
                    ...prev,
                    [parentId]: [...(prev[parentId] || []), commentObj]
                }));
                setExpandedReplies(prev => new Set(prev).add(parentId));
            } else {
                setComments(prev => [commentObj, ...prev]);
            }

            setText('');
            setReplyingTo(null);

            const newCount = (newComment && (newComment.commentsCount ?? newComment.count ?? newComment.totalComments)) || undefined;
            if (typeof onCommentAdded === 'function') {
                try { onCommentAdded(typeof newCount === 'number' ? newCount : undefined); } catch { onCommentAdded(); }
            }
        } catch {
            console.warn('CommentsOverlay: failed to submit comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (item: Comment) => {
        try {
            setDeletingId(item._id || item.id || item.createdAt);
            let resp: any = null;
            try {
                if (type === 'post') {
                    resp = await deleteComment(String(item._id || item.id));
                } else {
                    resp = await deleteStartupComment(String(item._id || item.id));
                }
            } catch {
                try {
                    resp = await deleteComment(String(item._id || item.id));
                } catch {
                    throw new Error('delete failed');
                }
            }
            setComments(prev => prev.filter(c => String(c._id || c.id || c.createdAt) !== String(item._id || item.id || item.createdAt)));
            setShowDeleteFor(null);
            const newCount = resp?.commentsCount ?? resp?.comments ?? resp?.count ?? undefined;
            if (typeof onCommentDeleted === 'function') {
                try { onCommentDeleted(typeof newCount === 'number' ? newCount : undefined); } catch { try { onCommentDeleted(); } catch { } }
            }
        } catch (err) {
            console.warn('CommentsOverlay: failed to delete comment', err);
        } finally {
            setDeletingId(null);
        }
    };

    const closeModal = () => {
        Animated.timing(anim, { toValue: 0, duration: 240, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(() => onClose && onClose());
    };

    const renderComment = (item: Comment, isReply = false, parentAuthor?: string, parentCommentId?: string) => {
        const commentId = String(item._id || item.id || item.createdAt);
        const authorId = item.author?._id || item.author?.id || item.author;
        const isOwner = authorId && meId && String(authorId) === String(meId);
        const replies = repliesData[commentId] || [];
        const hasReplies = replies.length > 0 || (item.repliesCount && item.repliesCount > 0);
        const isExpanded = expandedReplies.has(commentId);
        const isLoadingReplies = repliesLoading.has(commentId);
        const authorUsername = getDisplayName(item.author);
        const displayReplyTag = item.replyToUsername || parentAuthor;

        return (
            <View key={commentId}>
                <TouchableOpacity
                    onLongPress={() => {
                        if (!isOwner) return;
                        setShowDeleteFor(prev => (String(prev) === commentId ? null : commentId));
                    }}
                    activeOpacity={0.8}
                    style={[styles.commentRow, isReply && styles.replyRow]}
                >
                    <View style={styles.commentAvatar}>
                        <Text style={styles.avatarLetter}>
                            {getAvatarLetter(item.author)}
                        </Text>
                    </View>
                    <View style={styles.commentBody}>
                        <View style={styles.commentHeaderRow}>
                            <Text style={styles.commentAuthor}>{authorUsername}</Text>
                            <Text style={styles.commentTimestamp}>{timeAgo(item.createdAt)}</Text>
                        </View>
                        <Text style={styles.commentText}>
                            {isReply && displayReplyTag && (
                                <Text style={styles.replyTag}>@{displayReplyTag} </Text>
                            )}
                            {item.text}
                        </Text>
                        <View style={styles.commentActions}>
                            <TouchableOpacity onPress={() => handleReply(item, isReply ? parentCommentId : undefined)} style={styles.replyBtn}>
                                <Text style={styles.replyBtnText}>Reply</Text>
                            </TouchableOpacity>
                            {String(deletingId) === commentId && <ActivityIndicator size="small" color="#888" />}
                            {String(showDeleteFor) === commentId && (
                                <TouchableOpacity style={styles.smallDeleteBtn} onPress={() => handleDelete(item)}>
                                    <Text style={styles.smallDeleteText}>Delete</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </TouchableOpacity>

                {/* View Replies button */}
                {!isReply && hasReplies && !isExpanded && (
                    <TouchableOpacity onPress={() => toggleReplies(commentId)} style={styles.viewRepliesBtn}>
                        {isLoadingReplies ? (
                            <ActivityIndicator size="small" color="#888" />
                        ) : (
                            <Text style={styles.viewRepliesText}>
                                ── View {item.repliesCount || replies.length || ''} replies
                            </Text>
                        )}
                    </TouchableOpacity>
                )}

                {/* Render replies */}
                {!isReply && isExpanded && replies.length > 0 && (
                    <View style={styles.repliesContainer}>
                        {replies.map((reply: Comment) => renderComment(reply, true, authorUsername, commentId))}
                        <TouchableOpacity onPress={() => toggleReplies(commentId)} style={styles.hideRepliesBtn}>
                            <Text style={styles.viewRepliesText}>── Hide replies</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    return (
        <Modal visible={visible} transparent onRequestClose={closeModal}>
            <TouchableWithoutFeedback onPress={closeModal}>
                <Animated.View style={[styles.backdrop, { opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.6] }) }]} />
            </TouchableWithoutFeedback>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
                <Animated.View
                    style={[
                        styles.sheet,
                        { width: Math.min(640, SCREEN_WIDTH), height: SHEET_HEIGHT },
                        { transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [SHEET_HEIGHT, 0] }) }] },
                        { opacity: anim }
                    ]}
                >
                    <View style={styles.handleRow}>
                        <View style={styles.handle} />
                        <TouchableOpacity onPress={closeModal} style={styles.closeBtn}>
                            <Icon name="x" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.title}>Comments</Text>

                    <View style={styles.contentWrap}>
                        {loading ? (
                            <ActivityIndicator size="large" color="#666" />
                        ) : (
                            <>
                                {comments.length === 0 ? (
                                    <View style={styles.emptyWrap}>
                                        <Text style={styles.emptyText}>No comments yet. Be the first to comment!</Text>
                                    </View>
                                ) : (
                                    <FlatList
                                        data={comments}
                                        keyExtractor={(i) => String(i._id || i.id || i.createdAt || Math.random())}
                                        renderItem={({ item }) => renderComment(item)}
                                        showsVerticalScrollIndicator={false}
                                    />
                                )}
                            </>
                        )}
                    </View>

                    <CommentInput
                        ref={inputRef}
                        text={text}
                        setText={setText}
                        submitting={submitting}
                        replyingTo={replyingTo}
                        onSubmit={submit}
                        onCancelReply={cancelReply}
                    />
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default CommentsOverlay;
