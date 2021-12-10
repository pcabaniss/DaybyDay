import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import colors from "../config/colors";
import moment from "moment";
import SpaceSeperator from "../components/SpaceSeperator";

function AvailabilityScreen({ route }) {
  const { day, hours } = route.params;
  const [dayHours, setDayHours] = useState(hours);

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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.date}>{dateString}</Text>
      <FlatList
        data={dayHours}
        scrollEnabled={true}
        ItemSeparatorComponent={SpaceSeperator}
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
              <Text style={styles.header}>{item.time}</Text>
              <Text style={styles.footer}>Available slots: {item.slots}</Text>
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
  header: {
    textAlign: "center",
  },
  footer: {
    fontSize: 10,
    paddingLeft: 10,
  },
});

export default AvailabilityScreen;
