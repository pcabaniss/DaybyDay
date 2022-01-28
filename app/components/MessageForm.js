import React, { useState } from "react";
import { View, StyleSheet, TextInput, Button } from "react-native";
import colors from "../config/colors";
import AppButton from "./AppButton";
import AppPicker from "./AppPicker";

function MessageForm(props) {
  const [value, setValue] = useState("Reason");
  const [about, setAbout] = useState("");

  const menuItems = [
    {
      label: "Questions about services",
      value: 0,
    },
    { label: "Questions about scheduling", value: 1 },
    {
      label: "General inquiry",
      value: 2,
    },
    {
      label: "Concerns or issues",
      value: 3,
    },
    {
      label: "Other",
      value: 4,
    },
  ];

  const changeText = (text) => {
    setAbout(text);
  };
  // This will be in charge of sending the message to the business.
  const submitPressed = () => {
    console.log("Pressed submit!");
  };
  /**
   * Add functionality that checks if user has already messaged business
   * if so, display a message instead of the form.
   */

  return (
    <View style={styles.container}>
      <AppPicker
        items={menuItems}
        numberOfColumns={1}
        placeholder={value}
        onSelectItem={(value) => {
          setValue(value.label);
        }}
        width="100%"
      />
      <TextInput
        editable
        multiline
        onChangeText={changeText}
        value={about}
        placeholder="Type message here."
        style={styles.aboutText}
      ></TextInput>
      <AppButton
        color={colors.black}
        onPress={submitPressed}
        title={"Send Message"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  aboutText: {
    fontSize: 18,
    fontWeight: "400",
    color: colors.black,
    padding: 10,
    borderRadius: 10,
    borderColor: colors.dark,
    borderWidth: 1,
    width: "98%",
    alignSelf: "center",
  },
});

export default MessageForm;
