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
import AppPicker from "./AppPicker";

import colors from "../config/colors";
import AppButton from "./AppButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import DaySeperator from "./DaySeprator";
import { useIsFocused } from "@react-navigation/core";
import listings from "../api/listings";

function CurrentSchedule({ navigation }) {
  var dayOfTheWeek = [
    {
      day: "Sunday",
      letter: "S",
      open: new Date(),
      close: new Date(),
      marked: false,

      key: "sun",
    },

    {
      day: "Monday",
      letter: "M",
      open: new Date(),
      close: new Date(),
      marked: false,

      key: "mon",
    },
    {
      day: "Tuesday",
      letter: "T",
      open: new Date(),
      close: new Date(),
      marked: false,

      key: "tues",
    },
    {
      day: "Wednesday",
      letter: "W",
      open: new Date(),
      close: new Date(),
      marked: false,
      key: "wed",
    },
    {
      day: "Thursday",
      letter: "Th",
      open: new Date(),
      close: new Date(),
      marked: false,
      key: "thur",
    },
    {
      day: "Friday",
      letter: "F",
      open: new Date(),
      close: new Date(),
      marked: false,
      key: "fri",
    },
    {
      day: "Saturday",
      letter: "S",
      open: new Date(),
      close: new Date(),
      marked: false,
      key: "sat",
    },
  ];

  const valueItems = [
    {
      label: "15 Minutes",
      value: 15,
    },
    { label: "30 Minutes", value: 30 },
    {
      label: "45 Minutes",
      value: 45,
    },
    {
      label: "1 Hour",
      value: 60,
    },
  ];

  const numberOfItems = [
    {
      label: "1",
      value: 1,
    },

    {
      label: "2",
      value: 2,
    },
    {
      label: "3",
      value: 3,
    },
    {
      label: "4",
      value: 4,
    },
    {
      label: "5",
      value: 5,
    },
  ];

  //Make it where you can select either hour or half- hour intervals
  //and how many customers per slot

  const [daySelected, setDaySelected] = useState("Sunday");
  const [letterSelected, setLetterSelected] = useState("S");
  const [dateStart, setStartDate] = useState(new Date());
  const [dateEnd, setEndDate] = useState(new Date());

  const [value, setValue] = useState({
    label: "Please select a time.",
    value: undefined,
  });
  const [numberOfValue, setNumberOfValue] = useState({
    label: "Please select a number.",
    value: undefined,
  });

  const [isOpen, setIsOpen] = useState(false);
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
    if (dayInfo == null) {
      setStartDate(new Date());
      setEndDate(new Date());
      setIsOpen(false);
    } else {
      dayOfTheWeek.map((currentDay) => {
        if (currentDay.day == day) {
          (currentDay.close = new Date(dayInfo.close)),
            (currentDay.open = new Date(dayInfo.open)),
            (currentDay.isSelected = !dayInfo.isOpen),
            (currentDay.letter = dayInfo.letter),
            (currentDay.interval = dayInfo.interval),
            (currentDay.slots = dayInfo.slots);
          setStartDate(currentDay.open);
          setEndDate(currentDay.close);
          setIsOpen(dayInfo.isOpen);
          if (currentDay.interval != undefined) {
            if (currentDay.interval == 60) {
              setValue({
                label: "1 hour",
                value: currentDay.interval,
              });
            }
            setNumberOfValue({
              label: currentDay.slots,
              value: currentDay.slots,
            });
          } else {
            setValue({
              label: "Please Select a time.",
              value: undefined,
            });
            setNumberOfValue({
              label: "Please select a number. ",
              value: undefined,
            });
          }
        }

        //console.log(new Date(dayInfo.open.seconds));
      });
    }
  };

  const onChangeStart = async (event, selectedDate) => {
    const startDate = selectedDate;
    setShow(Platform.OS === "ios");
    setStartDate(startDate);
  };

  const onChangeEnd = (event, selectedDate) => {
    const endDate = selectedDate;
    setShow(Platform.OS === "ios");
    setShow(Platform.OS === "android");
    setEndDate(endDate);
    console.log(endDate);
  };

  const formatString = (date) => {
    const format = new Date(date);
    console.log(format);
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

  const checkDays = async (day) => {
    const dayInfo = await listings.getSchedule(day);
    if (dayInfo == null) {
      return colors.danger;
    }
    return colors.white;
  };

  const saveButtonPressed = (
    day,
    open,
    close,
    isOpen,
    letter,
    interval,
    slots
  ) => {
    try {
      if (interval == undefined || slots == undefined) {
        Alert.alert(
          "Error saving schedule, please make sure you pick a time interval and slots."
        );
        return;
      }
      if (isOpen == undefined) {
        setIsOpen(false);
      }
      console.log(
        "Saving... " + day,
        letter,
        open,
        close,
        isOpen,
        interval,
        slots
      );
      listings.saveSchedule(day, open, close, isOpen, letter, interval, slots);
      getSchedule(day);
    } catch (error) {}
  };

  return (
    <>
      <View style={styles.container}>
        <FlatList
          horizontal
          data={dayOfTheWeek}
          ItemSeparatorComponent={DaySeperator}
          contentContainerStyle={{
            width: "14%",
          }}
          renderItem={(day) => {
            if (day.item.day == daySelected) {
              return (
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.medium,
                    width: "99%",
                    borderRadius: 5,
                  }}
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
        <>
          <View style={styles.containerOne}>
            <View style={styles.open}>
              <Text style={styles.titleText}>Open</Text>
              <DateTimePicker
                value={dateStart}
                mode={"time"}
                is24Hour={false}
                minuteInterval={30}
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
                minuteInterval={30}
                display="default"
                onChange={onChangeEnd}
                style={{ width: 100 }}
              />
            </View>
          </View>
          <View style={styles.questions}>
            <Text style={styles.footer}>
              How long should each appointment take?
            </Text>
            <AppPicker
              items={valueItems}
              numberOfColumns={1}
              placeholder={value.label}
              onSelectItem={(value) => {
                setValue(value);
              }}
              width="96%"
            />
            <Text style={styles.footer}>How many patrons per appointment?</Text>
            <AppPicker
              items={numberOfItems}
              numberOfColumns={1}
              placeholder={numberOfValue.label}
              onSelectItem={(value) => {
                setNumberOfValue(value);
              }}
              width="96%"
            />
          </View>
        </>
      ) : (
        <Text style={styles.titleText}>Closed For the Day!</Text>
      )}
      <AppButton
        title="Save Schedule"
        //Save the data from currentdaytime to the the dayoftheweek time
        onPress={() =>
          saveButtonPressed(
            daySelected,
            new Date(dateStart).toString(),
            new Date(dateEnd).toString(),
            isOpen,
            letterSelected,
            value.value,
            numberOfValue.value
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
  footer: {
    alignSelf: "flex-start",
    height: 20,
    fontSize: 15,
    fontWeight: "bold",
    paddingLeft: 5,
  },
  questions: {
    alignItems: "center",
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
    borderRadius: 5,
  },
  view: {
    width: "99%",
  },
});

export default CurrentSchedule;
