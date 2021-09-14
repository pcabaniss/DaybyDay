import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import React, { Component, useState } from "react";
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

const testIDs = require("../Test");

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};

const getDates = () => {};

const WeekCalendar = ({ navigation }) => {
  const [items, setItems] = useState({});
  const [date, setDate] = useState();

  const loadItems = (day) => {
    setTimeout(async () => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        setDate(strTime);

        if (!items[strTime]) {
          items[strTime] = [];
          const result = await pullDate(strTime).then((result) => {
            if (result != undefined) {
              items[strTime].push({
                name: result.title,
                height: "100%",
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
          renderEmptyDate(items);
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
    if (item.dateChanged === false) {
      return (
        <>
          <TouchableOpacity
            testID={testIDs.agenda.ITEM}
            style={[styles.item, { height: item.height }]}
            onPress={() => pullDate(item.name)}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        </>
      );
    } else if (item.onlyDate === true) {
      return (
        <>
          <TouchableOpacity
            testID={testIDs.agenda.ITEM}
            style={[styles.item, { height: 15 }]}
            onPress={() => pullDate(item.name)}
          >
            <Text>{item.name}</Text>
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
            onPress={() => pullDate(item.name)}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
          <CalendarSeperator />
        </>
      );
    }
  };

  const pullDate = async (date) => {
    const result = await listingsApi.getDate(date);

    if (result === null) {
      return null;
    } else {
      return result;
    }
    //resetForm();
  };

  const renderEmptyDate = (item) => {
    return (
      <>
        <TouchableOpacity
          testID={testIDs.agenda.ITEM}
          style={[styles.item, { height: 15 }]}
          onPress={() => Alert.alert("Add Event")}
        >
          <Text>{"Nothing scheduled today."}</Text>
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
    </SafeAreaView>
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
  safe: {
    flex: 1,
  },
});

export default WeekCalendar;
