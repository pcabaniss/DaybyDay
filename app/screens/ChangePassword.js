import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, Button, Alert } from "react-native";
import listings from "../api/listings";
import SimpleSeperator from "../components/SimpleSeperator";
import colors from "../config/colors";

function ChangePassword({ navigation }) {
  const [current, setCurrent] = useState("");
  const [newPW, setNewPW] = useState("");
  const [check, setCheck] = useState("");

  const changeCurrent = (text) => {
    setCurrent(text);
  };

  const changeNew = (text) => {
    setNewPW(text);
  };

  const changeCheck = (text) => {
    setCheck(text);
  };

  const checkStuff = () => {
    if (newPW != check) {
      Alert.alert(
        "New passwords dont match!",
        "Please make sure all characters are matching in new passwords.",
        [{ text: "OK", style: "cancel" }]
      );
    } else if (newPW.length < 6) {
      Alert.alert(
        "Not long enough!",
        "Passwords must be at least 6 characters long.",
        [{ text: "OK", style: "cancel" }]
      );
    } else if (current == newPW) {
      Alert.alert(
        "Oh no!",
        "It looks like your new password matches your old one. Please try again.",
        [{ text: "OK", style: "cancel" }]
      );
    } else {
      const func = async () => {
        const change = await listings.changePassword(current, newPW, () =>
          navigation.goBack()
        );

        change;
      };

      func();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.current}>
        <Text
          style={{
            fontSize: 18,
            color: colors.white,
            fontWeight: "bold",
            paddingRight: 15,
          }}
        >
          Current password
        </Text>
        <TextInput
          editable
          placeholder="Type current password"
          placeholderTextColor={colors.green}
          onChangeText={changeCurrent}
          secureTextEntry
          style={{
            width: "50%",
            height: 30,
            paddingLeft: 5,
            //backgroundColor: colors.white,
            justifyContent: "center",
          }}
        />
      </View>
      <SimpleSeperator />
      <View style={styles.current}>
        <Text
          style={{
            fontSize: 18,
            color: colors.white,
            fontWeight: "bold",
            paddingRight: 15,
          }}
        >
          New password
        </Text>
        <TextInput
          editable
          placeholder="At least 6 characters"
          placeholderTextColor={colors.green}
          onChangeText={changeNew}
          secureTextEntry
          style={{
            width: "50%",
            height: 30,
            paddingLeft: 5,
            //backgroundColor: colors.white,
            justifyContent: "center",
          }}
        />
      </View>
      <SimpleSeperator />
      <View style={styles.current}>
        <Text
          style={{
            fontSize: 18,
            color: colors.white,
            fontWeight: "bold",
            paddingRight: 15,
          }}
        >
          Confirm password
        </Text>
        <TextInput
          editable
          placeholder="At least 6 characters"
          placeholderTextColor={colors.green}
          onChangeText={changeCheck}
          secureTextEntry
          style={{
            width: "50%",
            height: 30,
            paddingLeft: 5,
            //backgroundColor: colors.white,
            justifyContent: "center",
          }}
        />
      </View>
      <SimpleSeperator />
      <Button title="Submit" onPress={checkStuff} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black, padding: 10 },
  current: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 15,
    paddingTop: 10,
  },
});

export default ChangePassword;
