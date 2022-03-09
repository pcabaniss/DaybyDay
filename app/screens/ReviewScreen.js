import React from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import colors from "../config/colors";
import { AirbnbRating } from "react-native-ratings";
import PercentageBar from "../components/PercentageBar";
import SpaceSeperator from "../components/SpaceSeperator";

//This screen will show the overall review rating and give option to leave
//a review if you are a user (only once).

function ReviewScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button
        title="Add a review."
        color={colors.orange}
        onPress={() => navigation.navigate("input")}
      />
      <Text style={styles.title}>Customer reviews</Text>
      <View style={styles.stars}>
        <AirbnbRating count={5} showRating={false} size={30} />
        <Text>4 out 5</Text>
      </View>
      <View style={styles.bars}>
        <PercentageBar starText={"5 Star"} percentage={75} />
        <SpaceSeperator />
        <PercentageBar starText={"4 Star"} percentage={30} />
        <SpaceSeperator />
        <PercentageBar starText={"3 Star"} percentage={15} />
        <SpaceSeperator />
        <PercentageBar starText={"2 Star"} percentage={5} />
        <SpaceSeperator />
        <PercentageBar starText={"1 Star"} percentage={5} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bars: {
    marginTop: 40,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingBottom: 40,
    minWidth: "80%",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1.0,
    shadowRadius: 2,
    shadowColor: "rgba(193, 211, 251, 0.5)",
    elevation: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#323357",
    textAlign: "center",
  },
  stars: {
    marginTop: 20,
    marginBottom: 5,
    flexDirection: "row",
    backgroundColor: "#F5F8FF",
    borderRadius: 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default ReviewScreen;
