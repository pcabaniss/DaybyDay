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
  SafeAreaView,
  Dimensions,
  FlatList,
} from "react-native";
// @ts-expect-error

import { Agenda } from "react-native-calendars";
import colors from "../../config/colors";
import CalendarSeperator from "../CalendarSeperator";
import { useIsFocused } from "@react-navigation/core";
import Screen from "../Screen";

const testIDs = require("../Test");

const timeFormatter = (date) => {
  const temp = new Date(date);
  const d = moment(temp).format("hh:mm A");
  return d;
};
const markedDay = {};

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};

const WeekCalendar = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [items, setItems] = useState();
  const [date, setDate] = useState({});
  const [custom, setCustom] = useState(true);

  const dateInPast = (
    day,
    title,
    timeStart,
    timeEnd,
    description,
    id,
    isCustom
  ) => {
    const newDate = new Date(day);
    const currentDate = new Date();
    if (newDate <= currentDate) {
      Alert.alert("Cannot edit current or past events.");
    } else {
      navigation.navigate("View", {
        day: day,
        title: title,
        timeStart: timeStart,
        timeEnd: timeEnd,
        description: description,
        id: id,
        isCustom: isCustom,
      });
    }
  };

  const loadItems = (day) => {
    console.log("Loading items....");
    setDate(day);
    setTimeout(() => {
      const load = async () => {
        for (let i = -15; i < 85; i++) {
          const time = day.timestamp + i * 24 * 60 * 60 * 1000;
          const strTime = timeToString(time);

          if (!items[strTime]) {
            items[strTime] = [];
            pullDate(strTime).then((result) => {
              if (result != undefined) {
                result.forEach((item) => {
                  markedDay[strTime] = {
                    marked: true,
                    startingDay: true,
                    endingDay: true,
                    color: colors.background,
                    dotColor: colors.background,
                  };
                  items[strTime].push({
                    name: item.title,
                    time:
                      timeFormatter(item.timeStart) +
                      " - " +
                      timeFormatter(item.timeFinish),
                    subText: item.description,
                    height: "100%",
                    date: strTime,
                    timeStart: item.timeStart,
                    timeEnd: item.timeFinish,
                    id: item.id,
                  });
                  renderItem(items[strTime]);
                });
              }
            });
          } else {
            renderEmptyDate(strTime);
          }
        }
        const newItems = {};
        Object.keys(items).forEach((key) => {
          newItems[key] = items[key];
        });
        setItems(newItems);
      };

      load();
    }, 1000);
  };

  useEffect(() => {
    //setItems(items);
    const refresh = navigation.addListener("focus", () => {
      setItems(updateDate());
      loadItems(date);
    });
    loadItems(date);
    return refresh;
  }, [isFocused]);

  const updateDate = async () => {
    console.log("updating........");
    const newItems = {};
    Object.keys(items).forEach((key) => {
      newItems[key] = items[key];
    });
    console.log("Done!");
    //loadItems(date);
    return newItems;
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

  const checkType = (itemName) => {
    if (itemName == "Scheduled appointment.") {
      setCustom(false);
    } else {
      setCustom(true);
    }
  };

  const renderItem = (item) => {
    return (
      <>
        <Screen style={styles.container}>
          <FlatList
            keyExtractor={(item, index) => item.name}
            data={items[item.date]}
            style={styles.list}
            ItemSeparatorComponent={CalendarSeperator}
            renderItem={({ item }) => {
              //checkType(item.name);
              return (
                <>
                  <TouchableOpacity
                    testID={testIDs.agenda.ITEM}
                    style={[styles.item, { height: item.height }]}
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
                          dateInPast(
                            item.date,
                            item.name,
                            new Date(item.timeStart),
                            new Date(item.timeEnd),
                            item.subText,
                            item.id,
                            custom
                          )
                        }
                      />
                    </View>
                  </TouchableOpacity>
                </>
              );
            }}
          />
        </Screen>
        <View style={styles.footer}>
          <MaterialCommunityIcons
            name={"tooltip-plus"}
            size={35}
            style={{ transform: [{ rotateX: "180deg" }] }}
            color={colors.white}
            onPress={() => navigation.navigate("Add", { day: item.date })}
          />
        </View>
        <CalendarSeperator />
      </>
    );
  };

  const renderEmptyDate = (day) => {
    const dayString = timeToString(day);
    return (
      <>
        <TouchableOpacity
          testID={testIDs.agenda.ITEM}
          style={[styles.item]}
          onPress={() => dateInPast(day)}
        >
          <Text style={styles.mainText}>{"Nothing scheduled today."}</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <MaterialCommunityIcons
            name={"tooltip-plus"}
            style={{
              transform: [{ rotateX: "180deg" }],
            }}
            size={35}
            color="white"
            onPress={() => navigation.navigate("Add", { day: dayString })}
          />
        </View>
        <CalendarSeperator />
      </>
    );
  };

  const rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name;
  };

  return (
    <Screen style={styles.safe}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        //selected={now.day}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={rowHasChanged}
        markingType={"period"}
        markedDates={markedDay}
        onDayPress={loadItems}
        onDayChange={loadItems}
        monthFormat={"MMMM" + "  yyyy"}
        theme={{
          backgroundColor: colors.primary,
          calendarBackground: colors.white,
          agendaKnobColor: colors.medium,
          agendaDayNumColor: colors.white,
          agendaDayTextColor: colors.white,
          dayTextColor: colors.primaryDark,
          selectedDayTextColor: colors.primaryLight,
          agendaTodayColor: colors.white,
        }}
        refreshing
        hideExtraDays
        showClosingKnob
      />
    </Screen>
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
  container: {
    flex: 1,
  },
  list: {
    paddingTop: 10,
  },
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 10,
    borderColor: colors.dark,
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    height: "100%",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 1.0,
    shadowRadius: 2,
    shadowColor: colors.dark,
    elevation: 5,
  },
  emptyDate: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 10,
    borderColor: colors.dark,
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    height: 50,
  },
  footer: {
    alignItems: "center",
    alignContent: "center",

    height: Dimensions.get("window").height - 20,
    paddingTop: 10,
    width: (Dimensions.get("window").width / 3) * 2 + 35,
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
