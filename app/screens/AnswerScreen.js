import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput,
} from "react-native";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LittleButton from "../components/LittleButton";
import listings from "../api/listings";

function AnswerScreen({ route, navigation }) {
  const { item } = route.params;

  const [background, setbackground] = useState(colors.background);
  const [about, setAbout] = useState(" ");
  const [response, setResponse] = useState(" ");

  const onPressAccept = () => {
    setbackground(colors.green);
    setResponse("accepted");
    return console.log("Pressed Accept!");
  };

  const onPressDeny = () => {
    setbackground(colors.red);
    setResponse("denied");
    return console.log("Pressed Deny!");
  };

  const submitPressed = (text, response) => {
    //put in function that checks if answer is pressed.
    listings.updateRequest(text, response, item);
    console.log("Going to save " + text + " and  " + response);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View
        style={{ height: "40%", width: "100%", backgroundColor: background }}
      >
        <TouchableOpacity
          style={styles.header}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="chevron-down"
            size={60}
            color={colors.black}
          />
        </TouchableOpacity>
        <View style={styles.buttons}>
          <LittleButton
            onPress={() => onPressAccept()}
            title="Accept"
            backgroundColor={colors.green}
          />
          <LittleButton
            onPress={() => onPressDeny()}
            title="Deny"
            backgroundColor={colors.red}
          />
        </View>
        <View style={styles.reason}>
          <TextInput
            placeholder="Give a reason(optional)."
            editable
            multiline
            onChangeText={setAbout}

            //style={styles.reason}
          />
        </View>
        <Button
          title="Submit"
          color={colors.black}
          onPress={() => submitPressed(about, response)}
        />
      </View>
    </View>
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
    borderColor: colors.black,
    borderWidth: 2,
    borderRadius: 5,
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  inside: {
    height: "40%",
    width: "100%",
    backgroundColor: colors.yellow,
    //justifyContent: "center",
  },
  reason: {
    width: "95%",
    height: 75,
    backgroundColor: colors.white,
    alignSelf: "center",
    borderColor: colors.black,
    borderWidth: 2,
    borderRadius: 5,
  },
});

export default AnswerScreen;
