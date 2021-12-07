import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import listings from "../../api/listings";
import { format } from "date-fns";

function SchedulingCalendar({ navigation }) {
  const [daySelected, setDaySelected] = useState(new Date());

  //Pull a list of dates from the DB and put the correspoding dots on
  //the days in the calendar. if all slots are full i want to highlight
  //the date red.

  //checkDate something like this
  //database takes in a day of the week and looks up hours accordingly

  const dayString = (dayInt) => {
    if (dayInt == 0) {
      return "Monday";
    } else if (dayInt == 1) {
      return "Tuesday";
    } else if (dayInt == 2) {
      return "Wednesday";
    } else if (dayInt == 3) {
      return "Thursday";
    } else if (dayInt == 4) {
      return "Friday";
    } else if (dayInt == 5) {
      return "Saturday";
    } else if (dayInt == 6) {
      return "Sunday";
    }
  };

  const timeFormatter = (time) => {
    const formattedTime = new Date(time);
    return format(formattedTime, "hh:mm aa");
  };

  const getDifference = (open, close) => {};

  const getSchedule = async (day) => {
    const dayArray = await listings.getHours(day);
    const open = timeFormatter(dayArray.open);
    const close = timeFormatter(dayArray.close);

    //complete function by making a dynamic function that creates an array
    //that is timeDiff long and can read whether they are booked or not
    const timeDiff = moment(dayArray.close).diff(dayArray.open, "hours");
  };

  const dayPressed = (day) => {
    setDaySelected(new Date(day.timestamp));
    const dayOf = moment(day.timestamp).day();
    const schedule = getSchedule(dayString(dayOf));
    navigation.navigate("Profile", { day: day });
  };

  return (
    <View style={styles.container}>
      <Calendar
        markingType={"period"}
        onDayPress={dayPressed}
        current={daySelected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width: "100%",
    height: "100%",
  },
});

export default SchedulingCalendar;
