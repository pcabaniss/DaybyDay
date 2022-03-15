import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import listings from "../api/listings";
import SelectedIconViewed from "../components/SelectedIconViewed";

function ProfileScreen({ route, navigation }) {
  const menuItems = [
    {
      title: "Schedule",
      icon: {
        name: "calendar-month",
        backgroundColor: colors.black,
      },
      key: "schedule",
      onPress: () => console.log("Schedule"),
    },
    {
      title: "Message",
      icon: {
        name: "email-outline",
        backgroundColor: colors.black,
      },
      key: "Message",
      onPress: () => console.log("Message"),
    },
    {
      title: "Reviews",
      icon: {
        name: "star-circle-outline",
        backgroundColor: colors.black,
      },
      key: "reviews",
      onPress: () => console.log("Reviews"),
    },
    {
      title: "About",
      icon: {
        name: "information-outline",
        backgroundColor: colors.black,
      },
      key: "About",
      onPress: () => console.log("About"),
    },
  ];

  const { name, pic, email } = route.params;

  const [image, setImage] = useState(pic);
  const [about, setAbout] = useState(" ");

  var capEmail = email.charAt(0).toUpperCase() + email.slice(1);

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
          <FlatList
            data={menuItems}
            horizontal
            scrollEnabled={false}
            contentContainerStyle={styles.icon}
            renderItem={() => {
              return (
                <MaterialCommunityIcons
                  name="star"
                  size={20}
                  color={colors.yellow}
                />
              );
            }}
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
});

export default ProfileScreen;
