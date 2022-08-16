import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  Alert,
  TouchableOpacity,
  ScrollView,
  Button,
} from "react-native";
import colors from "../config/colors";
import moment from "moment";
import SpaceSeperator from "../components/SpaceSeperator";
import listings from "../api/listings";
import Notifications from "../api/Notifications";

function AvailabilityScreen({ route, navigation }) {
  const { day, hours, business, duration, picture } = route.params;

  const [pendingArray, setPendingArray] = useState([]);
  const [accepted, setAcceptedArray] = useState([]);

  useEffect(() => {
    var arg = [];
    var accept = [];
    hours.forEach(async (time) => {
      const pending = await listings.getPendingRequests(
        business,
        day.dateString,
        time.time
      );
      const availiableSpots = await listings.getAcceptedRequests(
        business,
        day.dateString,
        time.time
      );

      setPendingArray((pendingArray) => [...pendingArray, pending]);
      setAcceptedArray((accepted) => [...accepted, availiableSpots]);
    });
  }, []);

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
    } else {
      return colors.primaryLight;
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
      picture
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

  const getSlots = (avail, taken) => {
    if (taken == undefined) {
      const total = avail - 0;
      return total;
    } else {
      const other = avail - taken;
      return other;
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Button
          title="Go back"
          color={colors.primaryLight}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.date}>{dateString}</Text>
        {hours.map((item, index) => (
          <>
            <TouchableOpacity
              key={index}
              onPress={() =>
                onPressTime(item.time, item.slots, accepted[item.key])
              }
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
            </TouchableOpacity>
            <SpaceSeperator />
          </>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: colors.primary,
  },
  date: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: colors.primary,
  },
  header: {
    textAlign: "center",
    fontWeight: "bold",
  },
  footer: {
    fontSize: 12,
    paddingLeft: 10,
  },
});

export default AvailabilityScreen;
