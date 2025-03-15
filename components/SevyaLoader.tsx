import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur'; // Install expo-blur

const { width, height } = Dimensions.get('window');

const Loader = ({ visible, size = 'large', color = '#007AFF' }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      );

      spinAnimation.start();

      return () => spinAnimation.stop();
    }
  }, [spinValue, visible]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 50;
      default:
        return 30;
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <BlurView style={styles.blur} intensity={80} />
      <View style={styles.loaderContainer}>
        <Animated.View
          style={{
            width: getSize(),
            height: getSize(),
            borderRadius: getSize() / 2,
            borderWidth: getSize() / 10,
            borderColor: color,
            borderTopColor: 'transparent',
            transform: [{ rotate: spin }],
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 11,
  },
});

export default Loader;