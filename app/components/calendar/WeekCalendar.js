import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import React, { useState, useEffect } from "react";
import listingsApi from "../../api/listings";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  SafeAreaView,
} from "react-native";
// @ts-expect-error

//Need to pull the current date that i clicked on and pass it to the database
// for reference
import { Agenda } from "react-native-calendars";
import colors from "../../config/colors";
import CalendarSeperator from "../CalendarSeperator";
import { useIsFocused } from "@react-navigation/core";

const testIDs = require("../Test");

const timeFormatter = (date) => {
  let d = moment(date).utcOffset(date);
  return d.format("hh:mm A");
};

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};

const WeekCalendar = ({ navigation }) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    const refresh = navigation.addListener("focus", () => {
      console.log("Inside");
      setItems(updateDate());
    });
    console.log("Refreshed?");
    loadItems(date);
    return refresh;
  }, [isFocused]);

  const [items, setItems] = useState({});
  const [date, setDate] = useState({});

  const loadItems = (day) => {
    console.log("Loading items....");
    setTimeout(async () => {
      setDate(day);
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);

        if (!items[strTime]) {
          items[strTime] = [];
          const result = await pullDate(strTime).then((result) => {
            if (result != undefined) {
              const timeSt = timeFormatter(result.timeStart);
              const timeEn = timeFormatter(result.timeFinish);
              items[strTime].push({
                name: result.title,
                time: timeSt + " - " + timeEn,
                subText: result.description,
                height: "100%",
                category: result.categoryID,
                date: strTime,
              });
            }
          });
          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            const num = j + 1;
            if (numItems === 1 && !items[strTime]) {
              items[strTime].push({
                name: strTime,
                height: "100%",
                number: numItems,
                date: strTime,
                onlyDate: true,
                pulled: false,
              });
            } else if (j === numItems - 1 && j != 0 && !items[strTime]) {
              items[strTime].push({
                name: strTime,
                height: "100%",
                number: numItems,
                date: strTime,
                dateChanged: true,
              });
            } else if (!items[strTime]) {
              items[strTime].push({
                name: strTime,
                height: "100%",
                date: strTime,
                number: numItems,
                dateChanged: false,
              });
            }
          }
        } else {
          renderEmptyDate(strTime);
        }
      }
      console.log("Items loaded!");
      const newItems = {};
      Object.keys(items).forEach((key) => {
        newItems[key] = items[key];
      });
      console.log("Items set");
      setItems(newItems);
    }, 1000);
  };

  const updateDate = async () => {
    const newItems = {};
    console.log("updating........");
    Object.keys(items).forEach((key) => {
      newItems[key] = items[key];
    }, 1000);

    return newItems;
  };

  const renderItem = (item) => {
    if (item.dateChanged === false) {
      return (
        <>
          <TouchableOpacity
            testID={testIDs.agenda.ITEM}
            style={[styles.item, { height: item.height }]}
            onPress={() => Alert.alert("Nope")}
          >
            <Text style={styles.mainText}>{item.name}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </TouchableOpacity>
        </>
      );
    } else if (item.onlyDate === true) {
      return (
        <>
          <TouchableOpacity
            testID={testIDs.agenda.ITEM}
            style={[styles.item, { height: 15 }]}
            onPress={() => Alert.alert("I am an only date.")}
          >
            <Text style={styles.mainText}>{item.name}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
            <View style={styles.button}>
              <MaterialCommunityIcons
                name={"pencil"}
                size={20}
                color={colors.red}
                onPress={() => navigation.navigate("Add", { day: item.date })}
              />
            </View>
          </TouchableOpacity>
          <CalendarSeperator />
        </>
      );
    } else {
      return (
        <>
          <TouchableOpacity
            testID={testIDs.agenda.ITEM}
            style={[styles.item, { height: item.height }]}
            onPress={() => console.log("Else")}
          >
            <Text style={styles.mainText}>{item.name}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
            <View style={styles.button}>
              <MaterialCommunityIcons
                name={"lead-pencil"}
                size={28}
                style={styles.icon}
                color={colors.medium}
                onPress={() =>
                  navigation.navigate("View", {
                    day: item.date,
                    title: item.name,
                    time: item.time,
                    description: item.subText,
                    category: item.category,
                  })
                }
              />
              <MaterialCommunityIcons
                name={"trash-can-outline"}
                size={28}
                color={colors.medium}
                onPress={() =>
                  Alert.alert("Are you sure you want to delete this item?")
                }
              />
            </View>
          </TouchableOpacity>
          <CalendarSeperator />
        </>
      );
    }
  };

  const pullDate = async (day) => {
    const result = await listingsApi.getDate(day);

    if (result === null) {
      return null;
    } else {
      return result;
    }
    //resetForm();
  };

  const renderEmptyDate = (day) => {
    const dayString = timeToString(day);
    return (
      <>
        <TouchableOpacity
          testID={testIDs.agenda.ITEM}
          style={[styles.item, { height: 15 }]}
          onPress={() => Alert.alert("Add Event")}
        >
          <Text style={styles.mainText}>{"Nothing scheduled today."}</Text>
        </TouchableOpacity>
        <CalendarSeperator />
      </>
    );
  };

  const rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name;
  };

  const now = moment();

  return (
    <SafeAreaView style={styles.safe}>
      <Agenda
        style={styles.agenda}
        items={items}
        loadItemsForMonth={loadItems}
        selected={now.day}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={rowHasChanged}
        showClosingKnob={true}
        markingType={"period"}
        markedDates={{
          "2021-10-08": { textColor: "#43515c" },
          "2021-10-09": { textColor: "#43515c" },
          "2021-10-14": {
            startingDay: true,
            endingDay: true,
            color: colors.danger,
          },
          "2021-10-21": { startingDay: true, color: colors.blue },
          "2021-10-22": { endingDay: true, color: colors.medium },
          "2021-10-24": { startingDay: true, color: colors.medium },
          "2021-10-25": { color: colors.medium },
          "2021-10-26": { endingDay: true, color: colors.medium },
        }}
        monthFormat={"MMM" + "  yyyy"}
        theme={{
          calendarBackground: colors.background,
          agendaKnobColor: colors.medium,
        }}
        hideExtraDays={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    flexDirection: "row",
    position: "absolute",
    justifyContent: "flex-end",
    paddingTop: 22,
  },
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 10,
    borderColor: colors.medium,
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    height: 10,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  mainText: {
    fontSize: 22,
    fontWeight: "300",
    paddingBottom: 10,
  },
  icon: {
    paddingRight: 7,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "500",
    paddingBottom: 2,
  },
  safe: {
    flex: 1,
  },
});

export default WeekCalendar;
