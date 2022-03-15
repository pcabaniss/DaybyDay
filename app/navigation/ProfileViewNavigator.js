import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DiscoverScreen from "../screens/DiscoverScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AvailabilityScreen from "../screens/AvailabilityScreen";
import Reviewer from "../components/Reviewer";

const Stack = createStackNavigator();

const ProfileViewNavigator = () => {
  return (
    <Stack.Navigator mode="modal" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Discover" component={DiscoverScreen} />
      <Stack.Screen
        options={{ headerShown: true, headerTitle: "" }}
        name="ProfileView"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="input"
        component={Reviewer}
        options={{
          headerShown: false,
          cardStyle: {
            backgroundColor: "transparent",
            opacity: 0.99,
          },
        }}
      />
      <Stack.Screen name="Schedule" component={AvailabilityScreen} />
    </Stack.Navigator>
  );
};

export default ProfileViewNavigator;
