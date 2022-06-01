import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import RegisterNavigator from "./RegisterNavigator";
import { NavigationContainer } from "@react-navigation/native";
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
        headerTintColor: colors.black,
        headerStyle: {
          backgroundColor: colors.black,
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
        headerTintColor: colors.white,
        headerStyle: {
          backgroundColor: colors.black,
          borderColor: colors.black,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
      }}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
