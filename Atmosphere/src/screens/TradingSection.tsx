import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator, Dimensions, Animated, ScrollView, Image as RNImage, Alert } from 'react-native';
import { fetchMarkets, fetchInvestors, createTrade, getMyTrades, getAllTrades, updateTrade, deleteTrade, incrementTradeViews } from '../lib/api';
import { BOTTOM_NAV_HEIGHT } from '../lib/layout';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';

const { width: screenW } = Dimensions.get('window');

// Industry/Segment tags
const industryTags = [
    "AI", "ML", "Fintech", "HealthTech", "EV", "SaaS", "E-commerce", "EdTech", "AgriTech",
    "Blockchain", "IoT", "CleanTech", "FoodTech", "PropTech", "InsurTech", "LegalTech",
    "MarTech", "RetailTech", "TravelTech", "Logistics", "Cybersecurity", "Gaming", "Media", "SpaceTech"
];

// Category filters for buy tab
const categories = [
    "AI", "ML", "DeepTech", "Manufacturing", "Cafe", "B2B", "B2C", "B2B2C",
    "Fintech", "SaaS", "HealthTech", "AgriTech", "D2C", "Logistics", "EV",
    "EdTech", "Robotics", "IoT", "Blockchain", "E-commerce", "FoodTech",
    "PropTech", "InsurTech", "LegalTech", "CleanTech", "BioTech", "Cybersecurity",
    "AR/VR", "Gaming", "Media", "Entertainment", "Travel", "Hospitality",
];

interface Investment {
    _id?: string;
    companyName: string;
    companyId?: string;
    date?: Date | string;
    amount?: number;
    docs?: string[];
}

interface InvestorPortfolio {
    _id: string;
    user: {
        _id: string;
        username: string;
        displayName?: string;
        avatarUrl?: string;
    };
    previousInvestments: Investment[];
}

interface ActiveTrade {
    _id?: string;
    id?: number;
    companyId: string;
    companyName: string;
    companyType: string[];
    companyAge: string;
    revenueStatus: "revenue-generating" | "pre-revenue";
    description: string;
    startupUsername: string;
    sellingRangeMin: number;
    sellingRangeMax: number;
    videoUrl?: string;
    imageUrls: string[];
    views: number;
    saves: number;
    isEdited: boolean;
    isManualEntry: boolean;
    selectedIndustries: string[];
    externalLinkHeading?: string;
    externalLinkUrl?: string;
}

