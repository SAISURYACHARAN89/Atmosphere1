import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as DocumentPicker from '@react-native-documents/picker';
import styles from '../Opportunities.styles';

interface RoleCardProps {
    item: any;
    isMyAd?: boolean;
    expanded?: boolean;
    onExpand: () => void;
}

function RoleCard({ item, isMyAd = false, expanded = false, onExpand }: RoleCardProps) {
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [applied, setApplied] = useState(false);
    const [applicantsCount, setApplicantsCount] = useState(item.applicantsCount || 0);
    const [questionAnswers, setQuestionAnswers] = useState<string[]>(
        (item.customQuestions || []).map(() => '')
    );
    const [selectedFile, setSelectedFile] = useState<{ uri: string; name: string } | null>(null);

    const handleFilePick = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.docx],
            });
            if (res && res[0]) {
                setSelectedFile({ uri: res[0].uri, name: res[0].name || 'resume.pdf' });
            }
        } catch (err) {
            if ((DocumentPicker as any).isCancel(err)) {
                // User cancelled
            } else {
                Alert.alert('Error', 'Failed to pick file');
            }
        }
    };

    const cardBg = '#000000';
    const borderColor = '#333';
    const textColor = '#ffffff';
    const subTextColor = '#ffffff';
    const accentColor = '#ffffff';

    const tags = ['AI', 'B2B', 'SaaS', 'Startup'];
    const description = item.description || item.requirements || 'No description provided.';

    const handleSubmit = () => {
        const customQuestions = item.customQuestions || [];
        const hasQuestions = customQuestions.some((q: string) => q?.trim() !== '');
        const answered = questionAnswers.every((ans, i) =>
            customQuestions[i] ? ans.trim() !== '' : true
        );

        if (hasQuestions && !answered) {
            Alert.alert('Error', 'Please answer all questions before submitting.');
            return;
        }

        setApplied(true);
        setApplicantsCount((prev: number) => prev + 1);
        Alert.alert('Success', 'Application sent successfully!');
    };

    return (
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            {/* Header: Company + Badge */}
            <View style={styles.cardHeaderRow}>
                <View style={styles.companyRow}>
                    <View style={styles.companyIcon}>
                        <MaterialIcons name="business" size={20} color="#fff" />
                    </View>
                    <View style={styles.companyInfo}>
                        <View style={styles.companyNameRow}>
                            <Text style={[styles.companyName, { color: accentColor }]} numberOfLines={1}>
                                {item.startupName || item.poster?.displayName || 'Unknown Startup'}
                            </Text>
                            {isMyAd && (
                                <View style={styles.myAdBadge}>
                                    <Text style={styles.myAdText}>My Ad</Text>
                                </View>
                            )}
                        </View>
                        <Text style={[styles.companyType, { color: subTextColor }]}>
                            {item.companyType || item.sector || 'Startup'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Role Title + Location */}
            <View style={styles.roleSection}>
                <Text style={[styles.roleTitle, { color: textColor }]} numberOfLines={2}>
                    {item.roleTitle || item.title}
                </Text>
                <View style={styles.locationRow}>
                    <View style={styles.metaItem}>
                        <MaterialIcons name="place" size={14} color={accentColor} style={{ marginRight: 4 }} />
                        <Text style={[styles.metaText, { color: accentColor }]}>
                            {item.location || item.locationType || 'Remote'}
                        </Text>
                    </View>
                    <Text style={[styles.remoteText, { color: subTextColor }]}>
                        {item.isRemote ? 'Remote' : 'On-site'}
                    </Text>
                </View>
            </View>

            {/* Description */}
            <View style={styles.descContainer}>
                <Text style={[styles.cardDesc, { color: subTextColor }]} numberOfLines={showFullDesc ? undefined : 2}>
                    {description}
                </Text>
                {description.length > 80 && (
                    <TouchableOpacity onPress={() => setShowFullDesc(!showFullDesc)}>
                        <Text style={styles.moreLess}>{showFullDesc ? 'Less' : 'More'}</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Tags */}
            <View style={styles.tagsRow}>
                {tags.map((tag, idx) => (
                    <View key={idx} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                    </View>
                ))}
            </View>

            {/* Footer: Applicants + Employment Type */}
            <View style={[styles.footerRow, { borderTopColor: borderColor }]}>
                <TouchableOpacity onPress={onExpand} style={styles.applicantsBtn}>
                    <Text style={[styles.chevron, { transform: [{ rotate: expanded ? '180deg' : '0deg' }] }]}>▼</Text>
                    <Text style={[styles.applicantsText, { color: subTextColor }]}>
                        {applicantsCount} applicants
                    </Text>
                </TouchableOpacity>
                <Text style={[styles.employmentText, { color: textColor }]}>
                    {item.employmentType || 'Full-time'} • {item.isRemote ? 'Remote' : 'On-site'}
                </Text>
            </View>

            {/* Expanded Application Section */}
            {expanded && (
                <View style={styles.expandedSectionInline}>
                    {!applied ? (
                        <>
                            {/* Custom Questions */}
                            {(item.customQuestions || []).map((q: string, i: number) => (
                                <View key={i} style={styles.questionContainerInline}>
                                    <Text style={styles.questionLabelBold}>{q}</Text>
                                    <TextInput
                                        style={styles.questionInputDark}
                                        placeholder="Your answer..."
                                        placeholderTextColor="#666"
                                        value={questionAnswers[i]}
                                        onChangeText={(text) => {
                                            const updated = [...questionAnswers];
                                            updated[i] = text;
                                            setQuestionAnswers(updated);
                                        }}
                                        multiline
                                        textAlignVertical="top"
                                    />
                                </View>
                            ))}

                            {/* File Upload */}
                            <View style={styles.uploadContainerInline}>
                                <Text style={styles.uploadLabelBold}>
                                    Attach Resume (Optional)
                                </Text>
                                <View style={styles.fileChooserRow}>
                                    <TouchableOpacity style={styles.fileChooserBtn} onPress={handleFilePick}>
                                        <Text style={styles.fileChooserBtnText}>Choose File</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.noFileText}>
                                        {selectedFile ? selectedFile.name : 'No file chosen'}
                                    </Text>
                                </View>
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity style={styles.sendBtnDark} onPress={handleSubmit}>
                                <Text style={styles.sendBtnText}>Send Application</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View style={styles.appliedContainer}>
                            <Text style={styles.appliedText}>✓ Application Sent Successfully</Text>
                            <Text style={[styles.appliedSubtext, { color: subTextColor }]}>
                                You can track your application in My Jobs
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

export default RoleCard;
