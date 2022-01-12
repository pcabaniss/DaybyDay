import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import listings from "../../api/listings";

function ViewSchedulingCalendar({ navigation, email }) {
  const [daySelected, setDaySelected] = useState(new Date());

  //Pull if all slots are full I want to highlight
  //the date red.

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

  const calculateHours = (timeDiff, open, interval, slots) => {
    const hours = [];
    if (interval > 45 || interval == undefined) {
      for (var i = 0; i <= timeDiff; i++) {
        var temp = open;
        const another = moment(temp).add(i, "hours");
        hours.push({
          time: another.format("hh:mm a"),
          isEmpty: true,
          isFull: false,
          almostFull: false,
          slots: slots,
          key: i,
        });
      }
    } else {
      var temp = open;
      for (var i = 0; i <= timeDiff; i++) {
        const another = moment(temp).add(30 * i, "minutes");
        hours.push({
          time: another.format("hh:mm a"),
          isEmpty: true,
          isFull: false,
          almostFull: false,
          slots: slots,
          key: i,
        });
      }
    }

    return hours;
  };

  const getSchedule = async (day) => {
    const dayArray = await listings.getHoursFor(day, email);
    //complete function by making a dynamic function that creates an array
    //that is timeDiff long and can read whether they are booked or not

    //if date matches the one in database, search that deate instead of  'info'
    if (dayArray != null) {
      if (dayArray.interval < 46) {
        const timeDiff = moment(dayArray.close).diff(dayArray.open, "minutes");
        const divide = timeDiff / dayArray.interval;
        const calc = calculateHours(
          divide,
          dayArray.open,
          dayArray.interval,
          dayArray.slots
        );
        return calc;
      } else {
        const timeDiff = moment(dayArray.close).diff(dayArray.open, "hours");

        const calc = calculateHours(
          timeDiff,
          dayArray.open,
          dayArray.interval,
          dayArray.slots
        );
        return calc;
      }
    }
    console.log("Closed!");
    return null;
  };
  const emptyDate = () => {
    Alert.alert(
      "The date you selected is not available.",
      "Please try another date.",
      [{ text: "OK", style: "cancel" }]
    );
  };

  const dayPressed = async (day) => {
    /**
       * day object: 
       * Object {
        "dateString": "2021-12-02",
         "day": 2,
         "month": 12,
         "timestamp": 1638403200000,
         "year": 2021,
    }
       */
    //Check if day has already passed and block if true
    setDaySelected(new Date(day.timestamp));
    const dayOf = moment(day.timestamp).day();
    const sched = await getSchedule(dayString(dayOf));
    if (sched == null) {
      emptyDate();
    } else {
      navigation.navigate("Schedule", {
        day: day,
        hours: sched,
        business: email,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        markingType={"period"}
        onDayPress={dayPressed}
        current={daySelected}
        //make a quick function that runs through the weekly schedule and
        //returns null on closed days.
        //markedDates={markedDates}
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

export default ViewSchedulingCalendar;