const Trading = () => {
    const [markets, setMarkets] = useState<any[]>([]);
    const [investors, setInvestors] = useState<InvestorPortfolio[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [investorsLoading, setInvestorsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
    const [expandedPortfolios, setExpandedPortfolios] = useState<Set<string>>(new Set());
    const pagerRef = useRef<any>(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    // SELL tab - Portfolio form state
    const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
    const [sellingRangeMin, setSellingRangeMin] = useState<number>(10);
    const [sellingRangeMax, setSellingRangeMax] = useState<number>(40);
    const [companyAge, setCompanyAge] = useState<string>('');
    const [revenueStatus, setRevenueStatus] = useState<"revenue-generating" | "pre-revenue">("pre-revenue");
    const [description, setDescription] = useState<string>('');
    const [startupUsername, setStartupUsername] = useState<string>('');
    const [isManualEntry, setIsManualEntry] = useState<boolean>(false);
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
    const [companyType] = useState<string[]>([]);
    const [videoUri, setVideoUri] = useState<string>('');
    const [imageUris, setImageUris] = useState<string[]>([]);
    const [externalLinkHeading, setExternalLinkHeading] = useState<string>('');
    const [externalLinkUrl, setExternalLinkUrl] = useState<string>('');
    const [selectedCompanyName, setSelectedCompanyName] = useState<string>('');
    const [selectedCompanyAge, setSelectedCompanyAge] = useState<string>('');

    // Active trades
    const [activeTrades, setActiveTrades] = useState<ActiveTrade[]>([]);
    const [expandedTradeId, setExpandedTradeId] = useState<string | number | null>(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState<{ [key: string]: number }>({});

    // BUY tab state
    const [searchValue, setSearchValue] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [showSavedOnly, setShowSavedOnly] = useState(false);
    const [savedItems, setSavedItems] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [allTrades, setAllTrades] = useState<ActiveTrade[]>([]);
    const [expandedBuyTradeId, setExpandedBuyTradeId] = useState<string | number | null>(null);

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

    useEffect(() => {
        (async () => {
            setInvestorsLoading(true);
            try {
                const inv = await fetchInvestors({ limit: 50 });
                setInvestors(Array.isArray(inv) ? inv : []);
            } catch (e: any) {
                console.warn('Failed to load investors', e);
            } finally {
                setInvestorsLoading(false);
            }
        })();
    }, []);

    // Load active trades
    useEffect(() => {
        (async () => {
            try {
                const trades = await getMyTrades();
                setActiveTrades(Array.isArray(trades) ? trades : []);
            } catch (e: any) {
                console.warn('Failed to load trades', e);
            }
        })();
    }, []);

    // Load all trades for BUY tab
    useEffect(() => {
        (async () => {
            try {
                const trades = await getAllTrades();
                setAllTrades(Array.isArray(trades) ? trades : []);
            } catch (e: any) {
                console.warn('Failed to load all trades', e);
            }
        })();
    }, []);

    const togglePortfolio = (cardKey: string) => {
        setExpandedPortfolios(prev => {
            const newSet = new Set(prev);
            if (newSet.has(cardKey)) {
                newSet.delete(cardKey);
            } else {
                newSet.add(cardKey);
            }
            return newSet;
        });
    };

    const getYearsAgo = (date?: Date | string) => {
        if (!date) return '';
        const investmentDate = new Date(date);
        const years = new Date().getFullYear() - investmentDate.getFullYear();
        return years > 0 ? `${years} years ago` : 'This year';
    };

    const toggleIndustry = (industry: string) => {
        setSelectedIndustries(prev =>
            prev.includes(industry)
                ? prev.filter(i => i !== industry)
                : prev.length < 3 ? [...prev, industry] : prev
        );
    };

    const handleVideoUpload = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'video',
                quality: 0.8,
            });

            if (!result.didCancel && result.assets && result.assets.length > 0) {
                setVideoUri(result.assets[0].uri || '');
            }
        } catch (error) {
            console.warn('Video upload error:', error);
        }
    };

    const handleImageUpload = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8,
            });

            if (!result.didCancel && result.assets && result.assets.length > 0) {
                setImageUris([...imageUris, result.assets[0].uri || '']);
            }
        } catch (error) {
            console.warn('Image upload error:', error);
        }
    };

    const removeImage = (index: number) => {
        setImageUris(imageUris.filter((_, i) => i !== index));
    };

    const handleOpenTrade = async () => {
        if (!expandedCompany) return;

        // Use the company name and age that were stored when the portfolio card was expanded
        const finalCompanyName = selectedCompanyName || 'Company';
        const finalCompanyAge = selectedCompanyAge || companyAge || '';

        const tradeData = {
            companyId: expandedCompany,
            companyName: finalCompanyName,
            companyType,
            companyAge: finalCompanyAge,
            revenueStatus,
            description,
            startupUsername,
            sellingRangeMin,
            sellingRangeMax,
            selectedIndustries,
            isManualEntry,
            externalLinkHeading,
            externalLinkUrl,
            // Note: videoUrl and imageUrls are excluded for now (future implementation)
        };

        try {
            const response = await createTrade(tradeData);

            // Add the new trade to local state
            if (response && response.trade) {
                setActiveTrades([...activeTrades, response.trade]);
            }

            // Reset form
            setExpandedCompany(null);
            setSellingRangeMin(10);
            setSellingRangeMax(40);
            setCompanyAge('');
            setRevenueStatus('pre-revenue');
            setDescription('');
            setStartupUsername('');
            setIsManualEntry(false);
            setSelectedIndustries([]);
            setVideoUri('');
            setImageUris([]);
            setExternalLinkHeading('');
            setExternalLinkUrl('');
            setSelectedCompanyName('');
            setSelectedCompanyAge('');

            Alert.alert('Success', 'Trade opened successfully!');
        } catch (error: any) {
            console.error('Failed to create trade:', error);
            Alert.alert('Error', error.message || 'Failed to open trade');
        }
    };

    const handleDeleteTrade = async (tradeId: any) => {
        try {
            await deleteTrade(tradeId);
            setActiveTrades(activeTrades.filter(trade => trade._id !== tradeId));
            Alert.alert('Success', 'Trade deleted successfully!');
        } catch (error: any) {
            console.error('Failed to delete trade:', error);
            Alert.alert('Error', error.message || 'Failed to delete trade');
        }
    };

    const handleUpdateTrade = (tradeId: any) => {
        const trade = activeTrades.find(t => t._id === tradeId);
        if (trade) {
            setExpandedCompany(trade.companyId);
            setSellingRangeMin(trade.sellingRangeMin);
            setSellingRangeMax(trade.sellingRangeMax);
            setCompanyAge(trade.companyAge);
            setRevenueStatus(trade.revenueStatus);
            setDescription(trade.description);
            setStartupUsername(trade.startupUsername);
            setIsManualEntry(trade.isManualEntry);
            setVideoUri(trade.videoUrl || '');
            setImageUris(trade.imageUrls || []);
            setSelectedIndustries(trade.selectedIndustries);
            setExternalLinkHeading(trade.externalLinkHeading || '');
            setExternalLinkUrl(trade.externalLinkUrl || '');
            handleDeleteTrade(tradeId);
        }
    };

    const handleCategoryClick = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const toggleSaveItem = (itemId: string) => {
        setSavedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const renderInvestorPortfolios = () => {
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

        // Calculate years ago for each investment
        const getYearsAgo = (date?: Date) => {
            if (!date) return '';
            const now = new Date();
            const investmentDate = new Date(date);
            const diffMs = now.getTime() - investmentDate.getTime();
            const years = diffMs / (1000 * 60 * 60 * 24 * 365.25);
            return `${years.toFixed(1)} years`;
        };

        return (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: BOTTOM_NAV_HEIGHT + 24 }}>
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
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                                <View style={styles.portfolioExpanded}>
                                    {/* Selling Range */}
                                    <Text style={styles.formLabel}>Selling Range (%)</Text>
                                    <View style={styles.rangeRow}>
                                        <TextInput
                                            style={styles.rangeInput}
                                            placeholder="10"
                                            placeholderTextColor="#666"
                                            keyboardType="numeric"
                                            value={String(sellingRangeMin)}
                                            onChangeText={(text) => setSellingRangeMin(parseFloat(text) || 0)}
                                        />
                                        <Text style={styles.rangeToText}>to</Text>
                                        <TextInput
                                            style={styles.rangeInput}
                                            placeholder="40"
                                            placeholderTextColor="#666"
                                            keyboardType="numeric"
                                            value={String(sellingRangeMax)}
                                            onChangeText={(text) => setSellingRangeMax(parseFloat(text) || 0)}
                                        />
                                    </View>

                                    {/* Startup Details */}
                                    <Text style={styles.formLabel}>Startup Details</Text>
                                    <View style={styles.toggleRow}>
                                        <TouchableOpacity
                                            style={[styles.toggleButton, !isManualEntry && styles.toggleButtonActive]}
                                            onPress={() => setIsManualEntry(false)}
                                        >
                                            <Text style={!isManualEntry ? styles.toggleTextActive : styles.toggleText}>
                                                Auto Entry
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.toggleButton, isManualEntry && styles.toggleButtonActive]}
                                            onPress={() => setIsManualEntry(true)}
                                        >
                                            <Text style={isManualEntry ? styles.toggleTextActive : styles.toggleText}>
                                                Manual Entry
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    {!isManualEntry ? (
                                        // AUTO ENTRY
                                        <View>
                                            <TextInput
                                                style={styles.usernameInput}
                                                placeholder="@username"
                                                placeholderTextColor="#666"
                                                value={startupUsername}
                                                onChangeText={setStartupUsername}
                                            />

                                            <Text style={styles.formLabel}>Add external link</Text>
                                            <View style={styles.linkRow}>
                                                <TextInput
                                                    style={[styles.linkInput, { flex: 1, marginRight: 8 }]}
                                                    placeholder="Heading"
                                                    placeholderTextColor="#666"
                                                    value={externalLinkHeading}
                                                    onChangeText={setExternalLinkHeading}
                                                />
                                                <TextInput
                                                    style={[styles.linkInput, { flex: 1 }]}
                                                    placeholder="Link"
                                                    placeholderTextColor="#666"
                                                    value={externalLinkUrl}
                                                    onChangeText={setExternalLinkUrl}
                                                />
                                            </View>
                                        </View>
                                    ) : (
                                        // MANUAL ENTRY
                                        <View>
                                            <TextInput
                                                style={styles.usernameInput}
                                                placeholder="@username (optional)"
                                                placeholderTextColor="#666"
                                                value={startupUsername}
                                                onChangeText={setStartupUsername}
                                            />

                                            <Text style={styles.formLabel}>Add external link</Text>
                                            <View style={styles.linkRow}>
                                                <TextInput
                                                    style={[styles.linkInput, { flex: 1, marginRight: 8 }]}
                                                    placeholder="Heading"
                                                    placeholderTextColor="#666"
                                                    value={externalLinkHeading}
                                                    onChangeText={setExternalLinkHeading}
                                                />
                                                <TextInput
                                                    style={[styles.linkInput, { flex: 1 }]}
                                                    placeholder="Link"
                                                    placeholderTextColor="#666"
                                                    value={externalLinkUrl}
                                                    onChangeText={setExternalLinkUrl}
                                                />
                                            </View>

                                            {/* Segment Tags */}
                                            <Text style={styles.formLabel}>Segment (max 3)</Text>
                                            <ScrollView
                                                showsVerticalScrollIndicator={false}
                                                style={styles.tagsScroll}
                                                nestedScrollEnabled={true}
                                            >
                                                <View style={styles.tagsContent}>
                                                    {industryTags.map(tag => (
                                                        <TouchableOpacity
                                                            key={tag}
                                                            onPress={() => toggleIndustry(tag)}
                                                            disabled={!selectedIndustries.includes(tag) && selectedIndustries.length >= 3}
                                                            style={[
                                                                styles.tagChip,
                                                                selectedIndustries.includes(tag) && styles.tagChipActive
                                                            ]}
                                                        >
                                                            <Text style={[
                                                                styles.tagChipText,
                                                                selectedIndustries.includes(tag) && styles.tagChipTextActive
                                                            ]}>
                                                                {tag}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </ScrollView>

                                            {/* Description */}
                                            <Text style={styles.formLabel}>Description</Text>
                                            <TextInput
                                                style={styles.descriptionInput}
                                                placeholder="Description..."
                                                placeholderTextColor="#666"
                                                multiline
                                                numberOfLines={3}
                                                value={description}
                                                onChangeText={setDescription}
                                            />

                                            {/* Revenue Status */}
                                            <View style={styles.toggleRow}>
                                                <TouchableOpacity
                                                    style={[styles.toggleButton, revenueStatus === 'revenue-generating' && styles.toggleButtonActive]}
                                                    onPress={() => setRevenueStatus('revenue-generating')}
                                                >
                                                    <Text style={revenueStatus === 'revenue-generating' ? styles.toggleTextActive : styles.toggleText}>
                                                        Revenue Generating
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[styles.toggleButton, revenueStatus === 'pre-revenue' && styles.toggleButtonActive]}
                                                    onPress={() => setRevenueStatus('pre-revenue')}
                                                >
                                                    <Text style={revenueStatus === 'pre-revenue' ? styles.toggleTextActive : styles.toggleText}>
                                                        Pre Revenue
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>

                                            {/* Video Upload */}
                                            <TouchableOpacity style={styles.uploadButton} onPress={handleVideoUpload}>
                                                <MaterialCommunityIcons name="video" size={16} color="#fff" />
                                                <Text style={styles.uploadButtonText}>
                                                    {videoUri ? 'Video Selected' : 'Upload Video'}
                                                </Text>
                                            </TouchableOpacity>

                                            {/* Image Upload */}
                                            <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
                                                <MaterialCommunityIcons name="image" size={16} color="#fff" />
                                                <Text style={styles.uploadButtonText}>Upload Images</Text>
                                            </TouchableOpacity>

                                            {imageUris.length > 0 && (
                                                <View style={styles.imagePreviewContainer}>
                                                    {imageUris.map((uri, idx) => (
                                                        <View key={idx} style={styles.imagePreview}>
                                                            <RNImage source={{ uri }} style={styles.previewImage} />
                                                            <TouchableOpacity
                                                                style={styles.removeImageButton}
                                                                onPress={() => removeImage(idx)}
                                                            >
                                                                <MaterialCommunityIcons name="close" size={16} color="#fff" />
                                                            </TouchableOpacity>
                                                        </View>
                                                    ))}
                                                </View>
                                            )}
                                        </View>
                                    )}

                                    <TouchableOpacity
                                        style={styles.openTradeButton}
                                        onPress={handleOpenTrade}
                                    >
                                        <Text style={styles.openTradeButtonText}>Open Trade</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    );
                })}

                {/* Active Trades Section */}
                {activeTrades.length > 0 && (
                    <View style={{ marginTop: 24 }}>
                        <Text style={styles.portfolioHeader}>Active Trades</Text>
                        {activeTrades.map((trade) => {
                            const tradeId = trade._id || trade.id;
                            if (!tradeId) return null;
                            const isExpanded = expandedTradeId === tradeId;
                            const photoIndex = currentPhotoIndex[tradeId] || 0;

                            return (
                                <View key={tradeId} style={styles.tradeCard}>
                                    <TouchableOpacity
                                        style={styles.tradeCardHeader}
                                        onPress={() => setExpandedTradeId(isExpanded ? null : (tradeId as string | number))}
                                    >
                                        <View style={styles.tradeAvatar}>
                                            <Text style={styles.tradeAvatarText}>
                                                {trade.companyName[0]}
                                            </Text>
                                        </View>

                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                <Text style={styles.tradeCompanyName}>{trade.companyName}</Text>
                                                <View style={styles.tradeBadge}>
                                                    <Text style={styles.tradeBadgeText}>Trade</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.tradeUsername}>@{trade.startupUsername}</Text>
                                            {!isExpanded && (
                                                <Text style={styles.tradeMetaText}>
                                                    {trade.revenueStatus === 'revenue-generating' ? 'Revenue Generating' : 'Pre Revenue'} • {trade.sellingRangeMin}% - {trade.sellingRangeMax}%
                                                </Text>
                                            )}
                                        </View>

                                        <View style={{ flexDirection: 'row', gap: 8 }}>
                                            <TouchableOpacity
                                                style={styles.tradeActionButton}
                                                onPress={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdateTrade(tradeId);
                                                }}
                                            >
                                                <MaterialCommunityIcons name="pencil" size={16} color="#999" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.tradeActionButton}
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
                                        <View style={styles.tradeExpandedContent}>
                                            {trade.description && (
                                                <Text style={styles.tradeDescription}>"{trade.description}"</Text>
                                            )}

                                            {/* Media */}
                                            {(trade.videoUrl || trade.imageUrls.length > 0) && (
                                                <View style={styles.tradeMediaContainer}>
                                                    {trade.videoUrl ? (
                                                        <View style={styles.tradeMedia}>
                                                            <Text style={{ color: '#fff', textAlign: 'center' }}>Video Player</Text>
                                                        </View>
                                                    ) : (
                                                        <View style={styles.tradeMedia}>
                                                            <RNImage
                                                                source={{ uri: trade.imageUrls[photoIndex] }}
                                                                style={{ width: '100%', height: '100%' }}
                                                                resizeMode="cover"
                                                            />
                                                        </View>
                                                    )}
                                                </View>
                                            )}

                                            {/* Stats Grid */}
                                            <View style={styles.statsGrid}>
                                                <View style={styles.statCard}>
                                                    <Text style={styles.statLabel}>Revenue Status</Text>
                                                    <Text style={styles.statValue}>
                                                        {trade.revenueStatus === 'revenue-generating' ? 'Revenue Generating' : 'Pre Revenue'}
                                                    </Text>
                                                </View>
                                                <View style={styles.statCard}>
                                                    <Text style={styles.statLabel}>Company Age</Text>
                                                    <Text style={styles.statValue}>{trade.companyAge || 'N/A'}</Text>
                                                </View>
                                                <View style={[styles.statCard, { gridColumn: 'span 2' }]}>
                                                    <Text style={[styles.statLabel, { color: '#1a73e8' }]}>Selling Range</Text>
                                                    <Text style={[styles.statValue, { color: '#1a73e8' }]}>
                                                        {trade.sellingRangeMin}% - {trade.sellingRangeMax}%
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Views & Saves */}
                                            <View style={styles.tradeStats}>
                                                <Text style={styles.tradeStatText}>Views: {trade.views}</Text>
                                                <Text style={styles.tradeStatText}>Saves: {trade.saves}</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        );
    };

    const renderMarketsList = () => {
        if (loading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#1a73e8" />
                </View>
            );
        }

        if (error) {
            return (
                <View style={{ padding: 20 }}>
                    <Text style={{ color: '#fff' }}>Error: {error}</Text>
                </View>
            );
        }

        return (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: BOTTOM_NAV_HEIGHT + 24 }}>
                {/* Category Filters - Only show when filter is open */}
                {isFilterOpen && (
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
                )}

                {/* Trade Cards */}
                {allTrades.map((trade) => {
                    const tradeId = trade._id || trade.id;
                    if (!tradeId) return null;
                    const isExpanded = expandedBuyTradeId === tradeId;
                    const isSaved = savedItems.includes(String(tradeId));

                    return (
                        <View key={tradeId} style={styles.professionalTradeCard}>
                            {/* Header with Profile and Actions */}
                            <View style={styles.professionalCardHeader}>
                                {/* Profile Picture */}
                                {trade.imageUrls && trade.imageUrls.length > 0 && trade.imageUrls[0] ? (
                                    <RNImage
                                        source={{ uri: trade.imageUrls[0] }}
                                        style={styles.professionalAvatar}
                                    />
                                ) : (
                                    <View style={styles.professionalAvatar}>
                                        <Text style={styles.professionalAvatarText}>
                                            {trade.companyName[0]}
                                        </Text>
                                    </View>
                                )}

                                {/* Company Info */}
                                <View style={styles.professionalCompanyInfo}>
                                    <Text style={styles.professionalCompanyName}>{trade.companyName}</Text>
                                    {trade.startupUsername && (
                                        <Text style={styles.professionalUsername}>{trade.startupUsername}</Text>
                                    )}
                                </View>

                                {/* Action Buttons */}
                                <View style={styles.professionalActions}>
                                    <TouchableOpacity
                                        style={styles.professionalActionBtn}
                                        onPress={() => toggleSaveItem(String(tradeId))}
                                    >
                                        <MaterialCommunityIcons
                                            name={isSaved ? "bookmark" : "bookmark-outline"}
                                            size={22}
                                            color={isSaved ? "#1a73e8" : "#bfbfbf"}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.professionalActionBtn}
                                        onPress={() => Alert.alert('Chat', 'Chat functionality coming soon!')}
                                    >
                                        <MaterialCommunityIcons
                                            name="message-outline"
                                            size={22}
                                            color="#bfbfbf"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Description */}
                            <Text style={styles.professionalDescription}>
                                {trade.description || 'No description provided'}
                            </Text>

                            {/* Image Carousel */}
                            {trade.imageUrls && trade.imageUrls.length > 0 && (
                                <View style={styles.professionalImageContainer}>
                                    <RNImage
                                        source={{ uri: trade.imageUrls[currentPhotoIndex[tradeId] || 0] }}
                                        style={styles.professionalImage}
                                    />

                                    {/* Navigation Arrows */}
                                    {trade.imageUrls.length > 1 && (
                                        <>
                                            {/* Left Arrow */}
                                            {(currentPhotoIndex[tradeId] || 0) > 0 && (
                                                <TouchableOpacity
                                                    style={[styles.professionalArrow, styles.professionalArrowLeft]}
                                                    onPress={() => {
                                                        const currentIndex = currentPhotoIndex[tradeId] || 0;
                                                        setCurrentPhotoIndex({
                                                            ...currentPhotoIndex,
                                                            [tradeId]: currentIndex - 1
                                                        });
                                                    }}
                                                >
                                                    <MaterialCommunityIcons name="chevron-left" size={22} color="#fff" />
                                                </TouchableOpacity>
                                            )}

                                            {/* Right Arrow */}
                                            {(currentPhotoIndex[tradeId] || 0) < trade.imageUrls.length - 1 && (
                                                <TouchableOpacity
                                                    style={[styles.professionalArrow, styles.professionalArrowRight]}
                                                    onPress={() => {
                                                        const currentIndex = currentPhotoIndex[tradeId] || 0;
                                                        setCurrentPhotoIndex({
                                                            ...currentPhotoIndex,
                                                            [tradeId]: currentIndex + 1
                                                        });
                                                    }}
                                                >
                                                    <MaterialCommunityIcons name="chevron-right" size={22} color="#fff" />
                                                </TouchableOpacity>
                                            )}

                                            {/* Image Indicators (Dots) */}
                                            <View style={styles.professionalIndicators}>
                                                {trade.imageUrls.map((_, idx) => (
                                                    <View
                                                        key={idx}
                                                        style={[
                                                            styles.professionalDot,
                                                            idx === (currentPhotoIndex[tradeId] || 0) && styles.professionalDotActive
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

                            {/* Express Interest Button */}
                            <TouchableOpacity style={styles.expressInterestButton}>
                                <Text style={styles.expressInterestText}>Express Interest</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Fixed header */}
            <View style={styles.headerContainer}>
                {/* Swipeable tabs with underline indicator */}
                <View style={styles.tabsRow}>
                    <TouchableOpacity
                        style={styles.tabItem}
                        onPress={() => {
                            setActiveTab('buy');
                            pagerRef.current?.scrollTo({ x: 0, animated: true });
                        }}
                    >
                        <Text style={[styles.tabText, activeTab === 'buy' && styles.tabTextActive]}>
                            BUY
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.tabItem}
                        onPress={() => {
                            setActiveTab('sell');
                            pagerRef.current?.scrollTo({ x: screenW, animated: true });
                        }}
                    >
                        <Text style={[styles.tabText, activeTab === 'sell' && styles.tabTextActive]}>
                            SELL
                        </Text>
                    </TouchableOpacity>

                    {/* Animated underline indicator */}
                    <Animated.View
                        style={[
                            styles.tabIndicator,
                            {
                                width: screenW / 2,
                                transform: [{
                                    translateX: scrollX.interpolate({
                                        inputRange: [0, screenW],
                                        outputRange: [0, screenW / 2]
                                    })
                                }]
                            }
                        ]}
                    />
                </View>

                {/* Show search/filters only on Buy tab */}
                {activeTab === 'buy' && (
                    <>
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
                            onPress={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <MaterialCommunityIcons name="tune" size={18} color="#fff" />
                            <Text style={styles.filterButtonText}>Filters</Text>
                            <MaterialCommunityIcons
                                name={isFilterOpen ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="#bfbfbf"
                            />
                        </TouchableOpacity>
                    </>
                )}
            </View>

            {/* Swipeable content */}
            <Animated.ScrollView
                horizontal
                pagingEnabled
                ref={r => (pagerRef.current = r)}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                    const idx = Math.round(e.nativeEvent.contentOffset.x / screenW);
                    setActiveTab(idx === 0 ? 'buy' : 'sell');
                }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                style={{ flex: 1 }}
            >
                {/* Buy tab content */}
                <View style={[styles.pagerPage, { width: screenW }]}>
                    {renderMarketsList()}
                </View>

                {/* Sell tab content - Investor Portfolios */}
                <View style={[styles.pagerPage, { width: screenW }]}>
                    {renderInvestorPortfolios()}
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#070707' },
    headerContainer: { paddingHorizontal: 12, paddingTop: 12 },
    tabsRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
        position: 'relative',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
    },
    tabText: {
        color: '#999',
        fontSize: 14,
    },
    tabTextActive: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        height: 3,
        backgroundColor: '#fff',
    },
    searchRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
    searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f0f0f', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 24, gap: 8 },
    searchInput: { flex: 1, color: '#fff' },
    bookmarkBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f0f0f' },
    bookmarkBtnActive: { backgroundColor: '#1a73e8' },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0f0f0f',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginTop: 12,
        gap: 8,
    },
    filterButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    pagerPage: { flex: 1 },

    // Portfolio styles
    portfolioHeader: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    portfolioCard: {
        backgroundColor: '#0f0f0f',
        marginHorizontal: 16,
        marginVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden',
    },
    portfolioCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    portfolioCompanyName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    yearsBadge: {
        backgroundColor: '#2a2a2a',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 12,
    },
    yearsBadgeText: {
        color: '#999',
        fontSize: 12,
        fontWeight: '500',
    },
    portfolioExpanded: {
        borderTopWidth: 1,
        borderTopColor: '#222',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    formLabel: {
        color: '#999',
        fontSize: 13,
        marginBottom: 8,
        marginTop: 12,
    },
    rangeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 12,
    },
    rangeInput: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        color: '#fff',
        fontSize: 14,
    },
    rangeToText: {
        color: '#666',
        fontSize: 14,
    },
    toggleRow: {
        flexDirection: 'row',
        marginBottom: 12,
        gap: 8,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#333',
    },
    toggleButtonActive: {
        backgroundColor: '#2a2a2a',
        borderColor: '#444',
    },
    toggleText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '500',
    },
    toggleTextActive: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    usernameInput: {
        backgroundColor: '#0a0a0a',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        color: '#fff',
        fontSize: 14,
        marginBottom: 8,
    },
    linkRow: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 8,
    },
    linkInput: {
        backgroundColor: '#0a0a0a',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        color: '#fff',
        fontSize: 14,
    },
    tagsScroll: {
        maxHeight: 120,
        marginBottom: 12,
    },
    tagsContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#1a1a1a',
        marginRight: 8,
        marginBottom: 8,
    },
    tagChipActive: {
        backgroundColor: '#fff',
    },
    tagChipText: {
        color: '#999',
        fontSize: 12,
    },
    tagChipTextActive: {
        color: '#000',
        fontWeight: '600',
    },
    descriptionInput: {
        backgroundColor: '#0a0a0a',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        color: '#fff',
        fontSize: 14,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        paddingVertical: 12,
        marginTop: 8,
        gap: 8,
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
    },
    imagePreview: {
        width: 64,
        height: 64,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    removeImageButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    openTradeButton: {
        backgroundColor: '#3a3a3a',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 16,
    },
    openTradeButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },

    // Active Trades styles
    tradeCard: {
        backgroundColor: '#0f0f0f',
        marginHorizontal: 16,
        marginVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
        padding: 16,
    },
    tradeCardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    tradeAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#2a2a2a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tradeAvatarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    tradeCompanyName: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    tradeBadge: {
        backgroundColor: '#2a2a2a',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    tradeBadgeText: {
        color: '#999',
        fontSize: 10,
    },
    tradeUsername: {
        color: '#999',
        fontSize: 12,
        marginTop: 2,
    },
    tradeMetaText: {
        color: '#666',
        fontSize: 11,
        marginTop: 4,
    },
    tradeActionButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#1a1a1a',
    },
    tradeExpandedContent: {
        marginTop: 16,
        gap: 12,
    },
    tradeDescription: {
        color: '#ccc',
        fontSize: 13,
        lineHeight: 18,
    },
    tradeMediaContainer: {
        marginHorizontal: -16,
    },
    tradeMedia: {
        aspectRatio: 16 / 9,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    statCard: {
        flex: 1,
        minWidth: '48%',
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#2a2a2a',
    },
    statLabel: {
        color: '#999',
        fontSize: 11,
        marginBottom: 4,
    },
    statValue: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    tradeStats: {
        flexDirection: 'row',
        gap: 16,
    },
    tradeStatText: {
        color: '#999',
        fontSize: 12,
    },

    // Buy tab styles
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#1a1a1a',
    },
    categoryChipActive: {
        backgroundColor: '#1a73e8',
    },
    categoryChipText: {
        color: '#999',
        fontSize: 13,
    },
    categoryChipTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    cardsList: { flex: 1 },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f0f0f', marginVertical: 8, marginHorizontal: 12, padding: 12, borderRadius: 18, borderWidth: 1, borderColor: '#333333' },
    avatarWrap: { marginRight: 12 },
    avatarCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#222' },
    cardBody: { flex: 1 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    companyName: { color: '#fff', fontWeight: '700' },
    personName: { color: '#bfbfbf', fontSize: 12, marginTop: 4 },
    tagline: { color: '#bfbfbf', fontSize: 12, marginTop: 6 },
    iconBtn: { padding: 6 },

    // BUY tab trade card styles
    buyTradeCard: {
        backgroundColor: '#0f0f0f',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden',
    },
    buyTradeCardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
    },
    buyTradeAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#1a73e8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    buyTradeAvatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    buyTradeInfo: {
        flex: 1,
        marginRight: 12,
    },
    buyTradeCompanyName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
    },
    buyTradeUsername: {
        color: '#999',
        fontSize: 13,
        marginBottom: 6,
    },
    buyTradeDescription: {
        color: '#bfbfbf',
        fontSize: 13,
        lineHeight: 18,
    },
    buyTradeActions: {
        flexDirection: 'column',
        gap: 8,
    },
    buyTradeActionBtn: {
        padding: 8,
    },
    buyTradeExpanded: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderTopWidth: 1,
        borderTopColor: '#222',
    },
    buyTradeAvatarImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    investorDetailsSection: {
        marginBottom: 16,
    },
    investorName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    investorUsername: {
        color: '#999',
        fontSize: 14,
        marginBottom: 2,
    },
    investorTime: {
        color: '#666',
        fontSize: 12,
    },
    expandedDescription: {
        color: '#bfbfbf',
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 16,
    },
    imageCarouselContainer: {
        position: 'relative',
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    carouselImage: {
        width: '100%',
        height: 250,
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
    },
    carouselArrow: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -20 }],
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    carouselArrowLeft: {
        left: 12,
    },
    carouselArrowRight: {
        right: 12,
    },
    imageIndicators: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    indicatorActive: {
        backgroundColor: '#fff',
        width: 24,
    },
    imagesScrollContainer: {
        marginBottom: 16,
    },
    imagesScrollContent: {
        gap: 12,
    },
    tradeImage: {
        width: 300,
        height: 200,
        borderRadius: 12,
        backgroundColor: '#1a1a1a',
    },
    buyTradeSection: {
        marginBottom: 16,
    },
    buyTradeSectionTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    buyTradeSectionText: {
        color: '#bfbfbf',
        fontSize: 13,
        lineHeight: 20,
    },
    buyTradeIndustries: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    buyTradeIndustryTag: {
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    buyTradeIndustryText: {
        color: '#fff',
        fontSize: 12,
    },
    buyTradeDetailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },
    buyTradeDetailItem: {
        flex: 1,
        minWidth: '45%',
    },
    buyTradeDetailLabel: {
        color: '#999',
        fontSize: 11,
        marginBottom: 4,
    },
    buyTradeDetailValue: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    buyTradeStats: {
        flexDirection: 'row',
        gap: 16,
    },
    buyTradeStatText: {
        color: '#999',
        fontSize: 12,
    },

    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    emptyTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    emptyText: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
    },

    // Professional Trade Card Styles
    professionalTradeCard: {
        backgroundColor: '#0a0a0a',
        borderRadius: 16,
        marginBottom: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#1a1a1a',
    },
    professionalCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    professionalAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    professionalAvatarText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
    },
    professionalCompanyInfo: {
        flex: 1,
    },
    professionalCompanyName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 2,
    },
    professionalUsername: {
        color: '#999',
        fontSize: 14,
    },
    professionalActions: {
        flexDirection: 'row',
        gap: 12,
    },
    professionalActionBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    professionalDescription: {
        color: '#bfbfbf',
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 16,
    },
    professionalImageContainer: {
        position: 'relative',
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    professionalImage: {
        width: '100%',
        height: 300,
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
    },
    professionalArrow: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -18 }],
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    professionalArrowLeft: {
        left: 16,
    },
    professionalArrowRight: {
        right: 16,
    },
    professionalIndicators: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    professionalDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    professionalDotActive: {
        backgroundColor: '#fff',
        width: 20,
    },
    professionalInfoGrid: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 12,
    },
    professionalInfoItem: {
        flex: 1,
    },
    professionalInfoLabel: {
        color: '#999',
        fontSize: 12,
        marginBottom: 4,
    },
    professionalInfoValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    professionalTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
    },
    professionalTag: {
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    professionalTagText: {
        color: '#bfbfbf',
        fontSize: 12,
    },
    expressInterestButton: {
        backgroundColor: '#4a4a4a',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    expressInterestText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Trading;
