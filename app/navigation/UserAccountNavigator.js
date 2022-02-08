import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import SettingsScreen from "../screens/SettingsScreen";
import MyDatesScreen from "../screens/RequestsScreen";
import HelpAndSupport from "../screens/HelpAndSupport";
import MessagingNavigator from "./MessagingNavigator";
import UserProfileSettingsScreen from "../screens/UserProfileSettingsScreen";
import PhotoGallery from "../components/PhotoGallery";

const Stack = createStackNavigator();

const UserAccountNavigator = () => (
  <Stack.Navigator mode="modal">
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen name="Edit Profile" component={UserProfileSettingsScreen} />
    <Stack.Screen
      options={{ headerShown: false }}
      name="Messages"
      component={MessagingNavigator}
    />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Dates" component={MyDatesScreen} />
    <Stack.Screen name="Help" component={PhotoGallery} />
  </Stack.Navigator>
);

export default UserAccountNavigator;
