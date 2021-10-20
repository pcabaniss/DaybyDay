import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import colors from "../config/colors";
import AppText from "../components/AppText";
import ListItemSeperator from "../components/ListItemSeperator";
import CalendarSeperator from "../components/CalendarSeperator";
import Seperator from "../components/Seperator";

const days = [
  { day: "Sunday", key: "S" },
  { day: "Monday", key: "M" },
  { day: "Tuesday", key: "T" },
  { day: "Wednesday", key: "W" },
  { day: "Thursday", key: "Th" },
  { day: "Friday", key: "F" },
  { day: "Saturday", key: "Sa" },
];

//On click will be to toggle day on/off and each box will contain two
//Timepickers

function EditScheduleScreen(props) {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={days}
        ItemSeparatorComponent={Seperator}
        renderItem={(day) => {
          return (
            <TouchableOpacity style={styles.in}>
              <View style={styles.detailsContainer}>
                <AppText style={styles.title} numberOfLines={1}>
                  {day.item.day}
                </AppText>
                {day.item.day && (
                  <AppText style={styles.subTitle} numberOfLines={2}>
                    {day.item.day}
                  </AppText>
                )}
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
    backgroundColor: colors.black,
    alignItems: "center",
    flex: 1,
    padding: 5,
  },
  detailsContainer: {
    width: Dimensions.get("screen").width - 10,
    height: "100%",
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.black,
    padding: 5,
    borderRadius: 10,
  },
  in: {
    flex: 1,
    //height: Dimensions.get("screen").height / 8,
  },
  subTitle: {
    color: colors.medium,
  },
  title: {
    fontWeight: "600",
  },
});

export default EditScheduleScreen;
