import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import RegisterNavigator from "./RegisterNavigator";
import ForgotScreen from "../screens/ForgotScreen";
import colors from "../config/colors";

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{ headerShown: false, animationEnabled: true }}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
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
      name="Registration"
      component={RegisterNavigator}
      options={{
        headerBackTitle: " ",
        headerTitle: "",
        headerTransparent: true,
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
      }}
    />
    <Stack.Screen
      name="Forgot"
      component={ForgotScreen}
      options={{
        headerTitle: "Reset Password",
        headerBackTitle: " ",
        headerStyle: {
          backgroundColor: colors.primaryDark,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
      }}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
