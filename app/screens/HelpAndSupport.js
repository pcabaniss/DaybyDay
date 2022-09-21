import React from "react";
import { Text, View, StyleSheet, Linking, Alert } from "react-native";
import LottieView from "lottie-react-native";

import colors from "../config/colors";
import AppButton from "../components/AppButton";

function HelpAndSupport(props) {
  const website = "https://dxdapp.net";

  const openWebsite = async () => {
    const supported = await Linking.canOpenURL(website);

    if (supported) {
      await Linking.openURL(website);
    } else {
      Alert.alert(
        "There was a problem loading the site.",
        "Sorry for the inconvenience, please try again later.",
        [{ text: "OK", style: "cancel" }]
      );
    }
  };

  const testing = () => {
    const test = "phillip.cabaniss@gmail.com";

    const temp = test.split(".").join("-");
    console.log(temp);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {" "}
        Check out our website for any problems you're experiencing.
      </Text>
      <Text style={styles.regText}>
        We have troubleshooting docs to walk you through common issues. If
        you're still having issues, please fill out a contact form and we will
        get back to you ASAP.
      </Text>
      <AppButton
        title={"Visit the site"}
        color={colors.green}
        onPress={() => openWebsite()}
      />
      <LottieView
        source={require("../assets/animations/questions.json")}
        loop
        autoPlay
        style={{
          width: 400,
          height: 400,
          justifyContent: "center",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    padding: 5,
    textAlign: "center",
  },
  regText: {
    fontSize: 15,
    padding: 5,
    textAlign: "center",
    paddingBottom: 20,
  },
});

export default HelpAndSupport;
