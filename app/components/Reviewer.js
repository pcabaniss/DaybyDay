import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { AirbnbRating } from "react-native-ratings";
import colors from "../config/colors";
import listings from "../api/listings";

function Reviewer({ navigation, route }) {
  const { business } = route.params;
  const [stars, setStars] = useState(3);
  const [review, setReview] = useState(" ");

  const pressedSubmit = async () => {
    listings.saveRating(business, stars, review);
    navigation.goBack();
  };

  const starPressed = (rating) => {
    setStars(rating);
  };

  const onChangeText = (text) => {
    setReview(text);
  };

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
            color={colors.primaryDark}
          />
        </TouchableOpacity>
        <AirbnbRating
          count={5}
          reviews={[
            "Not a good time",
            "Needs improvement",
            "Okay",
            "Had a good time",
            "Amazing!",
          ]}
          reviewColor={colors.primaryDark}
          starContainerStyle={{ paddingBottom: 15 }}
          onFinishRating={starPressed}
        />
        <TextInput
          style={styles.text}
          placeholder="Leave a detailed review here."
          autoCapitalize="sentences"
          multiline
          textAlignVertical="top"
          onChangeText={onChangeText}
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
    backgroundColor: colors.primary,
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
    backgroundColor: "white",
    padding: 10,
    borderColor: colors.dark,
    borderWidth: 5,
    borderRadius: 50,
    alignSelf: "center",
  },
  text: {
    borderColor: colors.dark,
    backgroundColor: "white",
    borderWidth: 2,
    paddingLeft: 5,
    borderRadius: 5,
    height: 120,
  },
});

export default Reviewer;
