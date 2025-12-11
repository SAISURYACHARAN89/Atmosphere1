import React, { useContext } from 'react';
import { View, Text, Modal, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import { getImageSource } from '../lib/image';

interface GroupInfoModalProps {
    visible: boolean;
    onClose: () => void;
    chat: any;
}

const GroupInfoModal: React.FC<GroupInfoModalProps> = ({ visible, onClose, chat }) => {
    const { theme } = useContext(ThemeContext);

    if (!chat) return null;

    const renderParticipant = ({ item }: { item: any }) => (
        <View style={[styles.participantItem, { borderBottomColor: theme.border }]}>
            <Image
                source={getImageSource(item.avatarUrl || 'https://via.placeholder.com/50')}
                style={styles.avatar}
            />
            <View style={styles.info}>
                <Text style={[styles.name, { color: theme.text }]}>{item.displayName || item.username}</Text>
                <Text style={[styles.handle, { color: theme.placeholder }]}>@{item.username}</Text>
            </View>
            {chat.groupAdmin === item._id && (
                <View style={[styles.adminBadge, { backgroundColor: theme.primary }]}>
                    <Text style={styles.adminText}>Admin</Text>
                </View>
            )}
        </View>
    );

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.text }]}>Group Info</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={{ color: theme.primary, fontSize: 16 }}>Close</Text>
                    </TouchableOpacity>
                </View>

                {/* Group Details */}
                <View style={styles.groupHeader}>
                    <Image
                        source={getImageSource(chat.groupImage || chat.groupName || 'https://via.placeholder.com/100')}
                        style={styles.groupImage}
                    />
                    <Text style={[styles.groupName, { color: theme.text }]}>{chat.groupName}</Text>
                    {chat.groupDescription && <Text style={[styles.desc, { color: theme.placeholder }]}>{chat.groupDescription}</Text>}
                </View>

                {/* Participants */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Participants ({chat.participants?.length || 0})
                </Text>

                <FlatList
                    data={chat.participants || []}
                    renderItem={renderParticipant}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.list}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingTop: 24,
    },
    title: { fontSize: 18, fontWeight: '700' },
    groupHeader: {
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    groupImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
        backgroundColor: '#e1e1e1'
    },
    groupName: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
    desc: { fontSize: 14, textAlign: 'center' },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 16,
        marginTop: 24,
        marginBottom: 8
    },
    list: { paddingBottom: 40 },
    participantItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor: '#eee' },
    info: { flex: 1 },
    name: { fontSize: 15, fontWeight: '600' },
    handle: { fontSize: 13 },
    adminBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8
    },
    adminText: { color: '#fff', fontSize: 10, fontWeight: '700' }
});

export default GroupInfoModal;
