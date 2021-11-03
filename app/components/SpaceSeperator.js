import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../config/colors";

//Responsible for the line between each array of DayItem's
function SpaceSeperator() {
  return <View style={styles.seperator} />;
}

const styles = StyleSheet.create({
  seperator: {
    width: 20,
    height: 20,
    backgroundColor: colors.white,
  },
});
export default SpaceSeperator;
