import React from "react";
import { ImageBackground, StyleSheet, View, Image, Text } from "react-native";
import LottieView from "lottie-react-native";

import AppButton from "../components/AppButton";
import colors from "../config/colors";

function WelcomeScreen({ navigation }) {
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
          onPress={() => navigation.navigate("Login")}
          color={colors.primaryDark}
        />
        <AppButton
          title="Register"
          onPress={() => navigation.navigate("Registration")}
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
