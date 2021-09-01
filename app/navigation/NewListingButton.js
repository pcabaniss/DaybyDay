import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

function NewListingButton({ onPress, color }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="calendar-text"
          color={color}
          size={45}
          borderRadius={15}
          borderColor={colors.black}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",

    backgroundColor: colors.white,
    borderColor: colors.black,
    borderWidth: 4,
    borderRadius: 20,
    height: 75,
    bottom: -5,
    justifyContent: "center",
    width: 75,
  },
  text: {
    fontSize: 10,
  },
});

export default NewListingButton;
