import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import colors from "../config/colors";
import listings from "../api/listings";
import moment from "moment";
import MessageForm from "./MessageForm";
import ViewSchedulingCalendar from "./calendar/ViewSchedulingCalendar";

function SelectedIconViewed({ prop, navigation, email }) {
  var dayOfTheWeek = [
    {
      day: "Sunday",
      letter: "S",
      key: "sun",
    },

    {
      day: "Monday",
      letter: "M",
      key: "mon",
    },
    {
      day: "Tuesday",
      letter: "T",
      key: "tues",
    },
    {
      day: "Wednesday",
      letter: "W",
      key: "wed",
    },
    {
      day: "Thursday",
      letter: "Th",
      key: "thur",
    },
    {
      day: "Friday",
      letter: "F",
      key: "fri",
    },
    {
      day: "Saturday",
      letter: "S",
      key: "sat",
    },
  ];
  const [sunday, setSunday] = useState("Closed");
  const [monday, setMonday] = useState("Closed");
  const [tuesday, setTuesday] = useState("Closed");
  const [wednesday, setWednesday] = useState("Closed");
  const [thursday, setThursday] = useState("Closed");
  const [friday, setFriday] = useState("Closed");
  const [saturday, setSaturday] = useState("Closed");
  const [about, setAbout] = useState("PlaceHolder");

  const timeFormatter = (date) => {
    let d = moment(date).utcOffset(date);
    return d.format("hh:mm A");
  };

  const getSchedule = async (day) => {
    const dayInfo = await listings.getSchedule(day);

    if (dayInfo != null) {
      const open = timeFormatter(dayInfo.open);
      const close = timeFormatter(dayInfo.close);
      if (day == "Sunday") {
        setSunday(open + " - " + close);
      }
      if (day == "Monday") {
        setMonday(open + " - " + close);
      }
      if (day == "Tuesday") {
        setTuesday(open + " - " + close);
      }
      if (day == "Wednesday") {
        setWednesday(open + " - " + close);
      }
      if (day == "Thursday") {
        setThursday(open + " - " + close);
      }
      if (day == "Friday") {
        setFriday(open + " - " + close);
      }
      if (day == "Saturday") {
        setSaturday(open + " - " + close);
      }
    }
  };
  dayOfTheWeek.map((day) => {
    getSchedule(day.day);
  });

  const pullAboutInfo = async (email) => {
    const data = await listings.getAboutFor(email);
    if (data != undefined || data != null) {
      setAbout(data);
    } else {
      setAbout("PlaceHolder");
    }
  };

  if (prop == "Schedule") {
    return <ViewSchedulingCalendar navigation={navigation} email={email} />;
  }

  if (prop == "Reviews") {
    return <Text>This is all about the reviews</Text>;
  }
  if (prop == "About") {
    pullAboutInfo(email);
    return <Text style={styles.aboutText}>{about}</Text>;
  }
  if (prop == "Message") {
    return <MessageForm />;
  }
}

const styles = StyleSheet.create({
  aboutView: {
    padding: 10,
    width: "100%",
    height: "100%",
  },
  aboutText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
    padding: 10,
  },
  text: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.black,
  },
});

export default SelectedIconViewed;
