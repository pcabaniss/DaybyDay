import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { useIsFocused } from "@react-navigation/core";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import listings from "../api/listings";
import MessageForm from "./MessageForm";
import SchedulingCalendar from "./calendar/SchedulingCalendar";
import PhotoGallery from "./PhotoGallery";

const Tab = createBottomTabNavigator();

function SelectedIcon({ email, navigation }) {
  const [about, setAbout] = useState(" ");
  const [gallery, setGallery] = useState([{}]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const refresh = navigation.addListener("focus", () => {
      pullAboutInfo();
      getGallery();
    });
    return refresh;
  }, [isFocused]);

  const saveAbout = (text) => {
    pullAboutInfo();
    listings.saveAbout(text);
  };

  const pullAboutInfo = async () => {
    const data = await listings.getAbout();
    if (data != undefined || data != null) {
      setAbout(data);
    } else {
      console.log("Could not pull about info. ");
    }
  };

  const getGallery = async () => {
    var i = 0;
    var boat = [];
    const gallery = await listings.getImages(email);
    gallery[0].forEach((pic) => {
      boat.push({ id: i, url: pic });
      i++;
    });

    setGallery(boat);
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBarOptions={{
          tabStyle: {
            paddingBottom: 3,
            backgroundColor: colors.black,
            borderColor: colors.medium,
          },
          style: {
            backgroundColor: colors.white,
            borderTopColor: colors.black,
          },
          activeTintColor: colors.medium,
          inactiveTintColor: colors.white,
          showLabel: false,
        }}
      >
        <Tab.Screen
          name="Schedule"
          options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="calendar-month"
                color={color}
                size={25}
              />
            ),
          }}
        >
          {(props) => <SchedulingCalendar navigation={navigation} />}
        </Tab.Screen>
        <Tab.Screen
          name="Message"
          options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="message-text"
                color={color}
                size={25}
              />
            ),
          }}
        >
          {(props) => <MessageForm type="business" />}
        </Tab.Screen>
        <Tab.Screen
          name="Reviews"
          component={MessageForm}
          options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="star-circle-outline"
                color={color}
                size={25}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Pictures"
          options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="image-multiple-outline"
                color={color}
                size={22}
              />
            ),
          }}
        >
          {(props) => <PhotoGallery email={email} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column-reverse",
    height: "100%",
    backgroundColor: colors.black,
  },
});

export default SelectedIcon;
