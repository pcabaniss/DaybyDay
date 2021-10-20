import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import AccountNavigator from "./AccountNavigator";
import colors from "../config/colors";
import CalendarNavigator from "./CalendarNavigator";
import DiscoverScreen from "../screens/DiscoverScreen";
import ScheduleScreen from "../screens/SceduleScreen";
import useAuth from "../auth/useAuth";
import listings from "../api/listings";
import { useState } from "react";
import ScheduleNavigator from "./ScheduleNavigator";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const { user } = useAuth();
  const [isBusiness, setIsBusiness] = useState();
  const type = async (profile) => {
    const bool = await listings.pullProfileType(profile.email);
    setIsBusiness(bool);
    console.log("Your Profile Type is? :" + bool);
  };
  type(user);

  return (
    <Tab.Navigator
      initialRouteName="Agenda"
      tabBarOptions={{
        tabStyle: {
          borderColor: colors.black,
          borderTopWidth: 2,
        },
      }}
    >
      {isBusiness ? (
        <Tab.Screen
          name="Schedule"
          component={ScheduleNavigator}
          options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="calendar"
                color={color}
                size={size}
              />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="Discover"
          component={DiscoverScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="calendar-search"
                color={color}
                size={size}
              />
            ),
          }}
        />
      )}
      <Tab.Screen
        name="Agenda"
        component={CalendarNavigator}
        options={{
          //tabBarButton: ({ color }) => <NewListingButton color={color} onPress={() => navigation.navigate("WeekCalendar")} />,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="calendar-text"
              color={color}
              size={size}
            />
          ),
        }}
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
};

const styles = StyleSheet.create({
  seperator: {
    width: "90%",
    left: 20,
    height: 1,

    backgroundColor: colors.black,
  },
});

export default AppNavigator;
