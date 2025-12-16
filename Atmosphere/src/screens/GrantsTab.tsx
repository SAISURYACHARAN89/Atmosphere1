import React, { useState, useEffect, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OpportunityCard from '../components/OpportunityCard';
import ThemedRefreshControl from '../components/ThemedRefreshControl';
import * as api from '../lib/api';

const { width } = Dimensions.get('window');
const LIMIT = 20;

export default function GrantsTab() {
    const { theme } = useContext(ThemeContext) as any;
    const [grants, setGrants] = useState<any[]>([]);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const flatListContentStyle = useMemo(() => ({ paddingBottom: 80, paddingHorizontal: 16 }), []);
    const loadMoreLoaderStyle = useMemo(() => ({ marginVertical: 20 }), []);
    const filterButtonTextStyle = useMemo(() => ({ fontSize: 14, fontWeight: 'bold' as const }), []);

    const loadGrants = async (skipVal = 0) => {
        if (loading && skipVal !== 0) return;
        setLoading(true);
        try {
            const data = await api.fetchGrants(LIMIT, skipVal);
            if (skipVal === 0) {
                setGrants(data);
                AsyncStorage.setItem('ATMOSPHERE_GRANTS_CACHE', JSON.stringify(data)).catch(() => { });
            } else {
                setGrants(prev => {
                    const existingIds = new Set(prev.map(item => item._id || item.id));
                    const newItems = data.filter((item: any) => !existingIds.has(item._id || item.id));
                    return [...prev, ...newItems];
                });
            }
            setHasMore(data.length >= LIMIT);
            setSkip(skipVal + LIMIT);
        } catch (e) {
            console.warn('Grants load fail', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            const cached = await AsyncStorage.getItem('ATMOSPHERE_GRANTS_CACHE');
            if (cached) setGrants(JSON.parse(cached));
            loadGrants(0);
        })();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadGrants(0);
        setRefreshing(false);
    };

    const loadMore = () => {
        if (!hasMore || loading) return;
        loadGrants(skip);
    };

    if (loading && grants.length === 0) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <View style={{ width, flex: 1 }}>
            <FlatList
                data={grants}
                keyExtractor={(item) => String(item._id || item.id)}
                contentContainerStyle={flatListContentStyle}
                renderItem={({ item }) => (
                    <OpportunityCard
                        item={item}
                        type="Grant"
                        expanded={expandedId === (item._id || item.id)}
                        onExpand={() => setExpandedId(expandedId === (item._id || item.id) ? null : (item._id || item.id))}
                    />
                )}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <ThemedRefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        progressViewOffset={0}
                    />
                }
                ListHeaderComponent={() => (
                    <View style={styles.listHeader}>
                        <Text style={styles.resultCount}>Total grants: {grants.length}</Text>
                        <TouchableOpacity>
                            <Text style={[filterButtonTextStyle, { color: theme.primary }]}>Filter</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListFooterComponent={() => {
                    if (loading && grants.length > 0) return <ActivityIndicator style={loadMoreLoaderStyle} color={theme.primary} />;
                    if (grants.length === 0) return <Text style={styles.emptyText}>No grants found.</Text>;
                    return null;
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    loaderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
    listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 4 },
    resultCount: { fontSize: 14, opacity: 0.7, color: '#fff' },
    emptyText: { textAlign: 'center', color: '#888', marginTop: 32, fontSize: 16 },
});
