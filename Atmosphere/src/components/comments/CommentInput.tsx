import React, { forwardRef } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { Send } from 'lucide-react-native';
import Icon from 'react-native-vector-icons/Feather';
import { ReplyingTo } from './types';
import { commentStyles as styles } from './styles';

interface CommentInputProps {
    text: string;
    setText: (text: string) => void;
    submitting: boolean;
    replyingTo: ReplyingTo | null;
    onSubmit: () => void;
    onCancelReply: () => void;
}

/**
 * CommentInput - Shared input component for adding comments/replies
 */
const CommentInput = forwardRef<TextInput, CommentInputProps>(({
    text,
    setText,
    submitting,
    replyingTo,
    onSubmit,
    onCancelReply,
}, ref) => {
    return (
        <>
            {/* Reply indicator */}
            {replyingTo && (
                <View style={styles.replyIndicator}>
                    <Text style={styles.replyIndicatorText}>
                        Replying to <Text style={styles.replyIndicatorUsername}>@{replyingTo.username}</Text>
                    </Text>
                    <TouchableOpacity onPress={onCancelReply}>
                        <Icon name="x" size={16} color="#888" />
                    </TouchableOpacity>
                </View>
            )}

            {/* Input area */}
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        ref={ref}
                        value={text}
                        onChangeText={setText}
                        placeholder={replyingTo ? `Reply to @${replyingTo.username}...` : "Add a comment..."}
                        placeholderTextColor="#666"
                        style={styles.input}
                        editable={!submitting}
                        multiline
                    />
                    <TouchableOpacity
                        onPress={onSubmit}
                        disabled={submitting || !text.trim()}
                        style={styles.sendBtn}
                    >
                        {submitting ? (
                            <ActivityIndicator size="small" color="#666" />
                        ) : (
                            <Send size={20} color={text.trim() ? '#888' : '#444'} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
});

CommentInput.displayName = 'CommentInput';

export default CommentInput;
