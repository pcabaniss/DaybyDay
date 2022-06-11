import React from "react";
import { View, StyleSheet, Text } from "react-native";
import colors from "../config/colors";

function DataPrivacyScreen(props) {
  return (
    <View style={styles.container}>
      <Text>This is the privacy screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
});

export default DataPrivacyScreen;
