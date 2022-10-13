import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import MyDatesScreen from "../screens/RequestsScreen";
import HelpAndSupport from "../screens/HelpAndSupport";
import MessagingNavigator from "./MessagingNavigator";
import UserProfileSettingsScreen from "../screens/UserProfileSettingsScreen";
import SettingsNavigator from "./SettingsNavigator";
import colors from "../config/colors";

const Stack = createStackNavigator();

const UserAccountNavigator = () => (
  <Stack.Navigator mode="modal">
    <Stack.Screen
      name="Account"
      component={AccountScreen}
      options={{
        headerTitle: "",
        headerTransparent: true,
        headerStyle: {
          borderColor: colors.black,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
      }}
    />
    <Stack.Screen
      name="Edit Profile"
      component={UserProfileSettingsScreen}
      options={{
        headerBackTitle: " ",
        headerTitle: "",
        headerTransparent: true,
        headerStyle: {
          borderColor: colors.black,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
      }}
    />
    <Stack.Screen
      options={{
        headerShown: false,

        headerStyle: {
          backgroundColor: colors.primaryDark,
          borderColor: colors.black,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
      }}
      name="Messages"
      component={MessagingNavigator}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsNavigator}
      options={{
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.primaryDark,
          borderColor: colors.black,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
      }}
    />
    <Stack.Screen
      name="Dates"
      component={MyDatesScreen}
      options={{
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.primaryDark,
          borderColor: colors.black,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
      }}
    />
    <Stack.Screen
      name="Help"
      component={HelpAndSupport}
      options={{
        headerStyle: {
          backgroundColor: colors.primaryDark,
          borderColor: colors.black,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
      }}
    />
  </Stack.Navigator>
);

export default UserAccountNavigator;
