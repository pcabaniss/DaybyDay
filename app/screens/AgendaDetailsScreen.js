import React from "react";
import { View, StyleSheet, Text } from "react-native";
import colors from "../config/colors";
import moment from "moment";
import {} from "date-fns";

const timeFormatter = (date) => {
  let d = moment(date).utcOffset(date);
  return d.format("dddd MMMM D, YYYY");
};

function AgendaDetailsScreen({ navigation, route }) {
  const { day, title, time, description, category } = route.params;

  const currentDate = timeFormatter(day);

  return (
    <View style={styles.container}>
      <Text>This is your {currentDate} screen</Text>
      <Text>{title}</Text>
      <Text>{time}</Text>
      <Text>{description}</Text>
      <Text>{category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
  },
});

export default AgendaDetailsScreen;
