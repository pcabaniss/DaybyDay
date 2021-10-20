import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../config/colors";

//Responsible for the line between each array of DayItem's
function DaySeperator() {
  return <View style={styles.seperator} />;
}

const styles = StyleSheet.create({
  seperator: {
    width: 1,
    height: "100%",
    backgroundColor: colors.medium,
  },
});
export default DaySeperator;
