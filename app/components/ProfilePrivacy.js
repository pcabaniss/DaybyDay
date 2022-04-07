import React from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import colors from "../config/colors";
import ListItemSeperator from "./ListItemSeperator";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import listings from "../api/listings";

function ProfilePrivacy({ route, navigation }) {
  const { business } = route.params;

  const block = () => {
    Alert.alert(
      "Are you sure you want to block " + business + "?",
      "Doing so will delete all current messages between you two, as to avoid further communication.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Im sure",
          onPress: () => blockedAnswer(),
        },
      ]
    );
  };

  const blockedAnswer = () => {
    listings.blockBusiness(business);
    Alert.alert("You have successfully blocked" + business + ".");
    navigation.pop(2);
  };

  const report = () => {
    //Send a message to me to review profile for inappropriate material.
    Alert.alert("Are you sure you want to report " + business + "?", "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Im sure",
        onPress: () =>
          listings
            .reportBusiness(
              business,
              "Innappropriate business practices.",
              "pcabaniss93@gmail.com"
            )
            .then(
              Alert.alert(
                "You have successfully filed a report, we will look into this as soon as possible. "
              )
            )
            .then(navigation.goBack()),
      },
    ]);
    //Display alert saying that the report has been sent.
  };

  const blockIcon = (
    <MaterialCommunityIcons name="block-helper" size={20} color={colors.red} />
  );

  const reportIcon = (
    <MaterialCommunityIcons
      name="alert-outline"
      size={25}
      color={colors.yellow}
    />
  );
  return (
    <View style={styles.container}>
      <View style={styles.options}>
        <View style={styles.block}>
          {blockIcon}
          <Button title={"Block " + business} onPress={block} />
          {blockIcon}
        </View>
        <ListItemSeperator />
        <View style={styles.block}>
          {reportIcon}
          <Button title={"Report " + business} onPress={report} />
          {reportIcon}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  container: {
    flex: 1,
    flexDirection: "column-reverse",
    justifyContent: "flex-start",
  },
  options: {
    height: "20%",
    width: "100%",
    backgroundColor: colors.softWhite,
    padding: 10,
    borderColor: colors.dark,
    justifyContent: "space-evenly",
    alignSelf: "center",
  },
  report: {},
});

export default ProfilePrivacy;
