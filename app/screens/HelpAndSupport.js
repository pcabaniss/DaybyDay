import React from "react";
import { Text, View, StyleSheet } from "react-native";
import colors from "../config/colors";

function HelpAndSupport(props) {
  return (
    <View style={styles.container}>
      <Text>
        This screen will hold all the links; FAQ, website, customer service, and
        social media.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default HelpAndSupport;
