import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import colors from "../../config/colors";

function SchedulingCalendar({ navigation }) {
  const currentDate = new Date();

  const dayPressed = () => {
    Alert.alert(
      "Cannot change schedule here.",
      "Do that in the 'Schedule' tab.",
      [{ text: "OK", style: "cancel" }]
    );
  };

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        markingType={"period"}
        onDayPress={dayPressed}
        current={currentDate}
        //make a quick function that runs through the weekly schedule and
        //returns null on closed days.
        //markedDates={markedDates}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    borderColor: colors.dark,
    borderWidth: 1,
    borderRadius: 10,
  },
  container: {
    padding: 10,
    width: "100%",
    height: "100%",
  },
});

export default SchedulingCalendar;
