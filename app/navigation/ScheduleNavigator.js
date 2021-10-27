import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ScheduleScreen from "../screens/SceduleScreen";

const Stack = createStackNavigator();

const ScheduleNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
    </Stack.Navigator>
  );
};

export default ScheduleNavigator;
