import React, { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet, ScrollView } from "react-native";
import { Rating } from "react-native-ratings";
import { useIsFocused } from "@react-navigation/core";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import listings from "../api/listings";
import SelectedIconViewed from "../components/SelectedIconViewed";

function ProfileScreen({ route, navigation }) {
  const { name, pic, email } = route.params;

  const isFocused = useIsFocused();

  const [image, setImage] = useState(pic);
  const [about, setAbout] = useState(" ");
  const [rating, setRating] = useState(4);
  const [myEmail, setMyEmail] = useState("");
  const [myUserName, setMyUserName] = useState("");
  const [myPic, setMyPic] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const getEmail = listings.returnEmail();

    const ver = listings.checkIfVerified();

    setVerified(ver);

    setMyEmail(getEmail);

    getRating();
  }, [isFocused]);

  useEffect(() => {
    const getInfo = async () => {
      const un = await listings.getMyName();

      setMyUserName(un);

      const pp = await listings.getProfilePic(myEmail);

      setMyPic(pp);
    };

    getInfo();
  }, [myEmail]);

  const isVerified = () => {
    return (
      <MaterialCommunityIcons
        name="check-circle"
        size={15}
        color={colors.greenCheck}
      />
    );
  };

  const isNotVerified = () => {
    return (
      <MaterialCommunityIcons
        name="close-box"
        size={15}
        color={colors.danger}
      />
    );
  };

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

  const pressedDots = () => {
    navigation.navigate("Extra", { business: capEmail });
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
            {capEmail} {verified ? isVerified() : isNotVerified()}
          </Text>

          <View style={styles.dotDotDot}>
            <View style={{ justifyContent: "flex-start" }}>
              <Rating
                type="custom"
                ratingCount={5}
                showRating={false}
                tintColor={colors.black}
                startingValue={rating}
                ratingColor={colors.yellow}
                style={{ padding: 5, alignSelf: "flex-start" }}
                ratingBackgroundColor={colors.light}
                readonly
                imageSize={20}
              />
            </View>
            <View style={{ justifyContent: "flex-end" }}>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={35}
                color={colors.white}
                onPress={() => pressedDots()}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.boxContainer}>
        {
          <SelectedIconViewed
            navigation={navigation}
            business={email}
            businessPic={pic}
            businessName={name}
            myUN={myUserName}
            myPP={myPic}
          />
        }
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
  dotDotDot: {
    //backgroundColor: colors.green,
    justifyContent: "space-between",
    flexDirection: "row",
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
