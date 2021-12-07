import React from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import format from "date-fns/format";
import colors from "../config/colors";
import moment from "moment";

function AvailabilityScreen({ route }) {
  const { day } = route.params;

  const dateString = moment(day.timestamp)
    .utcOffset(360)
    .format("ddd MMM DD, yyyy");

  const highlighter = (isEmpty, isFull, almostFull) => {
    if (isEmpty == true) {
      return colors.green;
    } else if (isFull == true) {
      return colors.danger;
    } else if (almostFull == true) {
      return colors.orange;
    }
  };

  const onPressTime = (time) => {
    //An alert will pop up asking if you are sure that you want to
    //apply for this time slot? and if yes then send business a message
    //asking to confirm.
    console.log("You have selected the " + time + " time slot.");
  };
  //make a function that searches the database for open hours on that day,
  //and only display the hours in-between

  //checkDate will be called onClick and return an array of con
  const hours = [
    {
      time: "9:00am",
      isEmpty: true,
      isFull: false,
      almostFull: false,
      key: "0900",
    },
    {
      time: "10:00am",
      isEmpty: true,
      isFull: false,
      almostFull: false,
      key: "1000",
    },
    {
      time: "11:00am",
      isEmpty: false,
      isFull: false,
      almostFull: true,
      key: "1100",
    },
    {
      time: "12:00pm",
      isEmpty: true,
      isFull: false,
      almostFull: false,
      key: "1200",
    },
    {
      time: "1:00pm",
      isEmpty: false,
      isFull: false,
      almostFull: true,
      key: "1300",
    },
    {
      time: "2:00pm",
      isEmpty: false,
      isFull: true,
      almostFull: false,
      key: "1400",
    },
    {
      time: "3:00pm",
      isEmpty: false,
      isFull: true,
      almostFull: false,
      key: "1500",
    },
    {
      time: "4:00pm",
      isEmpty: true,
      isFull: false,
      almostFull: false,
      key: "1600",
    },
    {
      time: "5:00pm",
      isEmpty: true,
      isFull: false,
      almostFull: false,
      key: "1700",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.date}>{dateString}</Text>
      <FlatList
        data={hours}
        scrollEnabled={true}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPressTime(item.time)}>
            <View
              style={{
                backgroundColor: highlighter(
                  item.isEmpty,
                  item.isFull,
                  item.almostFull
                ),
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
              <Text style={{ textAlign: "center" }}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
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
});

export default AvailabilityScreen;
