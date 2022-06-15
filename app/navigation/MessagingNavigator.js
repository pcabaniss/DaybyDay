import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MessageScreen from "../screens/MessageScreen";
import ChatScreen from "../screens/ChatScreen";
import colors from "../config/colors";

const Stack = createStackNavigator();

function MessagingNavigator({ route }) {
  const { name, email } = route.params;
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: true }}
      initialRouteName="Messages"
    >
      <Stack.Screen
        initialParams={{ name: name, email: email }}
        options={{
          headerTitle: "Inbox",
          headerStyle: {
            backgroundColor: colors.primaryDark,
            borderColor: colors.black,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        }}
        name="Messages"
        component={MessageScreen}
      />
      <Stack.Screen
        //Find a way to pass in the user clicked to be the title
        name="Chat"
        component={ChatScreen}
      />
    </Stack.Navigator>
  );
}

export default MessagingNavigator;
