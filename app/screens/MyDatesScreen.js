import React from "react";
import { Text, View, StyleSheet } from "react-native";
import colors from "../config/colors";

function MyDatesScreen(props) {
  return (
    <View style={styles.container}>
      <Text>
        This is the screen that will contain all of the scheduled dates in the
        database it will pull and display all of them and then you can easily
        edit or delete them from one screen!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue,
  },
});

export default MyDatesScreen;
