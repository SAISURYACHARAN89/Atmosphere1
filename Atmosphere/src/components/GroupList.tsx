import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import ChatList from './ChatList';
// You might need an icon for the FAB
// import Icon from 'react-native-vector-icons/MaterialIcons'; 

interface GroupListProps {
    groups: any[];
    currentUserId: string | null;
    onChatPress: (chatId: string) => void;
    onCreateGroupPress: () => void;
}

const GroupList: React.FC<GroupListProps> = ({ groups, currentUserId, onChatPress, onCreateGroupPress }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <View style={{ flex: 1 }}>
            <ChatList
                chats={groups}
                currentUserId={currentUserId}
                onChatPress={onChatPress}
                emptyMessage="No groups found."
            />

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: theme.primary }]}
                onPress={onCreateGroupPress}
            >
                {/* Placeholder for + icon if no icon lib available yet */}
                <View style={styles.plusH} />
                <View style={styles.plusV} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    plusH: {
        position: 'absolute',
        width: 24,
        height: 4,
        backgroundColor: '#fff',
        borderRadius: 2
    },
    plusV: {
        position: 'absolute',
        width: 4,
        height: 24,
        backgroundColor: '#fff',
        borderRadius: 2
    }
});

export default GroupList;
