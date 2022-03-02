import React from "react";
import { ImageBackground, StyleSheet, View, Image, Text } from "react-native";

import AppButton from "../components/AppButton";
import colors from "../config/colors";

function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      style={styles.background}
      blurRadius={7}
      source={require("../assets/mainPic.jpg")}
    >
      <View style={styles.logoContainer}>
        <Image style={styles.logo} />
        <Text style={styles.tagline}>Day X Day</Text>
      </View>
      <View style={styles.buttonContainer}>
        <AppButton
          title="Login"
          onPress={() => navigation.navigate("Login")}
          color={colors.blue}
        />
        <AppButton
          title="Register"
          onPress={() => navigation.navigate("Registration")}
          color={colors.orange}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: colors.blue,
  },
  buttonContainer: {
    padding: 20,
    width: "100%",
  },
  logo: {
    width: 200,
    height: 200,
  },
  logoContainer: {
    position: "absolute",
    top: 100,
    alignItems: "center",
  },
  tagline: {
    color: "#00171f",
    fontSize: 30,
    fontWeight: "700",
    paddingVertical: 20,
  },
});

export default WelcomeScreen;
