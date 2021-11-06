import React, { useState } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import colors from "../config/colors";
import SpaceSeperator from "./SpaceSeperator";
import listings from "../api/listings";
import moment from "moment";

function SelectedIcon({ prop }) {
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
      if (day == "Thurday") {
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
  if (prop == "Schedule") {
    return (
      <View style={styles.aboutView}>
        <Text style={styles.text}>
          {" "}
          S{"      "} {sunday}
        </Text>
        <SpaceSeperator />
        <Text style={styles.text}>
          {" "}
          M{"     "} {monday}
        </Text>
        <SpaceSeperator />
        <Text style={styles.text}>
          {" "}
          T{"      "} {tuesday}
        </Text>
        <SpaceSeperator />
        <Text style={styles.text}>
          {" "}
          W{"     "} {wednesday}
        </Text>
        <SpaceSeperator />
        <Text style={styles.text}>
          {" "}
          Th{"    "} {thursday}
        </Text>
        <SpaceSeperator />
        <Text style={styles.text}>
          {" "}
          F{"       "} {friday}
        </Text>
        <SpaceSeperator />
        <Text style={styles.text}>
          {" "}
          S {"       "}
          {saturday}
        </Text>
        <SpaceSeperator />
      </View>
    );
  }
  if (prop == "Reviews") {
    return <Text>This is all about the reviews</Text>;
  }
  if (prop == "About") {
    return <Text>Here is my About Page</Text>;
  }
  if (prop == "Message") {
    return (
      <Text>
        Quick message form goes here, it will message the business and also put
        it in the databse as a message stream.
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  aboutView: {
    padding: 10,
    width: "100%",
    height: "100%",
    alignItems: "flex-start",
  },
  text: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.black,
  },
});

export default SelectedIcon;
