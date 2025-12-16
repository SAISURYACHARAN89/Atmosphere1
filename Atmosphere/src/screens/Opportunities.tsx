import React, { useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import GrantsTab from './GrantsTab';
import EventsTab from './EventsTab';
import TeamTab from './TeamTab';

const TABS = ['Grants', 'Events', 'Team'];
const { width } = Dimensions.get('window');

const Opportunities = () => {
    const [activeTab, setActiveTab] = useState('Grants');
    const flatListRef = useRef<FlatList>(null);

    // Tab bar styling matching web
    const tabBarBgStyle = useMemo(() => ({ backgroundColor: 'rgba(255,255,255,0.06)' }), []);
    const tabBtnActiveStyle = useMemo(() => ({ backgroundColor: '#1a1a1a' }), []);
    const tabTextActiveStyle = useMemo(() => ({ color: '#fff', fontWeight: '500' as const }), []);
    const tabTextInactiveStyle = useMemo(() => ({ color: '#888', fontWeight: 'normal' as const }), []);

    const handleTabPress = (tab: string, index: number) => {
        setActiveTab(tab);
        flatListRef.current?.scrollToIndex({ index, animated: true });
    };

    const handleMomentumScrollEnd = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        const newTab = TABS[index];
        if (newTab && newTab !== activeTab) {
            setActiveTab(newTab);
        }
    };

    const renderTabContent = ({ item: tabName }: { item: string }) => {
        if (tabName === 'Grants') return <GrantsTab />;
        if (tabName === 'Events') return <EventsTab />;
        if (tabName === 'Team') return <TeamTab />;
        return null;
    };

    return (
        <View style={styles.container}>
            {/* Tab Bar Header */}
            <View style={[styles.tabBar, tabBarBgStyle]}>
                {TABS.map((tab, index) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tabBtn, activeTab === tab && tabBtnActiveStyle]}
                        onPress={() => handleTabPress(tab, index)}
                    >
                        <Text style={[styles.tabText, activeTab === tab ? tabTextActiveStyle : tabTextInactiveStyle]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Swipeable Tab Content */}
            <FlatList
                ref={flatListRef}
                data={TABS}
                keyExtractor={(item) => item}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                renderItem={renderTabContent}
                getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
                initialScrollIndex={0}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 16, backgroundColor: '#000000' },
    tabBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, borderRadius: 25, padding: 4, marginHorizontal: 12 },
    tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    tabText: { fontSize: 14 },
});

export default Opportunities;
