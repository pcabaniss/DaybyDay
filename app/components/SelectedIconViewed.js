import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import MessageForm from "./MessageForm";
import ViewSchedulingCalendar from "./calendar/ViewSchedulingCalendar";
import PhotoGallery from "./PhotoGallery";

const Tab = createBottomTabNavigator();

function SelectedIconViewed({ navigation, email }) {
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
          {(props) => (
            <ViewSchedulingCalendar navigation={navigation} email={email} />
          )}
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
          {(props) => <MessageForm type="user" />}
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
          component={PhotoGallery}
          options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="image-multiple-outline"
                color={color}
                size={22}
              />
            ),
          }}
        />
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

export default SelectedIconViewed;
