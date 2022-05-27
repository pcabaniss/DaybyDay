import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ChangePassword from "../screens/ChangePassword";
import SecuritySettings from "../screens/SecuritySettings";
import NavigationSettings from "../screens/NavigationSettings";
import SettingsScreen from "../screens/SettingsScreen";
import BlockedListScreen from "../screens/BlockedListScreen";

const Stack = createStackNavigator();

const SettingsNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen
      name="notifications"
      component={NavigationSettings}
      options={{ title: "Notification Settings" }}
    />
    <Stack.Screen
      name="security"
      component={SecuritySettings}
      options={{ title: "Security Settings" }}
    />
    <Stack.Screen
      name="changePassword"
      component={ChangePassword}
      options={{ title: "Update Password" }}
    />
    <Stack.Screen
      name="blockedList"
      component={BlockedListScreen}
      options={{ title: "Blocked List" }}
    />
  </Stack.Navigator>
);

export default SettingsNavigator;
