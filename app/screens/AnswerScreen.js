import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LittleButton from "../components/LittleButton";
import listings from "../api/listings";

function AnswerScreen({ route, navigation }) {
  const { item } = route.params;

  const [background, setbackground] = useState(colors.primary);
  const [about, setAbout] = useState(" ");
  const [response, setResponse] = useState(" ");

  const onPressAccept = () => {
    setbackground(colors.greenCheck);
    setResponse("accepted");
    return console.log("Pressed Accept!");
  };

  const onPressDeny = () => {
    setbackground(colors.danger);
    setResponse("denied");
    return console.log("Pressed Deny!");
  };

  const submitPressed = (text, response) => {
    //Set a reminder here to be sent to user.
    //put in function that checks if answer is pressed.
    listings.updateRequest(text, response, item);
    console.log("Going to save " + text + " and  " + response);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <KeyboardAvoidingView
        style={{ height: "42%", width: "100%", backgroundColor: background }}
      >
        <TouchableOpacity
          style={styles.header}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="chevron-down"
            size={60}
            color={colors.primary}
          />
        </TouchableOpacity>
        <View style={styles.buttons}>
          <LittleButton
            onPress={() => onPressAccept()}
            title="Accept"
            backgroundColor={colors.greenCheck}
          />
          <LittleButton
            onPress={() => onPressDeny()}
            title="Deny"
            backgroundColor={colors.danger}
          />
        </View>
        <View style={styles.reason}>
          <TextInput
            placeholder=" Give a reason(optional)."
            autoCapitalize="sentences"
            autoCorrect
            editable
            style={{ paddingLeft: 5 }}
            multiline
            onChangeText={setAbout}
            blurOnSubmit={true}
          />
        </View>
        <Button
          title="Submit"
          color={colors.white}
          onPress={() => submitPressed(about, response)}
        />
      </KeyboardAvoidingView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingTop: 15,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  header: {
    backgroundColor: colors.white,
    borderColor: colors.dark,
    borderWidth: 2,
    borderRadius: 5,
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  reason: {
    width: "95%",
    height: 75,
    backgroundColor: colors.white,
    alignSelf: "center",
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default AnswerScreen;
