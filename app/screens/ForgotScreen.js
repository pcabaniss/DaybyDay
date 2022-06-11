import React, { useState } from "react";
import { View, StyleSheet, TextInput, Button, Text } from "react-native";
import listings from "../api/listings";
import colors from "../config/colors";

function ForgotScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const clickedSend = () => {
    listings.forgotPassword(email, () => navigation.goBack());
  };

  const changeText = (text) => {
    setEmail(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Type your email and ,if an account exist, you will recieve an email to
        reset your password shortly.
      </Text>
      <TextInput
        style={styles.textBox}
        multiline={false}
        editable
        placeholder="Email"
        textContentType="emailAddress"
        onChangeText={changeText}
        autoComplete={false}
        autoCorrect={false}
        autoCapitalize="none"
      />
      <Button title="Send" onPress={clickedSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
  },
  text: {
    paddingTop: 20,
    width: "92%",
    textAlign: "center",
    fontSize: 18,
    color: colors.white,
  },
  textBox: {
    width: "94%",
    height: 40,
    backgroundColor: colors.white,
    marginTop: 30,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 15,
  },
});

export default ForgotScreen;
