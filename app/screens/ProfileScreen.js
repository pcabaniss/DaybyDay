import React, { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet, ScrollView } from "react-native";
import { Rating } from "react-native-ratings";
import { useIsFocused } from "@react-navigation/core";

import colors from "../config/colors";
import listings from "../api/listings";
import SelectedIconViewed from "../components/SelectedIconViewed";

function ProfileScreen({ route, navigation }) {
  const { name, pic, email } = route.params;

  const isFocused = useIsFocused();

  const [image, setImage] = useState(pic);
  const [about, setAbout] = useState(" ");
  const [rating, setRating] = useState(4);

  useEffect(() => {
    getRating();
  }, [isFocused]);

  var capEmail = email.charAt(0).toUpperCase() + email.slice(1);
  const getRating = async () => {
    const gotRating = await listings.getRatings(email);

    var count = 0;
    var total = 0;

    gotRating.map((item) => {
      count++;
      total = total + item.rating;
    });

    const totalStars = (total / count).toFixed(1);
    //console.log(totalStars);
    setRating(totalStars);
  };
  const pullAboutInfo = async (email) => {
    const data = await listings.getAboutFor(email);
    if (data != undefined || data != null) {
      setAbout(data);
    } else {
      setAbout("No information yet!");
    }
  };
  pullAboutInfo(email);
  return (
    <ScrollView scrollEnabled style={{ backgroundColor: colors.dark }}>
      <View style={styles.picContainer}>
        <Image source={{ uri: image }} style={styles.profilePic} />
        <View style={{ paddingLeft: 10, flex: 1 }}>
          <Text style={styles.aboutText}>{about}</Text>
        </View>
      </View>
      <View style={styles.nameBox}>
        <View style={{ paddingRight: 10 }}>
          <Text style={styles.nameText}>{name}</Text>

          <Text style={{ paddingLeft: 5, color: colors.light }}>
            {capEmail}
          </Text>

          <Rating
            type="custom"
            ratingCount={5}
            showRating={false}
            tintColor={colors.black}
            startingValue={rating}
            ratingColor={colors.yellow}
            style={{ padding: 10, alignSelf: "flex-start" }}
            ratingBackgroundColor={colors.light}
            readonly
            imageSize={20}
          />
        </View>
      </View>
      <View style={styles.boxContainer}>
        {<SelectedIconViewed navigation={navigation} business={email} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  aboutText: {
    fontSize: 18,
    paddingTop: 10,
    color: colors.white,
    borderRadius: 10,
    padding: 15,
    flex: 1,
  },
  nameBox: {
    backgroundColor: colors.black,
    width: "100%",
    paddingLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  boxContainer: {
    height: 500,
  },

  picContainer: {
    flex: 1,
    flexDirection: "row",

    //width: "100%",
    padding: 5,
    backgroundColor: colors.black,
  },
  profilePic: {
    height: 120,
    width: 120,
    borderColor: colors.medium,
    borderRadius: 90,
    borderWidth: 1,
    overflow: "hidden",
  },
  nameText: {
    fontSize: 30,
    paddingLeft: 3,
    fontWeight: "bold",
    color: colors.dark,
  },
  icon: {
    borderRadius: 17,
    paddingLeft: 4,
    paddingTop: 5,
    //flex: 1,
    //backgroundColor: colors.white,
    width: "100%",
  },
  stars: {
    backgroundColor: colors.black,
    borderRadius: 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: "center",
  },
});

export default ProfileScreen;
