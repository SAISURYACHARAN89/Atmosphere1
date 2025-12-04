import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import StartupPost from '../components/StartupPost';
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

const Home = ({ onLogout }: { onLogout?: () => void }) => {
    const [route, setRoute] = useState<RouteKey>('home');
    const { theme } = useContext(ThemeContext);

    const dynamicStyles = React.useMemo(() => ({
        navItemActive: { backgroundColor: theme.primary },
        glyphColor: { color: theme.placeholder },
        glyphActiveColor: { color: '#fff' },
    }), [theme]);

    const mockStartups = [
        {
            id: 'airbound-co',
            name: 'Airbound.co',
            tagline: 'Revolutionary aerospace delivery platform',
            brief: "We're building the future of last-mile delivery using autonomous drones. Our AI-powered logistics network reduces delivery costs by 60% while cutting carbon emissions in urban areas.",
            logo: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=100&h=100&fit=crop',
            revenueGenerating: true,
            fundsRaised: '$2M',
            currentInvestors: ['Y Combinator', 'Sequoia', 'a16z'],
            lookingToDilute: true,
            dilutionAmount: '$3,000,000',
            images: [
                'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop'
            ]
        },
        {
            id: 'skyt-air',
            name: 'Skyt Air',
            tagline: 'Next-gen aviation technology solutions',
            brief: 'Advanced flight management systems for commercial airlines.',
            logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop',
            revenueGenerating: true,
            fundsRaised: '$4M',
            currentInvestors: ['Techstars', '500 Startups'],
            lookingToDilute: true,
            dilutionAmount: '20% for $5M',
            images: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop']
        }
    ];

    const renderContent = () => {
        switch (route) {
            case 'home':
                return (
                    <FlatList
                        data={mockStartups}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => <StartupPost company={item} />}
                    />
                );
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
    listContent: { padding: 12 },
    title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
    text: { fontSize: 16 },
    logout: { marginTop: 16, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
    logoutText: { color: '#fff', fontWeight: '700' },
});

export default Home;
