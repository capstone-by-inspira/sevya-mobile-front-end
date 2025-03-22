import React, { useEffect, useState } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { BlurView } from "expo-blur";
import { overlay } from 'react-native-paper';


// Wrap Polyline with Animated.createAnimatedComponent to make it an animated component
const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);

const Loader = () => {

  // Animated value for stroke-dashoffset
  const [dashOffset] = useState(new Animated.Value(192));

  useEffect(() => {
    // Start the animation for dash offset
    Animated.loop(
      Animated.timing(dashOffset, {
        toValue: 0,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true, // Important for performance
      })
    ).start();
  }, [dashOffset]); // Add dashOffset as dependency

  return (
    <View style={styles.overlay}>
    <BlurView intensity={20} style={styles.blurContainer}>

    <View style={ styles.loaderContainer}>
      <Svg width={64} height={48}>
        {/* Back polyline */}
        <Polyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          fill="none"
          stroke="#ff4d5033"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Front polyline with animated stroke */}
        <AnimatedPolyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          fill="none"
          stroke="#ff4d4f"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="48, 144"
          strokeDashoffset={dashOffset}
        />
      </Svg>
    </View>
    </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",

  },
  loaderContainer: {
    flex: 1,
    height: "100%", // Full height
    width: "100%", // Full width
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0, // Cover the whole screen
    left: 0,
    right: 0,
    bottom: 0, // Ensure full height
    zIndex: 99,
  },
  overlay:{
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
  }
  
})
export default Loader;