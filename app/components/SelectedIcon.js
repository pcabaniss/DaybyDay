import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import colors from "../config/colors";
import listings from "../api/listings";
import { useIsFocused } from "@react-navigation/core";
import MessageForm from "./MessageForm";
import SchedulingCalendar from "./calendar/SchedulingCalendar";

function SelectedIcon({ prop, navigation }) {
  const [about, setAbout] = useState(" ");
  const isFocused = useIsFocused();

  useEffect(() => {
    const refresh = navigation.addListener("focus", () => {
      pullAboutInfo();
    });
    return refresh;
  }, [isFocused]);

  const saveAbout = (text) => {
    pullAboutInfo();
    listings.saveAbout(text);
  };

  const pullAboutInfo = async () => {
    const data = await listings.getAbout();
    if (data != undefined || data != null) {
      setAbout(data);
    } else {
      console.log("Could not pull about info. ");
    }
  };

  if (prop == "Schedule") {
    return <SchedulingCalendar navigation={navigation} />;
  }

  if (prop == "Reviews") {
    return <Text>This is all about the reviews</Text>;
  }

  const changeText = (text) => {
    setAbout(text);

    saveAbout(text);
  };
  if (prop == "About") {
    return (
      <>
        <TextInput
          editable
          multiline
          onChangeText={changeText}
          value={about}
          placeholder="This is where the about goes."
          style={styles.aboutText}
        ></TextInput>
        <Text>Add images Button goes here.</Text>
      </>
    );
  }
  if (prop == "Message") {
    return <MessageForm />;
  }
}

const styles = StyleSheet.create({
  aboutView: {
    padding: 10,
    width: "100%",
    height: "100%",
  },
  aboutText: {
    fontSize: 20,
    paddingTop: 20,
    color: colors.dark,
    borderColor: colors.dark,
    borderWidth: 3,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    textAlign: "center",
  },
  text: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.black,
  },
});

export default SelectedIcon;
