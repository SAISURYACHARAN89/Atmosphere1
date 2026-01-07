import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    LayoutAnimation,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video';
import { Image as RNImage } from 'react-native';

import { Investment, InvestorPortfolio, ActiveTrade } from '../types';
import { styles } from '../styles';
import { TradingForm } from './TradingForm';
import { BOTTOM_NAV_HEIGHT } from '../../../lib/layout';

// Utility: Calculate years ago from a date
const getYearsAgo = (date?: Date | string): string => {
    if (!date) return '';
    const now = new Date();
    const investmentDate = new Date(date);
    const diffMs = now.getTime() - investmentDate.getTime();
    const years = diffMs / (1000 * 60 * 60 * 24 * 365.25);
    return `${years.toFixed(1)} years`;
};

interface InvestorPortfoliosProps {
    investors: InvestorPortfolio[];
    investorsLoading: boolean;
    activeTrades: ActiveTrade[];
    expandedPortfolios: Set<string>;
    expandedCompany: string | null;
    expandedTradeId: string | number | null;
    editingTradeId: string | null;
    currentPhotoIndex: { [key: string]: number };
    refreshing: boolean;
    // Form state
    sellingRangeMin: number;
    setSellingRangeMin: (val: number) => void;
    sellingRangeMax: number;
    setSellingRangeMax: (val: number) => void;
    isManualEntry: boolean;
    setIsManualEntry: (val: boolean) => void;
    startupUsername: string;
    setStartupUsername: (val: string) => void;
    externalLinkHeading: string;
    setExternalLinkHeading: (val: string) => void;
    externalLinkUrl: string;
    setExternalLinkUrl: (val: string) => void;
    description: string;
    setDescription: (val: string) => void;
    revenueStatus: 'revenue-generating' | 'pre-revenue';
    setRevenueStatus: (val: 'revenue-generating' | 'pre-revenue') => void;
    videoUri: string;
    imageUris: string[];
    selectedIndustries: string[];
    // Handlers
    onRefresh: () => void;
    togglePortfolio: (cardKey: string) => void;
    setExpandedCompany: (val: string | null) => void;
    setSelectedCompanyName: (val: string) => void;
    setSelectedCompanyAge: (val: string) => void;
    handleVideoUpload: () => void;
    handleImageUpload: () => void;
    removeImage: (index: number) => void;
    toggleIndustry: (industry: string) => void;
    handleOpenTrade: () => void;
    setExpandedTradeId: (val: string | number | null) => void;
    setEditingTradeId: (val: string | null) => void;
    setCurrentPhotoIndex: (updater: (prev: { [key: string]: number }) => { [key: string]: number }) => void;
    handleUpdateTrade: (tradeId: any) => void;
    handleDeleteTrade: (tradeId: any) => void;
}

