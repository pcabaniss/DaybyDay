import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  PermissionsAndroid,
  Alert,
} from "react-native";
import LottieView from "lottie-react-native";
import { requestBackgroundPermissionsAsync } from "expo-location";

import AppButton from "../components/AppButton";
import colors from "../config/colors";

function WelcomeScreen({ navigation }) {
  const requestBGPermission = () => {
    Alert.alert(
      "Background location disclosure:",
      "Day by Day collects your location data to enable more accurate scheduling and reminders even when the app is closed or not in use. None of this data is stored.",
      [
        {
          text: "I understand.",
          onPress: () => requestBackgroundPermissionsAsync(),
        },
      ]
    );
  };

  const getPermissions = async (screenName) => {
    const bgResult = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
    );

    if (bgResult == false) {
      requestBGPermission();
    }

    navigation.navigate(screenName);
  };

  return (
    <View style={styles.background}>
      <Text style={styles.tagline}>Schedule some peace of mind</Text>
      <View style={styles.logoContainer}>
        <LottieView
          source={require("../assets/animations/loginAnim.json")}
          loop
          autoPlay
          style={{ width: 400, height: 400, justifyContent: "center" }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <AppButton
          title="Login"
          onPress={() => getPermissions("Login")}
          color={colors.primaryDark}
        />
        <AppButton
          title="Register"
          onPress={() => getPermissions("Registration")}
          color={colors.green}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  buttonContainer: {
    padding: 20,
    width: "100%",
  },
  logo: {
    width: 500,
    height: 300,
    justifyContent: "center",
  },
  logoContainer: {
    //position: "absolute",
    //top: 200,
    alignSelf: "center",
  },
  tagline: {
    color: "#00171f",
    fontSize: 25,
    fontWeight: "700",
    paddingBottom: 50,
    //paddingVertical: 20,
  },
});

export default WelcomeScreen;
