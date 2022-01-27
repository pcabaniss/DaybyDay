import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../config/colors";

//Responsible for the line between each array of ListItem's
function CalendarSeperator() {
  return <View style={styles.seperator} />;
}

const styles = StyleSheet.create({
  seperator: {
    top: 10,
    left: -50,
    width: "110%",
    height: 1,
    backgroundColor: colors.dark,
  },
});
export default CalendarSeperator;
