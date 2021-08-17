import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

function NewListingButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="calendar-plus"
          color={colors.primary}
          size={50}
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
    borderWidth: 6,
    borderRadius: 20,
    bottom: 20,
    height: 80,
    justifyContent: "center",
    width: 80,
  },
});

export default NewListingButton;
