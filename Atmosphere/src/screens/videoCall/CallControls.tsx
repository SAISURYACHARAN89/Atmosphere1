import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CallControlsProps } from './types';
import { styles } from './styles';

/**
 * CallControls - Video call control buttons (mic, video, camera switch, leave)
 */
const CallControls: React.FC<CallControlsProps> = ({
    micMuted,
    videoMuted,
    onToggleMic,
    onToggleVideo,
    onSwitchCamera,
    onLeave,
}) => {
    return (
        <View style={styles.controlsContainer}>
            <TouchableOpacity
                style={[styles.controlButton, micMuted && styles.controlButtonActive]}
                onPress={onToggleMic}
            >
                <MaterialIcons name={micMuted ? 'mic-off' : 'mic'} size={28} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.controlButton, videoMuted && styles.controlButtonActive]}
                onPress={onToggleVideo}
            >
                <MaterialIcons name={videoMuted ? 'videocam-off' : 'videocam'} size={28} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={onSwitchCamera}>
                <MaterialIcons name="flip-camera-android" size={28} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.controlButton, styles.leaveButton]} onPress={onLeave}>
                <MaterialIcons name="call-end" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

export default CallControls;
