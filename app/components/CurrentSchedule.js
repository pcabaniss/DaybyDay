import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Button,
} from "react-native";
import colors from "../config/colors";
import AppButton from "./AppButton";
import CurrentDayTime from "./CurrentDayTime";
import DaySeperator from "./DaySeprator";
import ListItemSeperator from "./ListItemSeperator";

//Work put the display to be like this:
//                          |S|M|T|W|T|F|S|
//Make a function that scans the "Current schedule" in the DB and displays
//a highlight on the days that return true

const dayOfTheWeek = [
  { day: "Sunday", letter: "S", time: "fill", key: "sun", isSelected: false },
  { day: "Monday", letter: "M", time: "fill", key: "mon", isSelected: false },
  { day: "Tuesday", letter: "T", time: "fill", key: "tues", isSelected: false },
  {
    day: "Wednesday",
    letter: "W",
    time: "fill",
    key: "wed",
    isSelected: true,
  },
  {
    day: "Thursday",
    letter: "Th",
    time: "fill",
    key: "thur",
    isSelected: false,
  },
  { day: "Friday", letter: "F", time: "fill", key: "fri", isSelected: false },
  { day: "Saturday", letter: "S", time: "fill", key: "sat", isSelected: false },
];

function CurrentSchedule({ onPress }) {
  const [daySelected, setDaySelected] = useState("Sunday");

  return (
    <>
      <View style={styles.container}>
        <FlatList
          horizontal
          data={dayOfTheWeek}
          ItemSeparatorComponent={DaySeperator}
          contentContainerStyle={{ width: "14%" }}
          renderItem={(day) => {
            if (day.item.isSelected == true) {
              return (
                <TouchableOpacity
                  style={styles.selected}
                  onPress={() => setDaySelected(day.item.day)}
                >
                  <View>
                    <Text style={styles.text}>{day.item.letter}</Text>
                  </View>
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity
                style={styles.view}
                onPress={() => setDaySelected(day.item.day)}
              >
                <View>
                  <Text style={styles.text}>{day.item.letter}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <Text style={styles.text}>{daySelected}</Text>
      <CurrentDayTime day={daySelected} />
      <AppButton title="Edit Schedule" onPress={onPress} color={colors.black} />
    </>
  );
}
//Make a view that isVisible set to false, once the day is pressed it will display

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 10,
    width: "100%",
    height: 40,
  },
  text: {
    height: 20,
    fontSize: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  selected: {
    width: "99%",
    backgroundColor: colors.red,
    borderRadius: 5,
  },
  view: {
    width: "99%",
  },
});

export default CurrentSchedule;
