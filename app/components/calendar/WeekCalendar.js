import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import React, { Component, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
} from "react-native";
// @ts-expect-error
import { Agenda } from "react-native-calendars";
import colors from "../../config/colors";
import CalendarSeperator from "../CalendarSeperator";

const testIDs = require("../Test");

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};

const WeekCalendar = () => {
  const [items, setItems] = useState([]);

  const loadItems = (day) => {
    const now = moment();
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!items[strTime]) {
          items[strTime] = [];
          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            const num = j + 1;
            if (j === numItems - 1) {
              items[strTime].push({
                name: "Item # " + num + " for " + strTime,
                height: "100%",
                number: numItems,
                dateChanged: true,
              });
            } else {
              items[strTime].push({
                name: "Item # " + num + " for " + strTime,
                height: "100%",
                number: numItems,
                dateChanged: false,
              });
            }
          }
        } else {
          //Pull items from existing array of objects here
          //pullItems(item)
          /* 
          items[item.date].push({
                name: item.name
                height: "100%",
                number: numItems,
                dateChanged: false,
                */
        }
      }
      const newItems = [];
      Object.keys(items).forEach((key) => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 1000);
  };

  const renderItem = (item) => {
    if (item.number === 2) {
      item.name === "Empty!";
      renderEmptyDate;
    }
    if (item.dateChanged === false) {
      return (
        <>
          <TouchableOpacity
            testID={testIDs.agenda.ITEM}
            style={[styles.item, { height: item.height }]}
            onPress={() => Alert.alert(item.name)}
          >
            <Text>{item.name}</Text>
            <View style={styles.button}>
              <MaterialCommunityIcons
                name={"pencil"}
                size={20}
                color={colors.red}
                onPress={() => Alert.alert("Button Pressed!")}
              />
            </View>
          </TouchableOpacity>
        </>
      );
    } else {
      return (
        <>
          <TouchableOpacity
            testID={testIDs.agenda.ITEM}
            style={[styles.item, { height: item.height }]}
            onPress={() => Alert.alert(item.name)}
          >
            <Text>{item.name}</Text>
            <View style={styles.button}>
              <MaterialCommunityIcons
                name={"pencil"}
                size={20}
                color={colors.red}
                onPress={() => Alert.alert("Button Pressed!")}
              />
            </View>
          </TouchableOpacity>
          <CalendarSeperator />
        </>
      );
    }
  };

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
        <Button title={"Add Item"} color={colors.danger} />
      </View>
    );
  };

  const rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name;
  };

  const now = moment();

  return (
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
        "2021-08-08": { textColor: "#43515c" },
        "2021-08-09": { textColor: "#43515c" },
        "2021-08-14": {
          startingDay: true,
          endingDay: true,
          color: colors.danger,
        },
        "2021-08-21": { startingDay: true, color: colors.blue },
        "2021-08-22": { endingDay: true, color: colors.medium },
        "2021-08-24": { startingDay: true, color: colors.medium },
        "2021-08-25": { color: colors.medium },
        "2021-08-26": { endingDay: true, color: colors.medium },
      }}
      monthFormat={"MMM" + "  yyyy"}
      theme={{
        calendarBackground: colors.background,
        agendaKnobColor: colors.medium,
      }}
      hideExtraDays={false}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "flex-end",
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingBottom: 5,
  },
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 3,
    borderColor: colors.medium,
    borderWidth: 2,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
});

export default WeekCalendar;