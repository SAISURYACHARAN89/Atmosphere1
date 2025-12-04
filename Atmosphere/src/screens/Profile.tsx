import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';

const Profile = () => {
    const { theme } = useContext(ThemeContext);
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
            <Text style={[styles.subtitle, { color: theme.placeholder }]}>View and edit your profile information.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
    subtitle: { fontSize: 14, textAlign: 'center' }
});

export default Profile;
