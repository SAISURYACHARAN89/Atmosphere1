import React from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    Dimensions,
    Animated,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { AlertTriangle, Info, X, CheckCircle, XCircle } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AlertAction {
    label: string;
    onPress?: () => void;
    variant?: 'primary' | 'secondary';
}

interface CustomAlertProps {
    visible: boolean;
    type?: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message?: string;
    onClose: () => void;
    actions?: AlertAction[];
    compact?: boolean;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
    visible,
    type = 'info',
    title,
    message,
    onClose,
    actions,
    compact = true,
}) => {
    const [fadeAnim] = React.useState(new Animated.Value(0));
    const [slideAnim] = React.useState(new Animated.Value(-50));

    React.useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 100,
                    friction: 10,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto-dismiss compact alerts after 2.5 seconds
            if (compact && !actions?.length) {
                const timer = setTimeout(() => {
                    handleClose();
                }, 2500);
                return () => clearTimeout(timer);
            }
        } else {
            fadeAnim.setValue(0);
            slideAnim.setValue(-50);
        }
    }, [visible]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: -50,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
        });
    };

    const getIcon = () => {
        const iconSize = compact ? 20 : 28;
        switch (type) {
            case 'success':
                return <CheckCircle size={iconSize} color="#22c55e" />;
            case 'warning':
                return <AlertTriangle size={iconSize} color="#f59e0b" />;
            case 'error':
                return <XCircle size={iconSize} color="#ef4444" />;
            default:
                return <Info size={iconSize} color="#3b82f6" />;
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success':
                return '#22c55e';
            case 'error':
                return '#ef4444';
            case 'warning':
                return '#f59e0b';
            default:
                return '#3b82f6';
        }
    };

    if (!visible) return null;

    // Compact toast-style alert using Modal
    if (compact) {
        return (
            <Modal
                visible={visible}
                transparent
                animationType="none"
                onRequestClose={handleClose}
            >
                <TouchableWithoutFeedback onPress={handleClose}>
                    <View style={styles.compactOverlay}>
                        <TouchableWithoutFeedback>
                            <Animated.View
                                style={[
                                    styles.compactContainer,
                                    {
                                        opacity: fadeAnim,
                                        transform: [{ translateY: slideAnim }],
                                        borderLeftColor: getBorderColor(),
                                    },
                                ]}
                            >
                                <View style={styles.compactContent}>
                                    <View style={styles.compactIconWrap}>{getIcon()}</View>
                                    <View style={styles.compactTextWrap}>
                                        {title && <Text style={styles.compactTitle}>{title}</Text>}
                                        {message && <Text style={styles.compactMessage}>{message}</Text>}
                                    </View>
                                    <TouchableOpacity onPress={handleClose} style={styles.compactClose}>
                                        <X size={16} color="#666" />
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }

    // Full modal alert (legacy)
    const handleAction = (action: AlertAction) => {
        if (action.onPress) {
            action.onPress();
        }
        handleClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <Animated.View style={[styles.alertContainer, { opacity: fadeAnim }]}>
                    <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                        <X size={18} color="#666" />
                    </TouchableOpacity>

                    <View style={[styles.iconContainer, { borderColor: getBorderColor() }]}>
                        {getIcon()}
                    </View>

                    {title && <Text style={styles.title}>{title}</Text>}
                    {message && <Text style={styles.message}>{message}</Text>}

                    {actions && actions.length > 0 ? (
                        <View style={styles.actionsRow}>
                            {actions.map((action, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.actionBtn,
                                        action.variant === 'secondary'
                                            ? styles.actionBtnSecondary
                                            : styles.actionBtnPrimary,
                                    ]}
                                    onPress={() => handleAction(action)}
                                >
                                    <Text
                                        style={[
                                            styles.actionBtnText,
                                            action.variant === 'secondary'
                                                ? styles.actionBtnTextSecondary
                                                : styles.actionBtnTextPrimary,
                                        ]}
                                    >
                                        {action.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.actionBtnPrimary, styles.singleBtn]}
                            onPress={handleClose}
                        >
                            <Text style={[styles.actionBtnText, styles.actionBtnTextPrimary]}>OK</Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    // Compact toast styles
    compactOverlay: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 80,
    },
    compactContainer: {
        width: SCREEN_WIDTH - 32,
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
    },
    compactContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    compactIconWrap: {
        marginRight: 12,
    },
    compactTextWrap: {
        flex: 1,
    },
    compactTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    compactMessage: {
        color: '#999',
        fontSize: 13,
        marginTop: 2,
    },
    compactClose: {
        padding: 6,
        marginLeft: 8,
    },
    // Full modal styles
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertContainer: {
        width: SCREEN_WIDTH * 0.85,
        maxWidth: 340,
        backgroundColor: '#111',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    closeBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        padding: 4,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 2,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        color: '#888',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionBtn: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    actionBtnPrimary: {
        backgroundColor: '#fff',
    },
    actionBtnSecondary: {
        backgroundColor: '#333',
    },
    actionBtnText: {
        fontSize: 14,
        fontWeight: '600',
    },
    actionBtnTextPrimary: {
        color: '#000',
    },
    actionBtnTextSecondary: {
        color: '#fff',
    },
    singleBtn: {
        marginTop: 4,
    },
});

export default CustomAlert;
