import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import * as C from "../constants/colors";

/**
 * ProgressBar
 * Props:
 *  current  – current step number (1-based)
 *  total    – total number of steps
 */
export default function ProgressBar({ current, total }) {
  const progress = Math.min(current / total, 1);
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={styles.track}>
      <Animated.View
        style={[
          styles.fill,
          {
            width: widthAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 3,
    backgroundColor: C.BORDER,
    width: "100%",
  },
  fill: {
    height: "100%",
    backgroundColor: C.PRIMARY,
  },
});
