import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RegisterScreen from "../screens/RegisterScreen";
import RegisterBusScreen from "../screens/RegisterBusScreen";
import colors from "../config/colors";

const Tab = createBottomTabNavigator();

const RegisterNavigator = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        tabStyle: {
          borderColor: colors.black,
          borderTopWidth: 2,
        },
      }}
    >
      <Tab.Screen
        name="Customer"
        component={RegisterScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="account-cash"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Business"
        component={RegisterBusScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="store" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default RegisterNavigator;
