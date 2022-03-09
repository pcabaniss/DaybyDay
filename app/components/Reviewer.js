import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Rating, AirbnbRating } from "react-native-ratings";
import colors from "../config/colors";

function Reviewer({ navigation }) {
  const pressedSubmit = () => {};

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <TouchableOpacity
          style={styles.header}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="chevron-down"
            size={30}
            color={colors.green}
          />
        </TouchableOpacity>
        <AirbnbRating
          count={5}
          reviews={[
            "Terrible",
            "Pretty bad",
            "So-So",
            "Pretty good",
            "Amazing!",
          ]}
          reviewColor={colors.green}
          starContainerStyle={{ paddingBottom: 15 }}
        />
        <TextInput
          style={styles.text}
          placeholder="Leave a detailed review here."
          autoCapitalize="sentences"
          multiline
          textAlignVertical="top"
        />
        <Button title="Submit" onPress={pressedSubmit} color={colors.white} />
      </View>
      <View style={{ height: "30%" }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column-reverse",
    justifyContent: "flex-end",
  },
  header: {
    backgroundColor: colors.medium,
    borderColor: colors.dark,
    borderWidth: 3,
    borderRadius: 5,
    height: 30,
    width: "40%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  main: {
    height: "42%",
    width: "96%",
    backgroundColor: colors.black,
    padding: 10,
    borderColor: colors.dark,
    borderWidth: 5,
    borderRadius: 50,
    alignSelf: "center",
  },
  text: {
    borderColor: colors.dark,
    backgroundColor: colors.white,
    borderWidth: 2,
    paddingLeft: 5,
    borderRadius: 5,
    height: 120,
  },
});

export default Reviewer;
