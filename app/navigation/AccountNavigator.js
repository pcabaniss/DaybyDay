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

const Stack = createStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator mode="modal">
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen name="Edit Profile" component={ProfileSettingsScreen} />
    <Stack.Screen
      options={{ headerShown: false }}
      name="Messages"
      component={MessagingNavigator}
    />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen
      name="Dates"
      component={BusRequestScreen}
      options={{ title: "Requests" }}
    />
    <Stack.Screen name="Help" component={HelpAndSupport} />
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
  </Stack.Navigator>
);

export default AccountNavigator;
