import React from "react";
import { View, StyleSheet, Text } from "react-native";
import CurrentSchedule from "../components/CurrentSchedule";
import ListItemSeperator from "../components/ListItemSeperator";
import colors from "../config/colors";

function SceduleScreen({ navigation }) {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.header}>Set your schedule.</Text>
        <Text style={styles.subText}>
          Let your customers know when you're availiable.
        </Text>
        <ListItemSeperator />
        <Text style={styles.saved}>Current Schedule:</Text>
        <CurrentSchedule navigation={navigation} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    //alignItems: "center"
  },
  nada: {
    textAlign: "center",
    color: colors.medium,
    paddingBottom: 40,
  },
  newButton: {
    fontSize: 20,
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.blue,
    width: "80%",
    height: 50,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.black,
  },
  header: {
    height: 105, //Noteworthy-Bold
    backgroundColor: colors.green,
    fontSize: 40,
    textAlign: "center",
    fontFamily: "Kohinoor Bangla",
    paddingTop: 50,
  },
  subText: {
    fontSize: 13,
    backgroundColor: colors.green,
    textAlign: "center",
    paddingBottom: 10,
  },
  saved: {
    padding: 10,
    fontSize: 25,
    color: colors.white,
    fontFamily: "Kohinoor Bangla",
    alignSelf: "center",
  },
});

export default SceduleScreen;
