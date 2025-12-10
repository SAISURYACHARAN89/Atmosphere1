import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

const topStartups = [
    { id: 1, name: 'Airbound Pvt. Ltd.', initials: 'AR', color: '#F59E0B', tagline: 'Revolutionizing last-mile delivery with drone technology', likes: 1200 },
    { id: 2, name: 'Syko Analytics', initials: 'SY', color: '#9CA3AF', tagline: 'AI-powered customer behavior prediction platform', likes: 950 },
    { id: 3, name: 'GreenWave Energy', initials: 'GW', color: '#FB923C', tagline: 'Sustainable energy solutions for urban infrastructure', likes: 870 },
    { id: 4, name: 'MediConnect', initials: 'MC', color: '#3B82F6', tagline: 'Connecting patients with specialists through telemedicine', likes: 820 },
    { id: 5, name: 'Stellar Dynamics', initials: 'SD', color: '#6366F1', tagline: 'Next-gen satellite communication systems', likes: 790 },
    { id: 6, name: 'PayFlow Solutions', initials: 'PF', color: '#F59E0B', tagline: 'Digital payment infrastructure for emerging markets', likes: 760 },
    { id: 7, name: 'FoodFlow', initials: 'FF', color: '#10B981', tagline: 'Smart logistics for food supply chains', likes: 740 },
    { id: 8, name: 'CodeMentor AI', initials: 'CM', color: '#8B5CF6', tagline: 'AI-powered coding mentorship platform', likes: 720 },
    { id: 9, name: 'NeuralHealth', initials: 'NH', color: '#EC4899', tagline: 'Neural network diagnostics for healthcare', likes: 700 },
    { id: 10, name: 'LogiChain Systems', initials: 'LC', color: '#14B8A6', tagline: 'Blockchain-based supply chain transparency', likes: 680 },
];

