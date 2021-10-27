import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Switch,
  Alert,
} from "react-native";

import colors from "../config/colors";
import AppButton from "./AppButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import DaySeperator from "./DaySeprator";
import { useIsFocused } from "@react-navigation/core";
import ListItemSeperator from "./ListItemSeperator";
import listings from "../api/listings";

//Work put the display to be like this:
//                          |S|M|T|W|T|F|S|
//Make a function that scans the "Current schedule" in the DB and displays
//a highlight on the days that return true

function CurrentSchedule({ navigation }) {
  var dayOfTheWeek = [
    {
      day: "Sunday",
      letter: "S",
      open: "",
      close: "",
      key: "sun",
      isSelected: false,
    },

    {
      day: "Monday",
      letter: "M",
      open: "fill",
      close: "fill",
      key: "mon",
    },
    {
      day: "Tuesday",
      letter: "T",
      open: "fill",
      close: "fill",
      key: "tues",
      isSelected: false,
    },
    {
      day: "Wednesday",
      letter: "W",
      open: "fill",
      close: "fill",
      key: "wed",
      isSelected: true,
    },
    {
      day: "Thursday",
      letter: "Th",
      open: "fill",
      close: "fill",
      key: "thur",
      isSelected: false,
    },
    {
      day: "Friday",
      letter: "F",
      open: "fill",
      close: "fill",
      key: "fri",
      isSelected: false,
    },
    {
      day: "Saturday",
      letter: "S",
      open: "fill",
      close: "fill",
      key: "sat",
      isSelected: false,
    },
  ];

  //Create a function that is called at the beginning and pulls the data
  //for open and close based on the day selected

  const [daySelected, setDaySelected] = useState("Sunday");
  const [letterSelected, setLetterSelected] = useState("S");
  const [dateStart, setStartDate] = useState(new Date());
  const [dateEnd, setEndDate] = useState(new Date());
  const [formattedOpen, setFormattedOpen] = useState("12:00 AM");
  const [formattedClose, setFormattedClose] = useState("12:00 PM");
  const [isOpen, setIsOpen] = useState(true);
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    getSchedule(daySelected);
    const refresh = navigation.addListener("focus", () => {
      getSchedule(daySelected);
    });
    return refresh;
  }, [isFocused]);

  const getSchedule = async (day) => {
    const dayInfo = await listings.getSchedule(day);
    dayOfTheWeek.map((currentDay) => {
      if (currentDay.day == day) {
        (currentDay.close = dayInfo.close),
          (currentDay.open = dayInfo.open),
          (currentDay.isSelected = !dayInfo.isOpen),
          (currentDay.letter = dayInfo.letter);
      }
      setIsOpen(dayInfo.isOpen);
    });

    console.log("_____This is a line break______");
    console.log(dayOfTheWeek);
  };

  const onChangeStart = async (event, selectedDate) => {
    const startDate = selectedDate;
    setShow(Platform.OS === "ios");
    setStartDate(startDate);
    const formatDate = format(startDate, "hh:mm a");
    setFormattedOpen(formatDate);
  };

  const onChangeEnd = (event, selectedDate) => {
    const endDate = selectedDate;
    setShow(Platform.OS === "ios");
    setShow(Platform.OS === "android");
    setEndDate(endDate);

    const formatDate = format(endDate, "hh:mm a");
    setFormattedClose(formatDate);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const toggleSwitch = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const saveButtonPressed = (day, open, close, isOpen, letter) => {
    console.log("Saving... " + day, letter, open, close, isOpen);
    try {
      if (open == "") {
        open = "12:00 AM";
      }
      if (close == "") {
        close = "12:00 PM";
      }
      if (isOpen == undefined) {
        setIsOpen(false);
      }
      listings.saveSchedule(day, open, close, isOpen, letter);
      getSchedule(day);
    } catch (error) {
      Alert.alert("Error saving schedule, please try again.");
      console.log(error);
    }
  };

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
                  onPress={() => (
                    setDaySelected(day.item.day),
                    setLetterSelected(day.item.letter),
                    getSchedule(day.item.day)
                  )}
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
                onPress={() => (
                  setDaySelected(day.item.day),
                  setLetterSelected(day.item.letter),
                  getSchedule(day.item.day)
                )}
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
      <View style={styles.containerOne}>
        <Text style={styles.titleText}>Open?</Text>
        <Switch onValueChange={toggleSwitch} value={isOpen} />
      </View>
      {isOpen ? (
        <View style={styles.containerOne}>
          <View style={styles.open}>
            <Text style={styles.titleText}>Open</Text>
            <DateTimePicker
              value={dateStart}
              mode={"time"}
              is24Hour={false}
              display="default"
              onChange={onChangeStart}
              style={{ width: 100 }}
            />
          </View>
          <View>
            <Text style={styles.titleText}>Close</Text>
            <DateTimePicker
              value={dateEnd}
              mode={"time"}
              is24Hour={true}
              display="default"
              onChange={onChangeEnd}
              style={{ width: 100 }}
            />
          </View>
        </View>
      ) : (
        <Text style={styles.titleText}>Closed For the Day!</Text>
      )}
      <AppButton
        title="Save Schedule"
        //Save the data from currentdaytime to the the dayoftheweek time
        onPress={() =>
          saveButtonPressed(
            daySelected,
            formattedOpen,
            formattedClose,
            isOpen,
            letterSelected
          )
        }
        color={colors.black}
      />
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
  containerOne: {
    //flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingTop: 20,
    paddingBottom: 20,
  },

  titleText: {
    fontSize: 25,
    alignSelf: "center",
    fontWeight: "bold",
    paddingBottom: 10,
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
