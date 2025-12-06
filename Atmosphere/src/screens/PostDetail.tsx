import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { ThemeContext } from '../contexts/ThemeContext';
import envConfig from '../../env.json';

const API_BASE = `${envConfig.BACKEND_URL}/api`;


type PostDetailProps = {
  route: { params: { postId: string } };
  navigation?: { goBack?: () => void };
};


const PostDetail: React.FC<PostDetailProps & { onBackPress?: () => void }> = ({ route, navigation, onBackPress }) => {
  const { theme } = useContext(ThemeContext);
  const { postId } = route.params;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const images: string[] = post?.media?.map((m: any) => m.url) || (post?.image ? [post.image] : []);
  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_BASE}/posts/${postId}`);
        setPost(res.data.post || res.data);
        // Optionally, set liked state if user info is available
      } catch {
        setPost(null);
      }
      setLoading(false);
    };
    fetchPost();
  }, [postId]);

  useEffect(() => {
    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/comments/${postId}/comments`);
        setComments(res.data.comments || []);
      } catch {
        setComments([]);
      }
      setCommentsLoading(false);
    };
    fetchComments();
  }, [postId]);

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      if (!liked) {
        const res = await axios.post(`${API_BASE}/posts/${postId}/like`);
        setPost((prev: any) => ({ ...prev, likesCount: res.data.likesCount }));
        setLiked(true);
      } else {
        const res = await axios.delete(`${API_BASE}/posts/${postId}/like`);
        setPost((prev: any) => ({ ...prev, likesCount: res.data.likesCount }));
        setLiked(false);
      }
    } catch {}
    setLikeLoading(false);
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || commentSubmitting) return;
    setCommentSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE}/comments/${postId}/comments`, { text: commentText });
      setComments([res.data.comment, ...comments]);
      setPost((prev: any) => ({ ...prev, commentsCount: (prev.commentsCount || 0) + 1 }));
      setCommentText('');
    } catch {}
    setCommentSubmitting(false);
  };

  const handleShare = async () => {
    if (shareLoading) return;
    setShareLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/posts/${postId}/share`);
      setPost((prev: any) => ({ ...prev, sharesCount: res.data.sharesCount }));
    } catch {}
    setShareLoading(false);
  };

  if (loading) {
    return <ActivityIndicator style={styles.flex1} color={theme.primary} />;
  }
  if (!post) {
    return <View style={styles.center}><Text style={{ color: theme.text }}>Post not found.</Text></View>;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}> 
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (navigation && navigation.goBack) navigation.goBack();
          else if (onBackPress) onBackPress();
        }}
      >
        <Text style={[styles.backText, { color: theme.primary }]}>← Back</Text>
      </TouchableOpacity>

      {/* Author Row */}
      {post.author && (
        <View style={styles.authorRow}>
          <Image source={{ uri: post.author.profileImage || 'https://via.placeholder.com/100x100.png?text=User' }} style={styles.authorAvatar} />
          <View>
            <Text style={[styles.authorName, { color: theme.text }]}>{post.author.displayName || post.author.username}</Text>
            {post.createdAt && (
              <Text style={[styles.timestamp, { color: theme.placeholder }]}>Posted {new Date(post.createdAt).toLocaleString()}</Text>
            )}
          </View>
        </View>
      )}

      {/* Image Slider */}
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, idx) => `img-${idx}`}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={[styles.image, { width: windowWidth }, styles.imageFixedHeight]} resizeMode="cover" />
        )}
        onMomentumScrollEnd={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / windowWidth);
          setActiveImage(index);
        }}
      />
      {/* Image indicators */}
      {images.length > 1 && (
        <View style={styles.dotsRow}>
          {images.map((_, idx) => (
            <View key={idx} style={[styles.dot, activeImage === idx && styles.dotActive]} />
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike} disabled={likeLoading}>
          <MaterialCommunityIcons name={liked ? "heart" : "heart-outline"} size={28} color={liked ? 'red' : theme.text} />
        </TouchableOpacity>
        <Text style={styles.actionCount}>{post.likesCount || 0}</Text>

        <TouchableOpacity style={styles.actionBtn} onPress={() => setShowComments((v) => !v)}>
          <MaterialCommunityIcons name="comment-outline" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.actionCount}>{post.commentsCount || 0}</Text>

        <TouchableOpacity style={styles.actionBtn} onPress={handleShare} disabled={shareLoading}>
          <MaterialCommunityIcons name="share-outline" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.actionCount}>{post.sharesCount || 0}</Text>

        <View style={styles.flex1} />
        <TouchableOpacity style={styles.actionBtn}><MaterialCommunityIcons name="bookmark-outline" size={28} color={theme.text} /></TouchableOpacity>
      </View>

      {/* Content/Caption */}
      {post.content && <Text style={[styles.content, { color: theme.text }]}>{post.content}</Text>}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {post.tags.map((tag: string, idx: number) => (
            <Text key={idx} style={[styles.tag, { color: theme.primary }]}>#{tag} </Text>
          ))}
        </View>
      )}

      {/* Comments Section (toggle) */}
      {showComments && (
        <View style={styles.commentsSection}>
          <Text style={[styles.commentsTitle, { color: theme.text }]}>Comments</Text>
          <View style={styles.commentInputRow}>
            <TextInput
              style={[styles.commentInput, { color: theme.text, borderColor: theme.border }]}
              placeholder="Add a comment..."
              placeholderTextColor={theme.placeholder}
              value={commentText}
              onChangeText={setCommentText}
              editable={!commentSubmitting}
            />
            <TouchableOpacity onPress={handleCommentSubmit} disabled={commentSubmitting || !commentText.trim()}>
              <MaterialCommunityIcons name="send" size={24} color={theme.primary} />
            </TouchableOpacity>
          </View>
          {commentsLoading ? (
            <ActivityIndicator color={theme.primary} />
          ) : (
            comments.length === 0 ? (
              <Text style={[{ color: theme.placeholder }, styles.margin8]}>No comments yet.</Text>
            ) : (
              comments.map((c, idx) => (
                <View key={c._id || idx} style={styles.commentRow}>
                  <Image source={{ uri: c.author?.avatarUrl || 'https://via.placeholder.com/40x40.png?text=U' }} style={styles.commentAvatar} />
                  <View style={styles.flex1}>
                    <Text style={[styles.commentAuthor, { color: theme.text }]}>{c.author?.displayName || c.author?.username || 'User'}</Text>
                    <Text style={[styles.commentText, { color: theme.text }]}>{c.text}</Text>
                    <Text style={[styles.commentTimestamp, { color: theme.placeholder }]}>{new Date(c.createdAt).toLocaleString()}</Text>
                  </View>
                </View>
              ))
            )
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: '100%', height: 400, backgroundColor: '#e0e0e0' },
  content: { fontSize: 16, marginHorizontal: 16, marginBottom: 16 },
  likes: { fontWeight: 'bold', marginHorizontal: 16, marginBottom: 8, fontSize: 15},
  authorRow: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  authorAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10, backgroundColor: '#ccc' },
  authorName: { fontWeight: 'bold', fontSize: 16 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, marginVertical: 8, elevation: 2 },
  actionBtn: { marginRight: 8, alignItems: 'center', justifyContent: 'center' },
  actionCount: { fontSize: 13, fontWeight: '500', marginRight: 12, minWidth: 24, textAlign: 'center', color: '#fff' },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#bbb', marginHorizontal: 3 },
  dotActive: { backgroundColor: '#333' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  backButton: { marginTop: 16, marginLeft: 16, marginBottom: 8, alignSelf: 'flex-start' },
  backText: { fontSize: 16, fontWeight: '500' },
  countsRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16, marginBottom: 8 },
  countText: { fontSize: 14, fontWeight: '500' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 16, marginBottom: 4 },
  tag: { fontSize: 13, fontWeight: '500', marginRight: 8 },
  timestamp: { fontSize: 12, marginHorizontal: 16, marginBottom: 8 },
  commentsSection: { marginTop: 16, marginHorizontal: 16, marginBottom: 32 },
  commentsTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  commentInput: { flex: 1, borderWidth: 1, borderRadius: 20, padding: 8, fontSize: 14, marginRight: 8 },
  commentRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  commentAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8, backgroundColor: '#ccc' },
  commentAuthor: { fontWeight: 'bold', fontSize: 13 },
  commentText: { fontSize: 14 },
  commentTimestamp: { fontSize: 11, color: '#888' },
  flex1: { flex: 1 },
  imageFixedHeight: { height: 400 },
  margin8: { margin: 8 },
});

export default PostDetail;
