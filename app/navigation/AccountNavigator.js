import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import MessageScreen from "../screens/MessageScreen";
import SettingsScreen from "../screens/SettingsScreen";
import MyDatesScreen from "../screens/MyDatesScreen";
import ProfileSettingsScreen from "../screens/ProfileSettingsScreen";
import HelpAndSupport from "../screens/HelpAndSupport";

const Stack = createStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen name="Profile" component={ProfileSettingsScreen} />
    <Stack.Screen name="Messages" component={MessageScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Dates" component={MyDatesScreen} />
    <Stack.Screen name="Help" component={HelpAndSupport} />
  </Stack.Navigator>
);

export default AccountNavigator;
