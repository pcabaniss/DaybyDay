import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import AccountNavigator from "./AccountNavigator";
import colors from "../config/colors";
import CalendarNavigator from "./CalendarNavigator";
import ScheduleScreen from "../screens/SceduleScreen";
import useAuth from "../auth/useAuth";
import listings from "../api/listings";
import UserAccountNavigator from "./UserAccountNavigator";
import ProfileViewNavigator from "./ProfileViewNavigator";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const { user } = useAuth();
  const [isBusiness, setIsBusiness] = useState();
  const [badge, setBadge] = useState();

  const getBadges = async () => {
    const messages = await listings.getMessageBadges();

    if (isBusiness == true) {
      const count = await listings.getRequestBadges();
      if (badge != count + messages) {
        setBadge(count + messages);
      }
    } else {
      if (badge != messages && messages != 0) {
        setBadge(messages);
      }
    }
    if (badge == 0) {
      setBadge(undefined);
    }
  };

  useEffect(() => {
    getBadges();

    console.log("Fetched badges!");
  }, [isBusiness]);

  const checkBadges = () => {
    if (badge == 0) {
      setBadge(undefined);
    }
  };

  useEffect(() => {
    checkBadges();
  }, [badge]);

  const type = async (profile) => {
    const bool = await listings.pullProfileType(profile.email);
    setIsBusiness(bool);
  };
  type(user);

  return (
    <Tab.Navigator
      initialRouteName="Agenda"
      tabBarOptions={{
        activeTintColor: colors.primaryDark,

        tabStyle: {
          borderColor: colors.medium,
          borderTopWidth: 1,
        },
      }}
    >
      {isBusiness ? (
        <Tab.Screen
          name="Schedule"
          component={ScheduleScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="briefcase-clock"
                color={color}
                size={size}
              />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="Discover"
          component={ProfileViewNavigator}
          options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="briefcase-search"
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
            <MaterialCommunityIcons name="notebook" color={color} size={size} />
          ),
        }}
      />
      {isBusiness ? (
        <Tab.Screen
          name="Profile"
          component={AccountNavigator}
          options={{
            tabBarBadge: badge,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="Profile"
          component={UserAccountNavigator}
          options={{
            tabBarBadge: badge,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            ),
          }}
        />
      )}
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
