import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import SettingsScreen from "../screens/SettingsScreen";
import MyDatesScreen from "../screens/MyDatesScreen";
import ProfileSettingsScreen from "../screens/ProfileSettingsScreen";
import HelpAndSupport from "../screens/HelpAndSupport";
import MessagingNavigator from "./MessagingNavigator";

const Stack = createStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen name="Edit Profile" component={ProfileSettingsScreen} />
    <Stack.Screen
      options={{ headerShown: false }}
      name="Messages"
      component={MessagingNavigator}
    />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Dates" component={MyDatesScreen} />
    <Stack.Screen name="Help" component={HelpAndSupport} />
  </Stack.Navigator>
);

export default AccountNavigator;
