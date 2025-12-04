import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import Search from './Search';
import Notifications from './Notifications';
import Chats from './Chats';
import Reels from './Reels';
import Profile from './Profile';
import Home from './Home';
import BottomNav from '../components/BottomNav';

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
                return <Home />;
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

    const mapBottomToRoute = (routeName: string): RouteKey => {
        const map: { [k: string]: RouteKey } = {
            Home: 'home',
            Search: 'search',
            Reels: 'reels',
            Profile: 'profile',
            Notifications: 'notifications',
            Messages: 'chats',
        };
        return map[routeName] || 'home';
    };

    const mapRouteToBottom = (r: RouteKey): string => {
        const rev: { [k in RouteKey]: string } = {
            home: 'Home',
            search: 'Search',
            notifications: 'Notifications',
            chats: 'Messages',
            reels: 'Reels',
            profile: 'Profile',
        };
        return rev[r] || 'Home';
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Atmosphere</Text>
            </View>

            {renderContent()}

            <BottomNav activeRoute={mapRouteToBottom(route)} onRouteChange={(r) => setRoute(mapBottomToRoute(r))} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingBottom: 84 },
    content: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
    header: { height: 64, paddingHorizontal: 16, paddingTop: 12, justifyContent: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#00000010' },
    headerTitle: { fontSize: 20, fontWeight: '700' },
    text: { fontSize: 16 },
});

export default LandingPage;