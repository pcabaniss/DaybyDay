import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ChangePassword from "../screens/ChangePasswordScreen";
import SecuritySettings from "../screens/SecuritySettings";
import NavigationSettings from "../screens/NotificationSettings";
import SettingsScreen from "../screens/SettingsScreen";
import BlockedListScreen from "../screens/BlockedListScreen";
import DataPrivacyScreen from "../screens/DataPrivacyScreen";
import colors from "../config/colors";
import DeleteAccount from "../screens/DeleteAccount";

const Stack = createStackNavigator();

const SettingsNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        headerStyle: {
          backgroundColor: colors.primaryDark,
        },
      }}
    />
    <Stack.Screen
      name="notifications"
      component={NavigationSettings}
      options={{
        title: "Notification Settings",
        headerStyle: {
          backgroundColor: colors.primaryDark,
        },
      }}
    />
    <Stack.Screen
      name="security"
      component={SecuritySettings}
      options={{
        title: "Security Settings",
        headerStyle: {
          backgroundColor: colors.primaryDark,
        },
      }}
    />
    <Stack.Screen
      name="changePassword"
      component={ChangePassword}
      options={{
        title: "Update Password",
        headerStyle: {
          backgroundColor: colors.primaryDark,
        },
      }}
    />
    <Stack.Screen
      name="blockedList"
      component={BlockedListScreen}
      options={{
        title: "Blocked List",
        headerStyle: {
          backgroundColor: colors.primaryDark,
        },
      }}
    />
    <Stack.Screen
      name="dataAndPrivacy"
      component={DataPrivacyScreen}
      options={{
        title: "Data & Privacy",
        headerStyle: {
          backgroundColor: colors.primaryDark,
        },
      }}
    />
    <Stack.Screen
      name="deleteAccount"
      component={DeleteAccount}
      options={{
        title: "Delete Account",
        headerStyle: {
          backgroundColor: colors.primaryDark,
        },
      }}
    />
  </Stack.Navigator>
);

export default SettingsNavigator;
