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

//Need to pull the current date that i clicked on and pass it to the database
// for reference
import { Agenda } from "react-native-calendars";
import colors from "../../config/colors";
import CalendarSeperator from "../CalendarSeperator";
import { useIsFocused } from "@react-navigation/core";
import Screen from "../Screen";

const testIDs = require("../Test");

const timeFormatter = (date) => {
  let d = moment(date).utcOffset(date);
  return d.format("hh:mm A");
};
const markedDay = {};

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};

const dateInPast = (clickedDate) => {
  const newDate = new Date(clickedDate);
  const currentDate = new Date();
  if (newDate.setHours(0, 0, 0, 0) <= currentDate.setHours(0, 0, 0, 0)) {
    return Alert.alert("Cannot edit event in the past.");
  }
};

const WeekCalendar = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [items, setItems] = useState({});
  const [date, setDate] = useState({});
  const [custom, setCustom] = useState(true);

  const loadItems = (day) => {
    console.log("Loading items....");
    setDate(day);
    setTimeout(async () => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);

        if (!items[strTime]) {
          items[strTime] = [];
          const result = pullDate(strTime).then((result) => {
            if (result != undefined) {
              result.forEach((item) => {
                const timeSt = timeFormatter(item.timeStart);
                const timeEn = timeFormatter(item.timeFinish);
                markedDay[strTime] = {
                  marked: true,
                  startingDay: true,
                  endingDay: true,
                  color: colors.background,
                  dotColor: colors.background,
                };
                items[strTime].push({
                  name: item.title,
                  time: item.timeStart + " - " + item.timeFinish,
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
    }, 1000);
  };

  useEffect(() => {
    setItems(items);
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
              if (item.name == "Scheduled appointment.") {
                setCustom(false);
              } else {
                setCustom(true);
              }
              return (
                <>
                  <TouchableOpacity
                    testID={testIDs.agenda.ITEM}
                    style={[styles.item, { height: item.height }]}
                    onPress={() => dateInPast(item.date)}
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
                            timeStart: item.timeStart,
                            timeEnd: item.timeEnd,
                            description: item.subText,
                            id: item.id,
                            isCustom: custom,
                          })
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
            color={colors.green}
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
          backgroundColor: colors.black,
          calendarBackground: colors.light,
          agendaKnobColor: colors.medium,
          agendaDayNumColor: colors.white,
          agendaDayTextColor: colors.white,
          dayTextColor: colors.black,
          selectedDayTextColor: colors.danger,
          agendaTodayColor: colors.green,
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
