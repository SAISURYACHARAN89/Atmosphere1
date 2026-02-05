import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withSpring,
    withDelay,
    runOnJS,
    Easing
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
    onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    // Shared values for animation
    const containerOpacity = useSharedValue(1);

    useEffect(() => {
        // Just show logo static, then fade out container after 0.5s
        containerOpacity.value = withDelay(500, withTiming(0, { duration: 500 }, (finished) => {
            if (finished) {
                runOnJS(onFinish)();
            }
        }));
    }, []);

    const containerStyle = useAnimatedStyle(() => {
        return {
            opacity: containerOpacity.value
        };
    });

    return (
        <Animated.View style={[styles.container, containerStyle]}>
            <View style={styles.logoContainer}>
                {/* Replace with your actual App Logo */}
                <Image
                    source={require('../../assets/Atmosphere_icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            <Text style={styles.title}>Atmosphere</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000000', // Match app background theme
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999, // Ensure it sits on top of everything
    },
    logoContainer: {
        width: width * 0.4,
        height: width * 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    logo: {
        width: '100%',
        height: '100%',
        borderRadius: 35, // Rounded corners
    },
    title: {
        fontSize: 32,
        fontFamily: 'Pacifico-Regular',
        color: '#fff',
        marginTop: 20,
        textAlign: 'center',
    }
});

export default SplashScreen;
