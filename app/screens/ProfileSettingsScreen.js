import React from "react";
import { Text, View, StyleSheet } from "react-native";
import colors from "../config/colors";

function ProfileSettingsScreen(props) {
  return (
    <View style={styles.container}>
      <Text>This is the My Profile Setting Screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default ProfileSettingsScreen;
