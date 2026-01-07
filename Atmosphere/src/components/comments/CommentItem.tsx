import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Comment } from './types';
import { commentStyles as styles } from './styles';
import { timeAgo, getAvatarLetter, getDisplayName } from './utils';

interface CommentItemProps {
    item: Comment;
    isReply?: boolean;
    parentAuthor?: string;
    parentCommentId?: string;
    meId: string | null;
    deletingId: string | null;
    showDeleteFor: string | null;
    expandedReplies: Set<string>;
    repliesLoading: Set<string>;
    repliesData: { [key: string]: Comment[] };
    onReply: (comment: Comment, parentCommentId?: string) => void;
    onDelete: (comment: Comment) => void;
    onToggleDeleteMenu: (commentId: string | null) => void;
    onToggleReplies: (commentId: string) => void;
    renderComment: (item: Comment, isReply?: boolean, parentAuthor?: string, parentCommentId?: string) => React.ReactNode;
}

/**
 * CommentItem - Renders a single comment with avatar, text, actions, and replies
 */
const CommentItem: React.FC<CommentItemProps> = ({
    item,
    isReply = false,
    parentAuthor,
    parentCommentId,
    meId,
    deletingId,
    showDeleteFor,
    expandedReplies,
    repliesLoading,
    repliesData,
    onReply,
    onDelete,
    onToggleDeleteMenu,
    onToggleReplies,
    renderComment,
}) => {
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
                    onToggleDeleteMenu(String(showDeleteFor) === commentId ? null : commentId);
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
                        <Text style={styles.commentAuthor}>
                            {authorUsername}
                        </Text>
                        <Text style={styles.commentTimestamp}>{timeAgo(item.createdAt)}</Text>
                    </View>
                    <Text style={styles.commentText}>
                        {isReply && displayReplyTag && (
                            <Text style={styles.replyTag}>@{displayReplyTag} </Text>
                        )}
                        {item.text}
                    </Text>
                    <View style={styles.commentActions}>
                        <TouchableOpacity onPress={() => onReply(item, isReply ? parentCommentId : undefined)} style={styles.replyBtn}>
                            <Text style={styles.replyBtnText}>Reply</Text>
                        </TouchableOpacity>
                        {String(deletingId) === commentId && <ActivityIndicator size="small" color="#888" />}
                        {String(showDeleteFor) === commentId && (
                            <TouchableOpacity style={styles.smallDeleteBtn} onPress={() => onDelete(item)}>
                                <Text style={styles.smallDeleteText}>Delete</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </TouchableOpacity>

            {/* View Replies button */}
            {!isReply && hasReplies && !isExpanded && (
                <TouchableOpacity onPress={() => onToggleReplies(commentId)} style={styles.viewRepliesBtn}>
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
                    <TouchableOpacity onPress={() => onToggleReplies(commentId)} style={styles.hideRepliesBtn}>
                        <Text style={styles.viewRepliesText}>── Hide replies</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default CommentItem;
