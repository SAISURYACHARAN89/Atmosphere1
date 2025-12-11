import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { fetchMarkets, placeOrder } from '../lib/api';
import { BOTTOM_NAV_HEIGHT } from '../lib/layout';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



const Trading = () => {
    const [markets, setMarkets] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const m = await fetchMarkets();
                setMarkets(Array.isArray(m) ? m : []);
            } catch (e: any) {
                console.warn('Failed to load markets', e);
                setError(e?.message || 'Failed to load markets');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleBuy = async (assetId: string) => {
        try {
            await placeOrder(assetId, 'buy', 1);
            Alert.alert('Order executed');
        } catch (e: any) {
            Alert.alert('Order failed', e?.message || String(e));
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            {/* Fixed header */}
            <View style={styles.headerContainer}>
                <View style={styles.tabsRow}>
                    <TouchableOpacity style={[styles.tabButton, styles.tabLeft]}>
                        <Text style={styles.tabText}>BUY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabButton, styles.tabRight]}>
                        <Text style={styles.tabText}>SELL</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.searchRow}>
                    <View style={styles.searchBox}>
                        <MaterialCommunityIcons name="magnify" size={18} color="#bfbfbf" />
                        <TextInput placeholder="Search companies..." placeholderTextColor="#bfbfbf" style={styles.searchInput} />
                    </View>
                    <TouchableOpacity style={styles.bookmarkBtn}>
                        <MaterialCommunityIcons name="bookmark-outline" size={20} color="#bfbfbf" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.filterRow}>
                    <View style={styles.filterLeft}><MaterialCommunityIcons name="tune" size={18} color="#fff" /></View>
                    <Text style={styles.filterText}>Filters</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#bfbfbf" style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Suggested for You</Text>
            </View>

            {/* Scrollable cards only */}
            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#1a73e8" />
                </View>
            ) : error ? (
                <View style={{ padding: 20 }}>
                    <Text style={{ color: '#fff' }}>Error: {error}</Text>
                </View>
            ) : (
                <FlatList
                    data={markets}
                    keyExtractor={(i) => i._id ? String(i._id) : String(i.id)}
                    style={styles.cardsList}
                    contentContainerStyle={{ paddingBottom: BOTTOM_NAV_HEIGHT + 24 }}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.avatarWrap}>
                                <View style={styles.avatarCircle} />
                            </View>
                            <View style={styles.cardBody}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.companyName}>{item.title || item.name}</Text>
                                    <TouchableOpacity style={styles.iconBtn}><MaterialCommunityIcons name="bookmark-outline" size={18} color="#bfbfbf" /></TouchableOpacity>
                                </View>
                                <Text style={styles.personName}>{item.owner || item.person || ''}</Text>
                                <Text style={styles.tagline}>{item.description || item.tagline || ''}</Text>
                                <TouchableOpacity style={{ marginTop: 8 }} onPress={() => handleBuy(item._id || item.id)}>
                                    <Text style={{ color: '#1a73e8', fontWeight: '700' }}>Buy</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#070707' },
    headerContainer: { paddingHorizontal: 12, paddingTop: 12 },
    tabsRow: { flexDirection: 'row', paddingVertical: 8, justifyContent: 'center', gap: 12 },
    tabButton: { width: 140, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2f2f2f' },
    tabLeft: {},
    tabRight: {},
    tabText: { color: '#fff', fontWeight: '700' },
    searchRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
    searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f0f0f', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 24 },
    searchInput: { marginLeft: 8, color: '#fff', flex: 1 },
    bookmarkBtn: { marginLeft: 12, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f0f0f' },
    filterRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, backgroundColor: '#0f0f0f', padding: 12, borderRadius: 12 },
    filterLeft: { marginRight: 8 },
    filterText: { color: '#fff', fontWeight: '600' },
    sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginTop: 12, marginBottom: 8 },
    cardsList: { flex: 1 },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f0f0f', marginVertical: 8, padding: 12, borderRadius: 18, borderWidth: 1, borderColor: '#333333' },
    avatarWrap: { marginRight: 12 },
    avatarCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#222' },
    cardBody: { flex: 1 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    companyName: { color: '#fff', fontWeight: '700' },
    personName: { color: '#bfbfbf', fontSize: 12, marginTop: 4 },
    tagline: { color: '#bfbfbf', fontSize: 12, marginTop: 6 },
    iconBtn: { padding: 6 },
});

export default Trading;
