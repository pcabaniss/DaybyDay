import React, { useState, useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppLoading from "expo-app-loading";
import { Alert, Platform } from "react-native";
import {
  KeyboardAvoidingView,
  LogBox,
  StyleSheet,
  PermissionsAndroid,
} from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import navigationTheme from "./app/navigation/NavigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";
import OfflineNotice from "./app/components/OfflineNotice";
import AuthNavigator from "./app/navigation/AuthNavigator";
import AuthContext from "./app/auth/context";

import { firebase } from "./app/auth/firebaseConfig";
import colors from "./app/config/colors";
import listings from "./app/api/listings";

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Device.isDevice) {
      await requestAndroidPermissions();
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return;
      }

      //const deviceToken = await Notifications.getDevicePushTokenAsync();
      token = (await Notifications.getExpoPushTokenAsync()).data;

      console.log("This is your token:");
    } else {
      console.log("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  };

  const requestAndroidPermissions = async () => {
    try {
      const check = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (!check) {
        Alert.alert(
          "Why does Day by Day need location permissions?",
          "Day by Day collects your location data to enable scheduling and reminders even when the app is closed or not in use.",
          [{ text: "ok", style: "cancel" }]
        );
      }

      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      ]);

      if (granted == PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location.");
      } else {
        console.log("Denied location access.");
      }
    } catch (error) {
      console.log("Error requesting location: " + error);
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    ); // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    LogBox.ignoreLogs(["Setting a timer"]);
  });

  const restoreUser = async () => {
    firebase.default.auth().onAuthStateChanged(function (user) {
      if (user) {
        setUser(user);
        listings.getReminders(user.email);
      } else {
        console.log("User not verified");
        //setShowMain(false);
      }
    });
  };

  if (!isReady)
    return (
      <AppLoading
        startAsync={restoreUser}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <AuthContext.Provider value={{ user, setUser }}>
        <OfflineNotice />
        <NavigationContainer theme={navigationTheme}>
          {user ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </AuthContext.Provider>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  reg: {
    flexDirection: "row",
    backgroundColor: colors.background,
    width: "100%",
    height: "100%",
  },
});
//setting the array at the end will ensure that the user is only asked once
//for the permissions. You are setting a hook to be executed based on the
//variable in the array changing and since there is no variable, it will only
//execute once until reinstalled.

//View is a component that holds childeren in an organized manner, pretty much a container of what you
//see or the UI
//When dealing with the image component you can either link it to a file in the directory like this:
//<Image source={require("./assets/favicon.png")} />
/*Or like this: 
            source={{
              width: 200,
              height: 300,
              uri: "https://picsum.photos/200/300" and put in a url. Dont forget to specify the dimensions!
              
              
      Buttons and Text practice:
      
      <Text onPress={handlePress}>
            Hello React Native, This is very long text for testing.
            </Text>
           <Button 
           color="orange"
           title="Click Me"
           onPress={() => Alert.alert("My Title", "My Message", [
             {text: "Yes", onPress: () => console.log("Yes Pressed!")},
             {text: "No", onPress: () => console.log("No Pressed!")},
             ])
             } 
             /> 


      View and Orientation:
             <View style={{
            backgroundColor: "blue",
            You can use percentage as a value but must be wrapped in quotes
            width: "100%",

            Setting resolution based on screen orientation.
            height: landscape ? '100%' : "30%",
          }}></View>

      */
