import React from "react";
import { View, StyleSheet, Text, Linking, Alert } from "react-native";
import AppButton from "../components/AppButton";
import colors from "../config/colors";

function DataPrivacyScreen(props) {
  const policy =
    "https://app.termly.io/document/privacy-policy/8b571077-2855-4e8c-8bee-4d1abb5cc555";

  const openPolicy = async () => {
    const supported = await Linking.canOpenURL(policy);

    if (supported) {
      await Linking.openURL(policy);
    } else {
      Alert.alert(
        "There was a problem loading the site.",
        "Sorry for the inconvenience, please try again later.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        View our pivacy policy by following this link:
      </Text>
      <AppButton
        color={colors.primaryDark}
        title="Privacy Policy"
        onPress={openPolicy}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  heading: {
    fontSize: 20,
    padding: 5,
  },
});

export default DataPrivacyScreen;