const HottestStartups = () => {
    const [filterDay, setFilterDay] = useState<'today' | '7days'>('today');

    useEffect(() => {
        // placeholder for any timer or data fetch
    }, [filterDay]);

    const renderPodium = () => (
        <View style={styles.podiumWrap}>
            {/* 2nd */}
            <View style={styles.podiumItem}>
                <View style={[styles.medal, { backgroundColor: topStartups[1].color }]}>
                    <Text style={styles.medalText}>{topStartups[1].initials}</Text>
                </View>
                <View style={[styles.podiumBase, { backgroundColor: '#E5E7EB' }]}>
                    <Text style={styles.podiumRank}>2</Text>
                </View>
                <View style={styles.podiumLabel}>
                    <Text style={styles.podiumName} numberOfLines={1}>{topStartups[1].name}</Text>
                    <Text style={styles.podiumTag} numberOfLines={1}>{topStartups[1].tagline}</Text>
                    <View style={styles.likesRow}>
                        <Icon name="heart" size={14} color="#F472B6" />
                        <Text style={styles.likesText}>{topStartups[1].likes}</Text>
                    </View>
                </View>
            </View>

            {/* 1st */}
            <View style={styles.podiumItemCenter}>
                <View style={[styles.champion, { backgroundColor: topStartups[0].color }]}>
                    <Text style={styles.championText}>{topStartups[0].initials}</Text>
                </View>
                <View style={[styles.podiumBaseCenter, { backgroundColor: '#FDE68A' }]}>
                    <Text style={styles.podiumRankCenter}>1</Text>
                </View>
                <View style={styles.podiumLabelCenter}>
                    <Text style={styles.championName} numberOfLines={1}>{topStartups[0].name}</Text>
                    <Text style={styles.podiumTag} numberOfLines={1}>{topStartups[0].tagline}</Text>
                    <View style={styles.likesRow}>
                        <Icon name="heart" size={16} color="#F472B6" />
                        <Text style={styles.likesText}>{topStartups[0].likes}</Text>
                    </View>
                </View>
            </View>

            {/* 3rd */}
            <View style={styles.podiumItem}>
                <View style={[styles.medal, { backgroundColor: topStartups[2].color }]}>
                    <Text style={styles.medalText}>{topStartups[2].initials}</Text>
                </View>
                <View style={[styles.podiumBase, { backgroundColor: '#FED7AA' }]}>
                    <Text style={styles.podiumRank}>3</Text>
                </View>
                <View style={styles.podiumLabel}>
                    <Text style={styles.podiumName} numberOfLines={1}>{topStartups[2].name}</Text>
                    <Text style={styles.podiumTag} numberOfLines={1}>{topStartups[2].tagline}</Text>
                    <View style={styles.likesRow}>
                        <Icon name="heart" size={14} color="#F472B6" />
                        <Text style={styles.likesText}>{topStartups[2].likes}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderListItem = ({ item }: { item: any }) => (
        <View style={styles.listCard}>
            <View style={[styles.listAvatar, { backgroundColor: item.color }]}>
                <Text style={styles.listInitials}>{item.initials}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.listName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.listTag} numberOfLines={1}>{item.tagline}</Text>
                <View style={styles.likesRow}>
                    <Icon name="heart" size={14} color="#F472B6" />
                    <Text style={styles.likesText}>{item.likes}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.viewBtn} onPress={() => { /* navigate to profile */ }}>
                <Text style={styles.viewBtnText}>View</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.headerCenter}>
                <Text style={{ fontSize: 22 }}>🔥</Text>
                <Text style={styles.heading}>Hottest Startups This Week</Text>
                <Text style={styles.sub}>Discover the top 10 most liked companies in the past 7 days.</Text>
            </View>

            {renderPodium()}

            <View style={styles.listWrap}>
                <FlatList data={topStartups.slice(3)} keyExtractor={i => String(i.id)} renderItem={renderListItem} ItemSeparatorComponent={() => <View style={{ height: 12 }} />} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f1724' },
    content: { padding: 16, paddingBottom: 40 },
    headerCenter: { alignItems: 'center', marginBottom: 18 },
    heading: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 8 },
    sub: { color: '#9CA3AF', fontSize: 12, textAlign: 'center', marginTop: 6, maxWidth: width - 40 },
    podiumWrap: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 18, marginVertical: 16 },
    podiumItem: { width: 100, alignItems: 'center' },
    podiumItemCenter: { width: 120, alignItems: 'center' },
    medal: { width: 80, height: 80, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.3, elevation: 6 },
    medalText: { color: '#fff', fontSize: 20, fontWeight: '800' },
    champion: { width: 96, height: 96, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#FBBF24', shadowColor: '#000', shadowOpacity: 0.35, elevation: 8 },
    championText: { color: '#fff', fontSize: 26, fontWeight: '900' },
    podiumBase: { width: 64, height: 32, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: -12 },
    podiumBaseCenter: { width: 88, height: 40, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: -14 },
    podiumRank: { fontWeight: '700', color: '#374151' },
    podiumRankCenter: { fontWeight: '900', color: '#92400E', fontSize: 16 },
    podiumLabel: { alignItems: 'center', marginTop: 8 },
    podiumLabelCenter: { alignItems: 'center', marginTop: 8 },
    podiumName: { color: '#fff', fontWeight: '700' },
    championName: { color: '#fff', fontWeight: '900', fontSize: 16 },
    podiumTag: { color: '#9CA3AF', fontSize: 12, maxWidth: 120 },
    likesRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
    likesText: { color: '#F472B6', marginLeft: 6, fontSize: 12 },
    listWrap: { marginTop: 20 },
    listCard: { backgroundColor: '#0b1220', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center' },
    listAvatar: { width: 56, height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    listInitials: { color: '#fff', fontWeight: '800' },
    listName: { color: '#fff', fontWeight: '700' },
    listTag: { color: '#9CA3AF', fontSize: 12 },
    viewBtn: { borderWidth: 1, borderColor: '#1f2937', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999 },
    viewBtnText: { color: '#fff', fontWeight: '700' }
});

export default HottestStartups;