const InvestorPortfolios: React.FC<InvestorPortfoliosProps> = ({
    investors,
    investorsLoading,
    activeTrades,
    expandedPortfolios,
    expandedCompany,
    expandedTradeId,
    editingTradeId,
    currentPhotoIndex,
    refreshing,
    sellingRangeMin,
    setSellingRangeMin,
    sellingRangeMax,
    setSellingRangeMax,
    isManualEntry,
    setIsManualEntry,
    startupUsername,
    setStartupUsername,
    externalLinkHeading,
    setExternalLinkHeading,
    externalLinkUrl,
    setExternalLinkUrl,
    description,
    setDescription,
    revenueStatus,
    setRevenueStatus,
    videoUri,
    imageUris,
    selectedIndustries,
    onRefresh,
    togglePortfolio,
    setExpandedCompany,
    setSelectedCompanyName,
    setSelectedCompanyAge,
    handleVideoUpload,
    handleImageUpload,
    removeImage,
    toggleIndustry,
    handleOpenTrade,
    setExpandedTradeId,
    setEditingTradeId,
    setCurrentPhotoIndex,
    handleUpdateTrade,
    handleDeleteTrade,
}) => {
    const flexOneStyle = { flex: 1 };
    const rowCenterStyle = { flexDirection: 'row' as const, alignItems: 'center' as const };
    const activeTradesTopStyle = { marginTop: 24 };

    if (investorsLoading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#1a73e8" />
            </View>
        );
    }

    // Flatten all investments from all investors into a single list
    const allInvestments: Array<Investment & { investorId: string; investorName: string }> = [];
    investors.forEach(investor => {
        if (investor.previousInvestments && investor.previousInvestments.length > 0) {
            investor.previousInvestments.forEach(investment => {
                allInvestments.push({
                    ...investment,
                    investorId: investor._id,
                    investorName: investor.user?.displayName || investor.user?.username || 'Investor'
                });
            });
        }
    });

    if (allInvestments.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No Portfolios Available</Text>
                <Text style={styles.emptyText}>
                    No investors have listed their portfolios yet
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={flexOneStyle}
            contentContainerStyle={{ paddingBottom: BOTTOM_NAV_HEIGHT + 24 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#1a73e8"
                    title="Release to refresh"
                    titleColor="#888"
                />
            }
        >
            <Text style={styles.portfolioHeader}>Portfolio</Text>
            {allInvestments.map((item, index) => {
                const cardKey = `${item.companyName}-${item.investorId}`;
                const isExpanded = expandedPortfolios.has(cardKey);
                const yearsText = getYearsAgo(item.date);

                return (
                    <View key={index} style={styles.portfolioCard}>
                        <TouchableOpacity
                            style={styles.portfolioCardHeader}
                            onPress={() => {
                                togglePortfolio(cardKey);
                                if (isExpanded) {
                                    setExpandedCompany(null);
                                    setSelectedCompanyName('');
                                    setSelectedCompanyAge('');
                                } else {
                                    setExpandedCompany(cardKey);
                                    setSelectedCompanyName(item.companyName);
                                    setSelectedCompanyAge(yearsText);
                                }
                            }}
                        >
                            <View style={flexOneStyle}>
                                <View style={rowCenterStyle}>
                                    <Text style={styles.portfolioCompanyName}>
                                        {item.companyName}
                                    </Text>
                                    {yearsText ? (
                                        <View style={styles.yearsBadge}>
                                            <Text style={styles.yearsBadgeText}>{yearsText}</Text>
                                        </View>
                                    ) : null}
                                </View>
                            </View>
                            <MaterialCommunityIcons
                                name={isExpanded ? "chevron-up" : "chevron-down"}
                                size={24}
                                color="#bfbfbf"
                            />
                        </TouchableOpacity>

                        {isExpanded && expandedCompany === cardKey && (
                            <TradingForm
                                sellingRangeMin={sellingRangeMin}
                                setSellingRangeMin={setSellingRangeMin}
                                sellingRangeMax={sellingRangeMax}
                                setSellingRangeMax={setSellingRangeMax}
                                isManualEntry={isManualEntry}
                                setIsManualEntry={setIsManualEntry}
                                startupUsername={startupUsername}
                                setStartupUsername={setStartupUsername}
                                externalLinkHeading={externalLinkHeading}
                                setExternalLinkHeading={setExternalLinkHeading}
                                externalLinkUrl={externalLinkUrl}
                                setExternalLinkUrl={setExternalLinkUrl}
                                description={description}
                                setDescription={setDescription}
                                revenueStatus={revenueStatus}
                                setRevenueStatus={setRevenueStatus}
                                videoUri={videoUri}
                                handleVideoUpload={handleVideoUpload}
                                imageUris={imageUris}
                                handleImageUpload={handleImageUpload}
                                removeImage={removeImage}
                                selectedIndustries={selectedIndustries}
                                toggleIndustry={toggleIndustry}
                                onSubmit={handleOpenTrade}
                                submitText={editingTradeId ? "Update Trade" : "Open Trade"}
                            />
                        )}
                    </View>
                );
            })}

            {/* Active Trades Section */}
            {activeTrades.length > 0 && (
                <View style={activeTradesTopStyle}>
                    <Text style={styles.portfolioHeader}>Active Trades</Text>
                    {activeTrades.map((trade) => {
                        const tradeId = trade._id || trade.id;
                        if (!tradeId) return null;
                        const isExpanded = expandedTradeId === tradeId;
                        const photoIndex = currentPhotoIndex[tradeId] || 0;
                        const imageCount = trade.imageUrls?.length || 0;
                        const hasVideo = !!trade.videoUrl;
                        const totalMediaCount = imageCount + (hasVideo ? 1 : 0);
                        const isCurrentItemVideo = hasVideo && photoIndex === imageCount;

                        return (
                            <View key={tradeId} style={styles.professionalTradeCard}>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    style={[styles.collapsedCardRow, isExpanded && styles.expandedCardHeader]}
                                    onPress={() => {
                                        LayoutAnimation.configureNext({
                                            duration: 200,
                                            update: { type: LayoutAnimation.Types.easeInEaseOut },
                                            create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
                                            delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
                                        });
                                        setExpandedTradeId(isExpanded ? null : (tradeId as string | number));
                                        setEditingTradeId(null);
                                    }}
                                >
                                    {/* Avatar */}
                                    {trade.imageUrls && trade.imageUrls.length > 0 && trade.imageUrls[0] ? (
                                        <RNImage
                                            source={{ uri: trade.imageUrls[0] }}
                                            style={styles.collapsedAvatar}
                                        />
                                    ) : (
                                        <View style={styles.collapsedAvatar}>
                                            <Text style={styles.collapsedAvatarText}>
                                                {trade.companyName[0]}
                                            </Text>
                                        </View>
                                    )}

                                    {/* Company Info */}
                                    <View style={styles.collapsedCompanyInfo}>
                                        <Text style={styles.collapsedCompanyName}>{trade.companyName}</Text>
                                        {!isExpanded && (
                                            <Text style={styles.collapsedDescription} numberOfLines={1}>
                                                {trade.description || 'No description provided'}
                                            </Text>
                                        )}
                                    </View>

                                    {/* Edit/Delete Actions */}
                                    <View style={styles.collapsedActions}>
                                        <TouchableOpacity
                                            style={styles.collapsedActionBtn}
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                handleUpdateTrade(tradeId);
                                            }}
                                        >
                                            <MaterialCommunityIcons name="pencil" size={16} color="#999" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.collapsedActionBtn}
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTrade(tradeId);
                                            }}
                                        >
                                            <MaterialCommunityIcons name="delete" size={16} color="#ff4444" />
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>

                                {isExpanded && (
                                    editingTradeId === tradeId ? (
                                        <TradingForm
                                            sellingRangeMin={sellingRangeMin}
                                            setSellingRangeMin={setSellingRangeMin}
                                            sellingRangeMax={sellingRangeMax}
                                            setSellingRangeMax={setSellingRangeMax}
                                            isManualEntry={isManualEntry}
                                            setIsManualEntry={setIsManualEntry}
                                            startupUsername={startupUsername}
                                            setStartupUsername={setStartupUsername}
                                            externalLinkHeading={externalLinkHeading}
                                            setExternalLinkHeading={setExternalLinkHeading}
                                            externalLinkUrl={externalLinkUrl}
                                            setExternalLinkUrl={setExternalLinkUrl}
                                            description={description}
                                            setDescription={setDescription}
                                            revenueStatus={revenueStatus}
                                            setRevenueStatus={setRevenueStatus}
                                            videoUri={videoUri}
                                            handleVideoUpload={handleVideoUpload}
                                            imageUris={imageUris}
                                            handleImageUpload={handleImageUpload}
                                            removeImage={removeImage}
                                            selectedIndustries={selectedIndustries}
                                            toggleIndustry={toggleIndustry}
                                            onSubmit={handleOpenTrade}
                                            submitText="Update Trade"
                                            noPadding
                                        />
                                    ) : (
                                        <>
                                            {/* Description */}
                                            <Text style={styles.expandedDescription}>
                                                {trade.description || 'No description provided'}
                                            </Text>

                                            {/* Media Carousel */}
                                            {totalMediaCount > 0 && (
                                                <View style={styles.professionalImageContainer}>
                                                    {isCurrentItemVideo ? (
                                                        <Video
                                                            source={{ uri: trade.videoUrl }}
                                                            style={styles.professionalImage}
                                                            controls={true}
                                                            resizeMode="contain"
                                                            repeat={true}
                                                        />
                                                    ) : (
                                                        <RNImage
                                                            source={{ uri: trade.imageUrls?.[photoIndex] }}
                                                            style={styles.professionalImage}
                                                        />
                                                    )}

                                                    {/* Navigation Arrows */}
                                                    {totalMediaCount > 1 && (
                                                        <>
                                                            {photoIndex > 0 && (
                                                                <TouchableOpacity
                                                                    style={[styles.professionalArrow, styles.professionalArrowLeft]}
                                                                    onPress={() => setCurrentPhotoIndex(prev => ({ ...prev, [tradeId]: photoIndex - 1 }))}
                                                                >
                                                                    <MaterialCommunityIcons name="chevron-left" size={22} color="#fff" />
                                                                </TouchableOpacity>
                                                            )}
                                                            {photoIndex < totalMediaCount - 1 && (
                                                                <TouchableOpacity
                                                                    style={[styles.professionalArrow, styles.professionalArrowRight]}
                                                                    onPress={() => setCurrentPhotoIndex(prev => ({ ...prev, [tradeId]: photoIndex + 1 }))}
                                                                >
                                                                    <MaterialCommunityIcons name="chevron-right" size={22} color="#fff" />
                                                                </TouchableOpacity>
                                                            )}

                                                            {/* Media Indicators */}
                                                            <View style={styles.professionalIndicators}>
                                                                {Array.from({ length: totalMediaCount }).map((_, idx) => (
                                                                    <View
                                                                        key={idx}
                                                                        style={[
                                                                            styles.professionalDot,
                                                                            idx === photoIndex && styles.professionalDotActive
                                                                        ]}
                                                                    />
                                                                ))}
                                                            </View>
                                                        </>
                                                    )}
                                                </View>
                                            )}

                                            {/* Info Grid */}
                                            <View style={styles.professionalInfoGrid}>
                                                <View style={styles.professionalInfoItem}>
                                                    <Text style={styles.professionalInfoLabel}>Revenue</Text>
                                                    <Text style={styles.professionalInfoValue}>
                                                        {trade.revenueStatus === 'revenue-generating' ? 'Revenue Generating' : 'Pre Revenue'}
                                                    </Text>
                                                </View>
                                                <View style={styles.professionalInfoItem}>
                                                    <Text style={styles.professionalInfoLabel}>Age</Text>
                                                    <Text style={styles.professionalInfoValue}>{trade.companyAge || 'N/A'}</Text>
                                                </View>
                                                <View style={styles.professionalInfoItem}>
                                                    <Text style={styles.professionalInfoLabel}>Range</Text>
                                                    <Text style={styles.professionalInfoValue}>
                                                        {trade.sellingRangeMin}% - {trade.sellingRangeMax}%
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Industry Tags */}
                                            {trade.selectedIndustries && trade.selectedIndustries.length > 0 && (
                                                <View style={styles.professionalTags}>
                                                    {trade.selectedIndustries.map((industry, idx) => (
                                                        <View key={idx} style={styles.professionalTag}>
                                                            <Text style={styles.professionalTagText}>{industry}</Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            )}

                                            {/* Views & Saves */}
                                            <View style={styles.tradeStats}>
                                                <Text style={styles.tradeStatText}>Views: {trade.views}</Text>
                                                <Text style={styles.tradeStatText}>Saves: {trade.saves}</Text>
                                            </View>
                                        </>
                                    )
                                )}
                            </View>
                        );
                    })}
                </View>
            )}
        </ScrollView>
    );
};

export default InvestorPortfolios;
