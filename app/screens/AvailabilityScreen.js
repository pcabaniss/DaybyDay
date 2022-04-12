import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useIsFocused } from "@react-navigation/core";
import colors from "../config/colors";
import moment from "moment";
import SpaceSeperator from "../components/SpaceSeperator";
import listings from "../api/listings";
import Notifications from "../api/Notifications";

function AvailabilityScreen({ route, navigation }) {
  const { day, hours, business, duration, picture } = route.params;
  console.log("This is the day ");
  console.log(day);
  const [dayHours, setDayHours] = useState(hours);
  const [pendingArray, setPendingArray] = useState([]);
  const [accepted, setAcceptedArray] = useState([]);
  const [pic, setPic] = useState(picture);

  const isFocused = useIsFocused();

  useEffect(() => {
    const refresh = navigation.addListener("focus", () => {
      var arg = [];
      var accept = [];
      hours.forEach(async (time) => {
        var pending = await listings.getPendingRequests(
          business,
          day.dateString,
          time.time
        );
        var availiableSpots = await listings.getAcceptedRequests(
          business,
          day.dateString,
          time.time
        );
        arg.push(pending);
        accept.push(availiableSpots);
      });
      setPendingArray(arg);
      setAcceptedArray(accept);
    });
    return refresh;
  }, [isFocused]);

  //find a way to get profile info to send message
  const dateString = moment(day.timestamp)
    .utcOffset(360)
    .format("ddd MMM DD, yyyy");

  const highlighter = (slots, taken) => {
    const total = slots - taken;
    if (total == 0) {
      return colors.danger;
    } else if (total <= slots) {
      return colors.green;
    }
  };

  const clickedYes = (time) => {
    console.log("I clicked yes for " + time + " on " + day.dateString);
    const currentTime = moment().format("MM-DD hh:mm:ss a");
    listings.sendRequest(
      time,
      day.dateString,
      business,
      currentTime,
      duration,
      pic
    );
    //Send notification to business device

    Notifications.sendNotification(
      business,
      "New request!",
      "Respond quickly to book the appointment.",
      currentTime,
      true
    );
    /**users name: {
     * request: 'approved', 'denied', or 'pending'
     * } */
    navigation.goBack(null);
  };

  const onPressTime = async (time, slots, taken) => {
    //An alert will pop up asking if you are sure that you want to
    //apply for this time slot? and if yes then send business a message
    //asking to confirm.
    const total = slots - taken;

    const count = await listings.getNumberOfRequest(day.dateString, business);
    var current = 2 - count;
    if (count == undefined) {
      current = 2;
    }
    if (count < 2 && total > 0) {
      Alert.alert(
        "Are you sure you want to request this slot?",
        "You have " + current + " remaining requests for today.",
        [
          {
            text: "Yes, im sure.",
            onPress: () => {
              clickedYes(time);
            },
          },

          {
            text: "No",
            style: "cancel",
          },
        ]
      );
    } else if (total == 0) {
      Alert.alert("There are no remaing spots for this time slot.");
    } else if (current == 0) {
      Alert.alert("You have no remaing requests today.");
    }
  };
  //make a function that searches the database for open hours on that day,
  //and only display the hours in-between

  //checkDate will be called onClick and return an array of con

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.date}>{dateString}</Text>
      <FlatList
        data={dayHours}
        scrollEnabled
        ItemSeparatorComponent={SpaceSeperator}
        renderItem={({ item }) => {
          //Needs a function here checking the date for any matching times.
          console.log(item.key);
          return (
            <TouchableOpacity
              onPress={() =>
                onPressTime(item.time, item.slots, accepted[item.key])
              }
            >
              <View
                style={{
                  backgroundColor: highlighter(item.slots, accepted[item.key]),
                  alignSelf: "center",
                  height: 75,
                  borderWidth: 2,
                  borderColor: colors.black,
                  width: "98%",
                  alignContent: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                }}
              >
                <Text style={styles.header}>{item.time}</Text>
                <Text style={styles.footer}>
                  Available slots: {item.slots - accepted[item.key]}
                </Text>
                <Text style={styles.footer}>
                  Pending requests: {pendingArray[item.key]}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  date: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    paddingBottom: 10,
    paddingTop: 10,
  },
  header: {
    textAlign: "center",
  },
  footer: {
    fontSize: 10,
    paddingLeft: 10,
  },
});

export default AvailabilityScreen;
