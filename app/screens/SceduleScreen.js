import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
} from "react-native";
import CurrentSchedule from "../components/CurrentSchedule";
import ListItemSeperator from "../components/ListItemSeperator";
import colors from "../config/colors";

//Make it to where you can customize hours on each day
//Open, Close, lunch breaks, holidays, PTO

function SceduleScreen({ navigation }) {
  const [savedCal, setSavedCal] = useState();
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.header}>Set your schedule.</Text>
        <Text style={styles.subText}>
          Let your customers know when you're availiable.
        </Text>
        <ListItemSeperator />
        <Text style={styles.saved}>Current Schedule:</Text>
        <CurrentSchedule onPress={() => navigation.navigate("Edit Schedule")} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    //alignItems: "center"
  },
  header: {
    height: 150, //Noteworthy-Bold
    backgroundColor: colors.white,
    fontSize: 40,
    textAlign: "center",
    fontFamily: "Noteworthy-Bold",
    paddingTop: 50,
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
  subText: {
    fontSize: 15,
    textAlign: "center",
    paddingBottom: 10,
  },
  saved: {
    padding: 10,
    fontSize: 25,
    fontFamily: "Noteworthy-Bold",
    alignSelf: "center",
  },
});

export default SceduleScreen;
