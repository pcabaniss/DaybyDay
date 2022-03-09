import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Animated } from "react-native";

function PercentageBar({ starText, percentage }) {
  const [animation] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(animation, {
      toValue: percentage,
      duration: 500,
    }).start();
  }, [percentage]);
  return (
    <View style={{ flexDirection: "row" }}>
      <Text style={styles.progressText}>{starText}</Text>
      <View style={styles.progressMiddle}>
        <View style={styles.progressWrap}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: animation.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>
      <Text style={styles.progressPercentText}>{percentage}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progressText: {
    width: 50,
    fontSize: 14,
    color: "#2A5BDA",
  },
  progressPercentText: { width: 40, fontSize: 14, color: "#323357" },
  progressMiddle: {
    height: 15,
    flex: 1,
    marginHorizontal: 10,
  },
  progressWrap: {
    backgroundColor: "#F5F8FF",
    borderRadius: 18,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    padding: 2,
  },
  progressBar: {
    flex: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#ffcc48",
    shadowOpacity: 1.0,
    shadowRadius: 4,
    backgroundColor: "#FFCC48",
    borderRadius: 18,
    minWidth: 5,
  },
});

export default PercentageBar;
