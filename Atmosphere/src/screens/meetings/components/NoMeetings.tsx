import React from 'react';
import { View, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { emptyStyles as styles } from '../Meetings.styles';

/**
 * NoMeetings component - displays empty state when no meetings are available
 */
const NoMeetings = () => (
    <View style={styles.noMeetingsContainer}>
        <MaterialIcons name="videocam-off" size={48} color="#444" />
        <Text style={styles.noMeetingsText}>No meetings found</Text>
    </View>
);

export default NoMeetings;
