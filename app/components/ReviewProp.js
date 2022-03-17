import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { AirbnbRating } from "react-native-ratings";

import colors from "../config/colors";
// A prop to hold the individual reviews
function ReviewProp({ user, review, rating }) {
  const newEmail = user.charAt(0).toUpperCase() + user.slice(1);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 20 }}>{newEmail}</Text>
        <AirbnbRating
          defaultRating={rating}
          size={20}
          showRating={false}
          isDisabled
        />
      </View>
      <Text>{review}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    height: 150,
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    alignSelf: "center",
    padding: 10,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1.0,
    shadowRadius: 2,
    shadowColor: "rgba(193, 211, 251, 0.5)",
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});

export default ReviewProp;
