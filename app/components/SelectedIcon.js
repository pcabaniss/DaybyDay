import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import MessageForm from "./MessageForm";
import SchedulingCalendar from "./calendar/SchedulingCalendar";
import PhotoGallery from "./PhotoGallery";
import ReviewScreen from "../screens/ReviewScreen";
import listings from "../api/listings";

const Tab = createBottomTabNavigator();

function SelectedIcon({ email, navigation }) {
  const [images, setImages] = useState();

  useEffect(() => {
    const getGallery = async () => {
      const gallery = await listings.getImages(email);

      setImages(gallery);
    };

    getGallery();
  }, []);
  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBarOptions={{
          tabStyle: {
            paddingBottom: 3,
            borderColor: colors.black,
            backgroundColor: colors.primaryLight,
            //alignSelf: "center",
            //padding: 10,
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 1.0,
            shadowRadius: 2,
            shadowColor: "rgba(193, 211, 251, 0.5)",
            elevation: 5,
          },
          style: {
            backgroundColor: colors.white,
            borderTopColor: colors.black,
          },
          activeTintColor: colors.primaryDark,
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
          options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="star-circle-outline"
                color={color}
                size={25}
              />
            ),
          }}
        >
          {(props) => (
            <ReviewScreen
              navigation={navigation}
              business={email}
              isUser={false}
            />
          )}
        </Tab.Screen>
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
          {(props) => (
            <PhotoGallery email={email} isUser={false} gallery={images} />
          )}
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
