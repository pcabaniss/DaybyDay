import React from "react";
import { View, StyleSheet, Text } from "react-native";
import colors from "../config/colors";

function CurrentDayTime({ day }) {
  //look up calendar info in database and set to variables that can be displayed
  //based on the paremeter day.
  return (
    <View style={styles.container}>
      <View style={styles.open}>
        <Text style={styles.titleText}>Open</Text>
        <Text>Start Time</Text>
      </View>
      <View>
        <Text style={styles.titleText}>Close</Text>
        <Text>Closing Time</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingTop: 20,
  },
  day: {},
  titleText: {
    fontSize: 25,
    fontWeight: "bold",
    paddingBottom: 10,
  },
});

export default CurrentDayTime;
