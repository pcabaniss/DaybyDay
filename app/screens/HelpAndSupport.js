import React from "react";
import { Text, View, StyleSheet, Linking, Alert } from "react-native";
import LottieView from "lottie-react-native";

import colors from "../config/colors";
import AppButton from "../components/AppButton";
import listings from "../api/listings";
import moment from "moment";

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
      <AppButton
        title={"Test the event rig"}
        color={colors.red}
        onPress={() =>
          console.log(
            moment("2022-09-30T03:54").format("YYYY-MM-DDTHH:mm:ss.sssZ")
          )
        }
      />
    </View>
  );
}
/**
  Object {
  "dateClicked": "2022-09-28",
  "description": "Fdsafdasfsafadsf",
  "timeFinish": "Mon Sep 26 2022 04:13:00 GMT-0500 (CDT)",
  "timeStart": "Mon Sep 26 2022 03:15:00 GMT-0500 (CDT)",
  "title": "Fsfdsfadsffdsaf",
}
03:15 AM
   */
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
