import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppLoading from "expo-app-loading";

import navigationTheme from "./app/navigation/NavigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";
import OfflineNotice from "./app/components/OfflineNotice";
import AuthNavigator from "./app/navigation/AuthNavigator";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";
import firebase from "firebase/app";
import ListingScreen from "./app/screens/ListingScreen";
import RegisterScreen from "./app/screens/RegisterScreen";
import ListingEditScreen from "./app/screens/ListingEditScreen";
import { SafeAreaView, View, StyleSheet } from "react-native";
import WeekCalendar from "./app/components/calendar/WeekCalendar";
import colors from "./app/config/colors";

const config = {
  apiKey: "AIzaSyDc-1slfARS2h3Xr6ExyyisYZqirL3wmiI",
  authDomain: "slate-e5529.firebaseapp.com",
  projectId: "slate-e5529",
  databaseUrl: "https://slate-e5529-default-rtdb.firebaseio.com/",
  storageBucket: "slate-e5529.appspot.com",
  messagingSenderId: "431024329793",
  appId: "1:431024329793:web:c91cdcaad645c70a5da2c0",
  measurementId: "G-E4TJ4XKTZW",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);

  const restoreUser = async () => {
    const user = await authStorage.getUser();
    if (user) setUser(user);
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
    <AuthContext.Provider value={{ user, setUser }}>
      <OfflineNotice />
      <NavigationContainer theme={navigationTheme}>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
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
