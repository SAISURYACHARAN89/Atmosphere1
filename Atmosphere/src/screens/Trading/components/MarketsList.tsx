import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Animated,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { ActiveTrade, categories } from '../types';
import { styles } from '../styles';
import { TradeCard } from './TradeCard';
import { BOTTOM_NAV_HEIGHT } from '../../../lib/layout';

interface MarketsListProps {
    buyTrades: any[];
    buyLoading: boolean;
    isFirstLoad: boolean;
    savedItems: string[];
    showSavedOnly: boolean;
    searchValue: string;
    selectedCategories: string[];
    isFilterOpen: boolean;
    filterContainerStyle: any;
    expandedBuyTradeId: string | number | null;
    currentPhotoIndex: { [key: string]: number };
    refreshing: boolean;
    // Handlers
    setSearchValue: (val: string) => void;
    setShowSavedOnly: (val: boolean) => void;
    toggleFilterWithAnimation: () => void;
    handleCategoryClick: (category: string) => void;
    setExpandedBuyTradeId: (val: string | number | null) => void;
    toggleSaveItem: (itemId: string) => void;
    setCurrentPhotoIndex: (updater: (prev: { [key: string]: number }) => { [key: string]: number }) => void;
    handleExpressInterest: (trade: ActiveTrade) => void;
    handleLoadMoreBuy: () => void;
    onRefresh: () => void;
}

const MarketsList: React.FC<MarketsListProps> = ({
    buyTrades,
    buyLoading,
    isFirstLoad,
    savedItems,
    showSavedOnly,
    searchValue,
    selectedCategories,
    isFilterOpen,
    filterContainerStyle,
    expandedBuyTradeId,
    currentPhotoIndex,
    refreshing,
    setSearchValue,
    setShowSavedOnly,
    toggleFilterWithAnimation,
    handleCategoryClick,
    setExpandedBuyTradeId,
    toggleSaveItem,
    setCurrentPhotoIndex,
    handleExpressInterest,
    handleLoadMoreBuy,
    onRefresh,
}) => {
    const centeredLoaderStyle = { flex: 1, alignItems: 'center' as const, justifyContent: 'center' as const };
    const footerLoaderStyle = { margin: 20 };

    // Filter to show only saved items if showSavedOnly is true
    let data = buyTrades;
    if (showSavedOnly) {
        data = buyTrades.filter(trade => {
            const tradeId = trade._id || trade.id;
            return savedItems.includes(String(tradeId));
        });
    }

    const ListHeader = () => (
        <>
            {/* Search and Filter - now inside scrollable content */}
            <View style={styles.searchRow}>
                <View style={styles.searchBox}>
                    <MaterialCommunityIcons name="magnify" size={18} color="#bfbfbf" />
                    <TextInput
                        placeholder="Search companies..."
                        placeholderTextColor="#bfbfbf"
                        style={styles.searchInput}
                        value={searchValue}
                        onChangeText={setSearchValue}
                    />
                    {searchValue !== '' && (
                        <TouchableOpacity onPress={() => setSearchValue('')}>
                            <MaterialCommunityIcons name="close" size={18} color="#bfbfbf" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity
                    style={[styles.bookmarkBtn, showSavedOnly && styles.bookmarkBtnActive]}
                    onPress={() => setShowSavedOnly(!showSavedOnly)}
                >
                    <MaterialCommunityIcons
                        name={showSavedOnly ? "bookmark" : "bookmark-outline"}
                        size={20}
                        color={showSavedOnly ? "#fff" : "#bfbfbf"}
                    />
                </TouchableOpacity>
            </View>

            {/* Filter Button */}
            <TouchableOpacity
                style={styles.filterButton}
                onPress={toggleFilterWithAnimation}
            >
                <MaterialCommunityIcons name="tune" size={18} color="#fff" />
                <Text style={styles.filterButtonText}>Filters</Text>
                <MaterialCommunityIcons
                    name={isFilterOpen ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#bfbfbf"
                />
            </TouchableOpacity>

            {/* Category Filters - Animated container */}
            <Animated.View style={filterContainerStyle}>
                <View style={styles.categoriesContainer}>
                    {categories.map(category => (
                        <TouchableOpacity
                            key={category}
                            onPress={() => handleCategoryClick(category)}
                            style={[
                                styles.categoryChip,
                                selectedCategories.includes(category) && styles.categoryChipActive
                            ]}
                        >
                            <Text style={[
                                styles.categoryChipText,
                                selectedCategories.includes(category) && styles.categoryChipTextActive
                            ]}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Animated.View>

            {/* Suggested for you heading */}
            <Text style={styles.suggestedHeading}>Suggested for you</Text>

            {/* Inline loading indicator for filter changes (after first load) */}
            {!isFirstLoad && buyLoading && (
                <View style={{ paddingVertical: 16, alignItems: 'center' as const }}>
                    <ActivityIndicator size="small" color="#1a73e8" />
                </View>
            )}
        </>
    );

    // Only show full page loader on first load, not on filter changes
    if (isFirstLoad && buyLoading && data.length === 0) {
        return (
            <View style={centeredLoaderStyle}>
                <ActivityIndicator size="large" color="#1a73e8" />
            </View>
        );
    }

    return (
        <FlatList
            data={data}
            keyExtractor={(item, index) => `${String(item._id || item.id)}_${index}`}
            contentContainerStyle={{ paddingBottom: BOTTOM_NAV_HEIGHT + 24 }}
            renderItem={({ item }) => {
                const tradeId = item._id || item.id;
                if (!tradeId) return null;
                const isExpanded = expandedBuyTradeId === tradeId;
                const isSaved = savedItems.includes(String(tradeId));

                return (
                    <TradeCard
                        trade={item}
                        isExpanded={isExpanded}
                        isSaved={isSaved}
                        currentPhotoIndex={currentPhotoIndex[String(tradeId)] || 0}
                        onToggleExpand={() => {
                            setExpandedBuyTradeId(isExpanded ? null : (tradeId as string | number));
                        }}
                        onToggleSave={() => toggleSaveItem(String(tradeId))}
                        onPhotoIndexChange={(index) => setCurrentPhotoIndex(prev => ({ ...prev, [tradeId]: index }))}
                        onExpressInterest={() => handleExpressInterest(item)}
                    />
                );
            }}
            ListHeaderComponent={ListHeader}
            onEndReached={handleLoadMoreBuy}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => buyLoading && data.length > 0 ? <ActivityIndicator size="small" color="#1a73e8" style={footerLoaderStyle} /> : null}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#1a73e8"
                    title="Release to refresh"
                    titleColor="#888"
                />
            }
        />
    );
};

export default MarketsList;
