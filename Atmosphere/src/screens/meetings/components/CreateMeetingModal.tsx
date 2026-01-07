import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Modal,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CreateMeetingForm } from '../types';
import { formatAMPM, INDUSTRY_TAGS, getDefaultCreateForm } from '../utils';
import { modalStyles as styles } from '../Meetings.styles';
import { getBaseUrl } from '../../../lib/config';

// Import DateTimePicker
const DateTimePicker = require('@react-native-community/datetimepicker').default;

type CreateMeetingModalProps = {
    visible: boolean;
    onClose: () => void;
    onCreateSuccess: () => void;
    token: string | null;
};

/**
 * CreateMeetingModal - Modal form for creating a new meeting
 */
const CreateMeetingModal = ({ visible, onClose, onCreateSuccess, token }: CreateMeetingModalProps) => {
    const [createForm, setCreateForm] = useState<CreateMeetingForm>(getDefaultCreateForm());

    // Date Picker State
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateMode, setDateMode] = useState<'date' | 'time'>('date');
    const [dateField, setDateField] = useState<'start' | 'end'>('start');

    // Participant Search State
    const [participantQuery, setParticipantQuery] = useState('');
    const [participantResults, setParticipantResults] = useState<any[]>([]);
    const [searchingParticipants, setSearchingParticipants] = useState(false);
    const [selectedParticipants, setSelectedParticipants] = useState<any[]>([]);

    // Search Users Debounce
    useEffect(() => {
        if (!participantQuery.trim()) {
            setParticipantResults([]);
            return;
        }
        const delay = setTimeout(async () => {
            setSearchingParticipants(true);
            try {
                const baseUrl = await getBaseUrl();
                const res = await fetch(`${baseUrl}/api/users/search?q=${encodeURIComponent(participantQuery)}`);
                if (res.ok) {
                    const data = await res.json();
                    const filtered = (data.users || []).filter((u: any) => !selectedParticipants.some(sp => sp._id === u._id));
                    setParticipantResults(filtered);
                }
            } catch (e) {
                console.error('User search failed', e);
            } finally {
                setSearchingParticipants(false);
            }
        }, 500);
        return () => clearTimeout(delay);
    }, [participantQuery, selectedParticipants]);

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate && event.type !== 'dismissed') {
            if (dateField === 'start') {
                setCreateForm(prev => {
                    const newStart = new Date(selectedDate);
                    let newEnd = prev.endScheduledAt;
                    if (newEnd <= newStart) {
                        newEnd = new Date(newStart.getTime() + 3600000);
                    }
                    return { ...prev, scheduledAt: newStart, endScheduledAt: newEnd };
                });
            } else {
                setCreateForm(prev => ({ ...prev, endScheduledAt: selectedDate }));
            }
        }
    };

    const openDatePicker = (field: 'start' | 'end', mode: 'date' | 'time') => {
        setDateField(field);
        setDateMode(mode);
        setShowDatePicker(true);
    };

    const addParticipant = (user: any) => {
        setSelectedParticipants(prev => [...prev, user]);
        setParticipantResults(prev => prev.filter(u => u._id !== user._id));
        setParticipantQuery('');
    };

    const removeParticipant = (userId: string) => {
        setSelectedParticipants(prev => prev.filter(u => u._id !== userId));
    };

    const handleCreateMeeting = async () => {
        try {
            const { title, description, scheduledAt, endScheduledAt, location, meetingType, category, pitchDuration, participantType, verifiedOnly, industries, maxParticipants } = createForm;
            if (!title) {
                // Use native alert for simplicity
                return;
            }
            const diffMs = endScheduledAt.getTime() - scheduledAt.getTime();
            if (diffMs <= 0) {
                return;
            }
            const duration = Math.ceil(diffMs / 60000);

            const baseUrl = await getBaseUrl();
            if (!token) {
                return;
            }

            const headers: any = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
            const res = await fetch(`${baseUrl}/api/meetings`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    title,
                    description,
                    scheduledAt: scheduledAt.toISOString(),
                    startTime: scheduledAt.toISOString(),
                    endTime: endScheduledAt.toISOString(),
                    duration,
                    location,
                    participants: selectedParticipants.map(p => ({ userId: p._id, status: 'invited' })),
                    meetingType,
                    category: category || undefined,
                    pitchDuration,
                    participantType,
                    verifiedOnly,
                    industries,
                    maxParticipants,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to create meeting');
            }

            // Reset form
            setCreateForm(getDefaultCreateForm());
            setSelectedParticipants([]);
            onCreateSuccess();
            onClose();
        } catch (err) {
            console.error('Create meeting error:', err);
        }
    };

    const handleClose = () => {
        setCreateForm(getDefaultCreateForm());
        setSelectedParticipants([]);
        onClose();
    };

    return (
        <>
            <Modal visible={visible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Launch Meeting</Text>
                            <TouchableOpacity onPress={handleClose}>
                                <MaterialIcons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalForm} contentContainerStyle={{ paddingBottom: 40 }}>
                            <Text style={styles.label}>Title *</Text>
                            <TextInput
                                value={createForm.title}
                                onChangeText={(v) => setCreateForm(prev => ({ ...prev, title: v }))}
                                style={styles.input}
                                placeholder="Meeting title"
                                placeholderTextColor="#666"
                            />

                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                value={createForm.description}
                                onChangeText={(v) => setCreateForm(prev => ({ ...prev, description: v }))}
                                style={[styles.input, styles.textArea]}
                                placeholder="Add a description for your meeting..."
                                placeholderTextColor="#666"
                                multiline
                                numberOfLines={3}
                            />

                            {/* Meeting Type */}
                            <Text style={styles.label}>Type</Text>
                            <View style={styles.typeRow}>
                                <TouchableOpacity
                                    style={[styles.typeBtn, createForm.meetingType === 'public' && styles.typeBtnActive]}
                                    onPress={() => setCreateForm(prev => ({ ...prev, meetingType: 'public' }))}
                                >
                                    <Text style={[styles.typeBtnText, createForm.meetingType === 'public' && styles.typeBtnTextActive]}>Public</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.typeBtn, createForm.meetingType === 'private' && styles.typeBtnActive]}
                                    onPress={() => setCreateForm(prev => ({ ...prev, meetingType: 'private' }))}
                                >
                                    <Text style={[styles.typeBtnText, createForm.meetingType === 'private' && styles.typeBtnTextActive]}>Private</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Category (for public meetings) */}
                            {createForm.meetingType === 'public' && (
                                <>
                                    <Text style={styles.label}>Category</Text>
                                    <View style={styles.typeRow}>
                                        <TouchableOpacity
                                            style={[styles.typeBtn, createForm.category === 'pitch' && styles.typeBtnActive]}
                                            onPress={() => setCreateForm(prev => ({ ...prev, category: 'pitch' }))}
                                        >
                                            <Text style={[styles.typeBtnText, createForm.category === 'pitch' && styles.typeBtnTextActive]}>Pitch Meeting</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.typeBtn, createForm.category === 'networking' && styles.typeBtnActive]}
                                            onPress={() => setCreateForm(prev => ({ ...prev, category: 'networking' }))}
                                        >
                                            <Text style={[styles.typeBtnText, createForm.category === 'networking' && styles.typeBtnTextActive]}>Networking</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}

                            {/* Pitch Settings (for pitch meetings only) */}
                            {createForm.meetingType === 'public' && createForm.category === 'pitch' && (
                                <>
                                    <Text style={styles.label}>Time per pitch: {createForm.pitchDuration} min</Text>
                                    <View style={styles.sliderRow}>
                                        <Text style={styles.sliderLabel}>1</Text>
                                        <View style={styles.sliderContainer}>
                                            <View style={[styles.sliderTrack, { width: `${(createForm.pitchDuration / 60) * 100}%` }]} />
                                        </View>
                                        <Text style={styles.sliderLabel}>60</Text>
                                    </View>
                                    <View style={styles.sliderBtns}>
                                        <TouchableOpacity onPress={() => setCreateForm(prev => ({ ...prev, pitchDuration: Math.max(1, prev.pitchDuration - 5) }))} style={styles.sliderBtn}>
                                            <MaterialIcons name="remove" size={16} color="#fff" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setCreateForm(prev => ({ ...prev, pitchDuration: Math.min(60, prev.pitchDuration + 5) }))} style={styles.sliderBtn}>
                                            <MaterialIcons name="add" size={16} color="#fff" />
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={styles.label}>Participants</Text>
                                    <View style={styles.typeRow}>
                                        {(['all', 'startups', 'investors'] as const).map(type => (
                                            <TouchableOpacity
                                                key={type}
                                                style={[styles.typeBtn, styles.typeBtnSmall, createForm.participantType === type && styles.typeBtnActive]}
                                                onPress={() => setCreateForm(prev => ({ ...prev, participantType: type }))}
                                            >
                                                <Text style={[styles.typeBtnText, createForm.participantType === type && styles.typeBtnTextActive]}>
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    <View style={styles.checkRow}>
                                        <Text style={styles.label}>Verified Only</Text>
                                        <TouchableOpacity
                                            style={[styles.checkbox, createForm.verifiedOnly && styles.checkboxActive]}
                                            onPress={() => setCreateForm(prev => ({ ...prev, verifiedOnly: !prev.verifiedOnly }))}
                                        >
                                            {createForm.verifiedOnly && <MaterialIcons name="check" size={16} color="#000" />}
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}

                            {/* Industries */}
                            <Text style={styles.label}>Industries (max 3)</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.industriesScroll}>
                                {INDUSTRY_TAGS.map(tag => (
                                    <TouchableOpacity
                                        key={tag}
                                        style={[styles.formIndustryTag, createForm.industries.includes(tag) && styles.formIndustryTagActive]}
                                        onPress={() => {
                                            setCreateForm(prev => {
                                                if (prev.industries.includes(tag)) {
                                                    return { ...prev, industries: prev.industries.filter(t => t !== tag) };
                                                } else if (prev.industries.length < 3) {
                                                    return { ...prev, industries: [...prev.industries, tag] };
                                                }
                                                return prev;
                                            });
                                        }}
                                        disabled={!createForm.industries.includes(tag) && createForm.industries.length >= 3}
                                    >
                                        <Text style={[styles.formIndustryTagText, createForm.industries.includes(tag) && styles.formIndustryTagTextActive]}>{tag}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Max Participants */}
                            <Text style={styles.label}>Max participants: {createForm.maxParticipants}</Text>
                            <View style={styles.sliderBtns}>
                                <TouchableOpacity onPress={() => setCreateForm(prev => ({ ...prev, maxParticipants: Math.max(5, prev.maxParticipants - 5) }))} style={styles.sliderBtn}>
                                    <MaterialIcons name="remove" size={16} color="#fff" />
                                </TouchableOpacity>
                                <Text style={styles.sliderValue}>{createForm.maxParticipants}</Text>
                                <TouchableOpacity onPress={() => setCreateForm(prev => ({ ...prev, maxParticipants: Math.min(100, prev.maxParticipants + 5) }))} style={styles.sliderBtn}>
                                    <MaterialIcons name="add" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.label}>Start Time *</Text>
                            <View style={styles.dateRow}>
                                <TouchableOpacity onPress={() => openDatePicker('start', 'date')} style={styles.dateBtn}>
                                    <Text style={styles.dateText}>{createForm.scheduledAt.toLocaleDateString()}</Text>
                                    <MaterialIcons name="calendar-today" size={16} color="#888" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => openDatePicker('start', 'time')} style={styles.dateBtn}>
                                    <Text style={styles.dateText}>{formatAMPM(createForm.scheduledAt)}</Text>
                                    <MaterialIcons name="access-time" size={16} color="#888" />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.label}>End Time *</Text>
                            <View style={styles.dateRow}>
                                <TouchableOpacity onPress={() => openDatePicker('end', 'date')} style={styles.dateBtn}>
                                    <Text style={styles.dateText}>{createForm.endScheduledAt.toLocaleDateString()}</Text>
                                    <MaterialIcons name="calendar-today" size={16} color="#888" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => openDatePicker('end', 'time')} style={styles.dateBtn}>
                                    <Text style={styles.dateText}>{formatAMPM(createForm.endScheduledAt)}</Text>
                                    <MaterialIcons name="access-time" size={16} color="#888" />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.label}>Participants</Text>
                            {selectedParticipants.length > 0 && (
                                <View style={styles.chipsContainer}>
                                    {selectedParticipants.map(u => (
                                        <View key={u._id} style={styles.chip}>
                                            <Text style={styles.chipText}>{u.displayName || u.username}</Text>
                                            <TouchableOpacity onPress={() => removeParticipant(u._id)}>
                                                <MaterialIcons name="close" size={16} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            )}

                            <TextInput
                                value={participantQuery}
                                onChangeText={setParticipantQuery}
                                style={styles.input}
                                placeholder="Search & Add Participants..."
                                placeholderTextColor="#666"
                            />
                            {participantResults.length > 0 && (
                                <View style={styles.searchResults}>
                                    {participantResults.map(u => (
                                        <TouchableOpacity key={u._id} style={styles.searchResultItem} onPress={() => addParticipant(u)}>
                                            <Text style={styles.searchResultText}>{u.displayName || u.username}</Text>
                                            <MaterialIcons name="add" size={20} color="#888" />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                            {searchingParticipants && <ActivityIndicator size="small" color="#22c55e" style={{ marginTop: 8 }} />}

                            <Text style={styles.label}>Location</Text>
                            <TextInput
                                value={createForm.location}
                                onChangeText={(v) => setCreateForm(prev => ({ ...prev, location: v }))}
                                style={styles.input}
                                placeholder="Office, Online, etc."
                                placeholderTextColor="#666"
                            />

                            <TouchableOpacity style={styles.createBtn} onPress={handleCreateMeeting}>
                                <Text style={styles.createBtnText}>Launch Meeting</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {showDatePicker && (
                <DateTimePicker
                    value={dateField === 'start' ? createForm.scheduledAt : createForm.endScheduledAt}
                    mode={dateMode}
                    is24Hour={false}
                    display="default"
                    onChange={onDateChange}
                />
            )}
        </>
    );
};

export default CreateMeetingModal;
