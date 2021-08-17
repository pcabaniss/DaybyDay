import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import AccountScreen from "../screens/AccountScreen";
import ListingEditScreen from "../screens/ListingEditScreen";
import FeedNavigator from "./FeedNavigator";
import AccountNavigator from "./AccountNavigator";
import NewListingButton from "./NewListingButton";
import colors from "../config/colors";
import WeekCalendar from "../components/calendar/WeekCalendar";

const Tab = createBottomTabNavigator();

const AppNavigator = () => (
  <Tab.Navigator
    tabBarOptions={{
      tabStyle: {
        borderColor: colors.black,
        borderTopWidth: 2,
      },
    }}
  >
    <Tab.Screen
      name="Calendar"
      component={WeekCalendar}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="calendar-month"
            color={color}
            size={size}
          />
        ),
      }}
    />
    <Tab.Screen
      name="ListingEdit"
      component={ListingEditScreen}
      options={({ navigation }) => ({
        tabBarButton: () => (
          <NewListingButton
            onPress={() => navigation.navigate("ListingEdit")}
          />
        ),
        tabBarIcon: ({ size }) => (
          <MaterialCommunityIcons
            name="calendar-plus"
            color={colors.medium}
            size={size}
          />
        ),
      })}
    />
    <Tab.Screen
      name="Profile"
      component={AccountNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  seperator: {
    width: "90%",
    left: 20,
    height: 1,

    backgroundColor: colors.black,
  },
});

export default AppNavigator;
