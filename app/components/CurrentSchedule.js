import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Switch,
  Alert,
  Platform,
} from "react-native";
import moment from "moment";

import AppPicker from "./AppPicker";

import colors from "../config/colors";
import AppButton from "./AppButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import DaySeperator from "./DaySeprator";
import { useIsFocused } from "@react-navigation/core";
import listings from "../api/listings";
import TestPicker from "./TestPicker";

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
      letter: "Sa",
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
  const [isAndroid, setIsAndroid] = useState(Platform.OS === "android");
  const [isShowingStart, setIsShowingStart] = useState(false);
  const [isShowingEnd, setIsShowingEnd] = useState(false);

  const showPickerStart = () => {
    setIsShowingStart(true);
  };

  const showPickerEnd = () => {
    setIsShowingEnd(true);
  };

  const [value, setValue] = useState({
    label: "Please select a time.",
    value: undefined,
  });
  const [numberOfValue, setNumberOfValue] = useState({
    label: "Please select a number.",
    value: undefined,
  });

  const [isOpen, setIsOpen] = useState(false);
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

  const timeFormatter = (recieved) => {
    const time = moment(recieved).format("LT");
    return time;
  };

  const onChangeStart = async (event, selectedDate) => {
    const startDate = selectedDate;

    console.log(moment(startDate).format("LT"));
    if (isAndroid) {
      setIsShowingStart(false);
    }
    setStartDate(startDate);
  };

  const onChangeEnd = (event, selectedDate) => {
    const endDate = selectedDate;
    if (isAndroid) {
      setIsShowingEnd(false);
    }
    setEndDate(endDate);
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

  const getValue = (status) => {
    if (Platform.OS == "ios") {
      if (status == "start") {
        return dateStart;
      } else if (status == "end") {
        return dateEnd;
      }
    } else if (Platform.OS == "android") {
      return new Date();
    }
  };

  return (
    <>
      <View style={styles.container}>
        <FlatList
          horizontal
          data={dayOfTheWeek}
          ItemSeparatorComponent={DaySeperator}
          contentContainerStyle={{
            width: "100%",
            height: 20,
            alignSelf: "center",
          }}
          //style={{ width: "100%" }}
          renderItem={(day) => {
            if (day.item.day == daySelected) {
              return (
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.primaryDark,
                    width: 50,
                    height: 20,
                    borderRadius: 5,
                  }}
                  onPress={() => (
                    setDaySelected(day.item.day),
                    setLetterSelected(day.item.letter),
                    getSchedule(day.item.day)
                  )}
                >
                  <View>
                    <Text style={styles.selectedLetter}>{day.item.letter}</Text>
                  </View>
                </TouchableOpacity>
              );
            } else {
              return (
                <TouchableOpacity
                  style={{
                    width: 50,
                    height: 20,
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
          }}
        />
      </View>
      <Text style={styles.text}>{daySelected}</Text>
      <View style={styles.containerOne}>
        <Text style={styles.titleText}>Open?</Text>
        <Switch
          onValueChange={toggleSwitch}
          value={isOpen}
          thumbColor={colors.light}
          ios_backgroundColor={colors.red}
          trackColor={{ true: colors.green, false: colors.danger }}
        />
      </View>
      {isOpen ? (
        <>
          {isAndroid ? (
            <View style={styles.containerOne}>
              <View style={styles.open}>
                <Text style={styles.titleText}>Open</Text>
                <TestPicker
                  dateProp={dateStart}
                  isShowing={isShowingStart}
                  onChange={onChangeStart}
                  showPicker={showPickerStart}
                />
              </View>
              <View>
                <Text style={styles.titleText}>Close</Text>
                <TestPicker
                  dateProp={dateEnd}
                  isShowing={isShowingEnd}
                  onChange={onChangeEnd}
                  showPicker={showPickerEnd}
                />
              </View>
            </View>
          ) : (
            <View style={styles.containerOne}>
              <View style={styles.open}>
                <Text style={styles.titleText}>Open</Text>
                <DateTimePicker
                  value={getValue("start")}
                  mode={"time"}
                  is24Hour={false}
                  minuteInterval={30}
                  display={Platform.OS === "ios" ? "default" : "spinner"}
                  onChange={onChangeStart}
                  style={{
                    width: "140%",
                    //height: "100%",
                    overflow: "hidden",
                    backgroundColor: "white",
                    borderRadius: 10,
                  }}
                />
              </View>
              <View>
                <Text style={styles.titleText}>Close</Text>
                <DateTimePicker
                  value={getValue("end")}
                  mode={"time"}
                  is24Hour={true}
                  minuteInterval={30}
                  display={Platform.OS === "ios" ? "default" : "spinner"}
                  onChange={onChangeEnd}
                  style={{
                    width: "140%",
                    overflow: "hidden",
                    backgroundColor: "white",
                    borderRadius: 10,
                  }}
                />
              </View>
            </View>
          )}
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
        color={colors.green}
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
    color: colors.white,
    fontSize: 25,
    alignSelf: "center",
    fontWeight: "bold",
    paddingBottom: 10,
  },
  footer: {
    color: colors.white,
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
    color: colors.white,
    textAlign: "center",
    fontWeight: "bold",
  },
  selected: {
    width: "99%",
    borderRadius: 5,
  },
  selectedLetter: {
    height: 20,
    fontSize: 15,
    color: colors.primaryLight,
    textAlign: "center",
    fontWeight: "bold",
  },

  btnCont: {
    width: 110,
  },
  // This only works on iOS
  picker: {
    width: 320,
    height: 260,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
});

export default CurrentSchedule;
