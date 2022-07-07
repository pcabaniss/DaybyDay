import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, Alert, Text } from "react-native";
import listings from "../api/listings";
import colors from "../config/colors";
import AppButton from "./AppButton";
import AppPicker from "./AppPicker";

function MessageForm({
  type,
  business,
  businessPic,
  businessName,
  userName,
  userPic,
}) {
  const [value, setValue] = useState("Reason");
  const [about, setAbout] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const getUserEmail = listings.returnEmail();
    setUserEmail(getUserEmail);
  }, []);

  //business
  const reciever = {
    _id: business,
    name: businessName,
    avatar: businessPic,
    key: Math.round(Math.random() * 1000000),
  };

  //user
  const sender = {
    _id: userEmail,
    name: userName,
    avatar: userPic,
    key: Math.round(Math.random() * 1000000),
  };

  const menuItems = [
    {
      label: "Question about services",
      value: 0,
    },
    { label: "Question about scheduling", value: 1 },
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
    if (value == "Reason") {
      return Alert.alert(
        "Hold on",
        "You must select a reason from the drop down menu.",
        [{ text: "OK", style: "cancel" }]
      );
    }
    if (about.length < 5) {
      return Alert.alert(
        "Hold on",
        "You must write something to send something.",
        [{ text: "OK", style: "cancel" }]
      );
    }
    const capitalName = userName.charAt(0).toUpperCase() + userName.slice(1);
    var subject = value.toLowerCase();

    if (value == "Other") {
      subject = "a question";
    }
    if (type == "user") {
      var tempArray = [];
      tempArray.push({ text: capitalName + " has " + subject + ": " + about });

      setTimeout(() => {
        listings.saveMessages(
          tempArray,
          reciever,
          new Date().valueOf(),
          sender
        );
      }, 3000);

      setSent(true);
    } else {
      Alert.alert(
        "Lonely?",
        "Sending a message to yourself isnt very productive.",
        [{ text: "OK", style: "cancel" }]
      );
    }
  };
  /**
   * Add functionality that checks if user has already messaged business
   * if so, display a message instead of the form.
   */

  return (
    <View style={styles.container}>
      {sent ? (
        <>
          <Text style={styles.header}>Sent! They'll get back to you ASAP.</Text>
        </>
      ) : (
        <>
          <Text style={styles.header}>Have any questions?</Text>
          <TextInput
            editable
            multiline
            onChangeText={changeText}
            value={about}
            placeholder="Type message here."
            style={styles.aboutText}
          />
          <AppPicker
            items={menuItems}
            numberOfColumns={1}
            placeholder={value}
            onSelectItem={(value) => {
              setValue(value.label);
            }}
            width="94%"
          />
          <AppButton
            color={colors.green}
            onPress={submitPressed}
            title={"Send Message"}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  aboutText: {
    fontSize: 18,
    fontWeight: "400",
    color: colors.black,
    padding: 10,
    paddingTop: 10,
    borderRadius: 10,
    borderColor: colors.dark,
    borderWidth: 1,
    width: "92%",
    alignSelf: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  header: {
    textAlign: "center",
    fontSize: 30,
    paddingBottom: 15,
  },
});

export default MessageForm;
