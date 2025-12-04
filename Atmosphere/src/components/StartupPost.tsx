import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';

type Company = {
    id: string;
    name: string;
    tagline: string;
    brief: string;
    logo: string;
    revenueGenerating: boolean;
    fundsRaised: string;
    currentInvestors: string[];
    lookingToDilute: boolean;
    dilutionAmount?: string;
    images: string[];
};

const StartupPost = ({ company }: { company: Company }) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(349);
    const { theme } = React.useContext(ThemeContext);

    const toggleLike = () => {
        setLiked((v) => {
            setLikes((l) => (v ? l - 1 : l + 1));
            return !v;
        });
    };

    return (
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <View style={styles.header}>
                <Image source={{ uri: company.logo }} style={styles.avatar} />
                <View style={styles.headerMain}>
                    <Text style={[styles.companyName, { color: theme.text }]}>{company.name}</Text>
                    <Text style={[styles.subtle, { color: theme.placeholder }]}>Verified startup</Text>
                </View>
                <TouchableOpacity style={[styles.followBtn, { backgroundColor: theme.primary }]} onPress={() => { }}>
                    <Text style={styles.followBtnText}>Follow</Text>
                </TouchableOpacity>
            </View>

            <Image source={{ uri: company.images[0] }} style={styles.mainImage} />

            <View style={styles.actionsRow}>
                <TouchableOpacity onPress={toggleLike} style={styles.actionBtn}>
                    <Text style={[styles.heart, { color: liked ? 'red' : theme.placeholder }]}>❤</Text>
                    <Text style={[styles.actionCount, { color: theme.text }]}>{likes}</Text>
                </TouchableOpacity>

                <View style={styles.spacer12} />

                <TouchableOpacity style={styles.actionBtn}>
                    <Text style={[styles.icon, { color: theme.placeholder }]}>💬</Text>
                    <Text style={[styles.actionCount, { color: theme.text }]}>32</Text>
                </TouchableOpacity>

                <View style={styles.flex1} />

                <TouchableOpacity style={styles.actionBtn}>
                    <Text style={[styles.icon, { color: theme.placeholder }]}>🔖</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.body}>
                <Text style={[styles.brief, { color: theme.text }]} numberOfLines={2}>{company.brief}</Text>
            </View>

            <View style={styles.infoRow}>
                <View style={styles.infoBox}><Text style={{ color: theme.text }}>{company.revenueGenerating ? 'Rvnu' : 'Pre-rvnu'}</Text></View>
                <View style={styles.infoBox}><Text style={{ color: theme.text }}>Rounds: 2</Text></View>
                <View style={styles.infoBox}><Text style={{ color: theme.text }}>Age: 2 yr</Text></View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: { borderWidth: 1, borderRadius: 8, paddingBottom: 12, marginVertical: 8, overflow: 'hidden' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 12 },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
    headerMain: { flex: 1 },
    companyName: { fontWeight: '700' },
    subtle: { fontSize: 12 },
    followBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
    mainImage: { width: '100%', height: 200, backgroundColor: '#222' },
    actionsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 8 },
    actionBtn: { flexDirection: 'row', alignItems: 'center' },
    actionCount: { marginLeft: 6 },
    spacer12: { width: 12 },
    flex1: { flex: 1 },
    heart: { fontSize: 18 },
    icon: { fontSize: 16 },
    body: { paddingHorizontal: 12, paddingTop: 8 },
    brief: { fontSize: 14 },
    infoRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingTop: 8 },
    infoBox: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, borderWidth: 1 },
    followBtnText: { color: '#fff' },
});

export default StartupPost;
