import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import Search from './Search';
import Notifications from './Notifications';
import Chats from './Chats';
import Reels from './Reels';
import Profile from './Profile';

type RouteKey = 'home' | 'search' | 'notifications' | 'chats' | 'reels' | 'profile';

const navItems: { key: RouteKey; label: string; glyph: string }[] = [
    { key: 'home', label: 'Home', glyph: '⌂' },
    { key: 'search', label: 'Search', glyph: '🔍' },
    { key: 'notifications', label: 'Notifications', glyph: '❤' },
    { key: 'chats', label: 'Chats', glyph: '💬' },
    { key: 'reels', label: 'Reels', glyph: '🎞' },
    { key: 'profile', label: 'Profile', glyph: '●' },
];

const LandingPage = ({ onLogout }: { onLogout?: () => void }) => {
    const [route, setRoute] = useState<RouteKey>('home');
    const { theme } = useContext(ThemeContext);

    const dynamicStyles = React.useMemo(() => ({
        navItemActive: { backgroundColor: theme.primary },
        glyphColor: { color: theme.placeholder },
        glyphActiveColor: { color: '#fff' },
    }), [theme]);

    const renderContent = () => {
        switch (route) {
            case 'home':
                return <Text style={[styles.text, { color: theme.text }]}>Welcome to Atmosphere!</Text>;
            case 'search':
                return <Search />;
            case 'notifications':
                return <Notifications />;
            case 'chats':
                return <Chats />;
            case 'reels':
                return <Reels />;
            case 'profile':
                return <Profile />;
            default:
                return null;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Atmosphere</Text>
            </View>

            {renderContent()}

            <View style={[styles.sideNav, styles.sideNavOverlay]}>
                {navItems.map((item) => {
                    const active = route === item.key;
                    return (
                        <TouchableOpacity
                            key={item.key}
                            onPress={() => setRoute(item.key)}
                            style={[styles.navItem, active ? dynamicStyles.navItemActive : null]}
                        >
                            <Text style={[styles.glyph, active ? dynamicStyles.glyphActiveColor : dynamicStyles.glyphColor]}>{item.glyph}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    sideNav: { position: 'absolute', right: 12, bottom: 24, alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6, backgroundColor: 'transparent', flexDirection: 'row' },
    navItem: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginHorizontal: 8 },
    navItemActive: { backgroundColor: '#1f1f1f' },
    glyph: { fontSize: 18 },
    sideNavOverlay: { backgroundColor: 'transparent' },
    content: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
    header: { height: 64, paddingHorizontal: 16, paddingTop: 12, justifyContent: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#00000010' },
    headerTitle: { fontSize: 20, fontWeight: '700' },
    text: { fontSize: 16 },
});

export default LandingPage;