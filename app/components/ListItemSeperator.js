import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../config/colors";

//Responsible for the line between each array of ListItem's
function ListItemSeperator() {
  return <View style={styles.seperator} />;
}

const styles = StyleSheet.create({
  seperator: {
    width: "90%",
    left: 20,
    height: 1,
    backgroundColor: colors.medium,
  },
});
export default ListItemSeperator;
