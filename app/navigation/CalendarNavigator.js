import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WeekCalendar from "../components/calendar/WeekCalendar";
import ListingEditScreen from "../screens/ListingEditScreen";
import AgendaDetailsScreen from "../screens/AgendaDetailsScreen";
import ScheduleScreen from "../screens/SceduleScreen";

const Stack = createStackNavigator();

const CalendarNavigator = () => {
  return (
    <Stack.Navigator mode="modal" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Calendar" component={WeekCalendar} />
      <Stack.Screen name="Add" component={ListingEditScreen} />
      <Stack.Screen name="View" component={AgendaDetailsScreen} />
    </Stack.Navigator>
  );
};

export default CalendarNavigator;
