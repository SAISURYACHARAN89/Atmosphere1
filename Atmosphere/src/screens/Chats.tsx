/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchChats } from '../lib/api';
import ChatList from '../components/ChatList';
import GroupList from '../components/GroupList';
import CreateGroupModal from '../components/CreateGroupModal';

interface ChatsProps {
    onChatSelect?: (chatId: string) => void;
}

const Chats = ({ onChatSelect }: ChatsProps) => {
    const { theme } = useContext(ThemeContext);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'chats' | 'groups'>('chats');

    const [chats, setChats] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateGroupVisible, setCreateGroupVisible] = useState(false);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const userJson = await AsyncStorage.getItem('user');
                if (userJson) {
                    const user = JSON.parse(userJson);
                    setCurrentUserId(user._id || user.id);
                }
            } catch (err) {
                console.error('Error fetching current user:', err);
            }
        };
        fetchCurrentUser();
    }, []);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            if (activeTab === 'chats') {
                const data = await fetchChats('private');
                setChats(data);
            } else {
                const data = await fetchChats('group');
                setGroups(data);
            }
        } catch (err) {
            console.error('Error loading chats:', err);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleChatPress = (chatId: string) => {
        onChatSelect?.(chatId);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header / Tabs */}
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <Text style={[styles.pageTitle, { color: theme.text }]}>Messages</Text>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'chats' && { borderBottomColor: theme.primary, borderBottomWidth: 2 }]}
                        onPress={() => setActiveTab('chats')}
                    >
                        <Text style={[styles.tabText, { color: activeTab === 'chats' ? theme.primary : theme.placeholder }]}>Chats</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'groups' && { borderBottomColor: theme.primary, borderBottomWidth: 2 }]}
                        onPress={() => setActiveTab('groups')}
                    >
                        <Text style={[styles.tabText, { color: activeTab === 'groups' ? theme.primary : theme.placeholder }]}>Groups</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {loading ? (
                    <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
                ) : (
                    activeTab === 'chats' ? (
                        <ChatList
                            chats={chats}
                            currentUserId={currentUserId}
                            onChatPress={handleChatPress}
                        />
                    ) : (
                        <GroupList
                            groups={groups}
                            currentUserId={currentUserId}
                            onChatPress={handleChatPress}
                            onCreateGroupPress={() => setCreateGroupVisible(true)}
                        />
                    )
                )}
            </View>

            <CreateGroupModal
                visible={isCreateGroupVisible}
                onClose={() => setCreateGroupVisible(false)}
                onGroupCreated={() => {
                    setCreateGroupVisible(false);
                    loadData(); // Refresh list
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: 12,
        backgroundColor: 'transparent', // Web uses fixed header, here we just put it top
        borderBottomWidth: 1,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 16,
        paddingHorizontal: 16
    },
    tabContainer: {
        flexDirection: 'row',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600'
    },
    content: {
        flex: 1
    }
});

export default Chats;
