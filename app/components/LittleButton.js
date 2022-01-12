import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../config/colors";

function LittleButton({ onPress, title, fontColor, backgroundColor }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: backgroundColor,
        height: 60,
        width: 140,
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        borderWidth: 3,
        borderColor: colors.dark,
      }}
    >
      <Text
        style={{
          letterSpacing: 1,
          color: fontColor,
          fontWeight: "300",
          fontSize: 20,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 100,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LittleButton;
