import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ScheduleScreen from "../screens/SceduleScreen";
import EditScheduleScreen from "../screens/EditScheduleScreen";

const Stack = createStackNavigator();

const ScheduleNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen name="Edit Schedule" component={EditScheduleScreen} />
    </Stack.Navigator>
  );
};

export default ScheduleNavigator;
