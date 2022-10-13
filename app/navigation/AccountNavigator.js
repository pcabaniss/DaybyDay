import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ProfileSettingsScreen from "../screens/ProfileSettingsScreen";
import HelpAndSupport from "../screens/HelpAndSupport";
import MessagingNavigator from "./MessagingNavigator";
import AvailabilityScreen from "../screens/AvailabilityScreen";
import BusRequestScreen from "../screens/BusRequestsScreen";
import AnswerScreen from "../screens/AnswerScreen";
import colors from "../config/colors";
import Reviewer from "../components/Reviewer";
import NavigationSettings from "../screens/NotificationSettings";
import SecuritySettings from "../screens/SecuritySettings";
import ChangePassword from "../screens/ChangePasswordScreen";
import SettingsNavigator from "./SettingsNavigator";

const Stack = createStackNavigator();

const AccountNavigator = () => (
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
      component={ProfileSettingsScreen}
      options={{
        headerBackTitle: " ",
        headerTitle: "",
        headerTransparent: true,
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
      options={{ headerShown: false }}
      name="Messages"
      component={MessagingNavigator}
    />
    <Stack.Screen
      name="Dates"
      component={BusRequestScreen}
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
    <Stack.Screen
      name="Profile"
      options={{ headerShown: false }}
      component={AvailabilityScreen}
    />
    <Stack.Screen
      name="Answer"
      component={AnswerScreen}
      options={{
        headerShown: false,
        cardStyle: {
          backgroundColor: "transparent",
          opacity: 0.99,
        },
      }}
    />
    <Stack.Screen
      name="input"
      component={Reviewer}
      options={{
        headerShown: false,
        cardStyle: {
          backgroundColor: "transparent",
          opacity: 0.99,
        },
      }}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsNavigator}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default AccountNavigator;
