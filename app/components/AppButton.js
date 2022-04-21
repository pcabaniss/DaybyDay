import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../config/colors";

function AppButton({ title, onPress, color }) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: color,
        borderRadius: 25,
        justifyContent: "flex-end",
        alignItems: "center",
        alignSelf: "center",
        padding: 15,
        width: "98%",
        marginVertical: 10,
      }}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.white,
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default AppButton;
