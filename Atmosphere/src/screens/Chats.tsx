import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';

const Chats = () => {
    const { theme } = useContext(ThemeContext);
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Chats</Text>
            <Text style={[styles.subtitle, { color: theme.placeholder }]}>Your direct messages with founders and investors.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
    subtitle: { fontSize: 14, textAlign: 'center' }
});

export default Chats;
