import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import listings from "../api/listings";
import MessageForm from "./MessageForm";
import ViewSchedulingCalendar from "./calendar/ViewSchedulingCalendar";

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
                name="calendar"
                color={color}
                size={size}
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
          component={MessageForm}
          options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="email-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Reviews"
          component={MessageForm}
          options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="star-circle-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Pictures"
          component={MessageForm}
          options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="image-multiple-outline"
                color={color}
                size={size}
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
