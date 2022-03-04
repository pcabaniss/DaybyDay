import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppLoading from "expo-app-loading";
import { LogBox, StyleSheet } from "react-native";

import navigationTheme from "./app/navigation/NavigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";
import OfflineNotice from "./app/components/OfflineNotice";
import AuthNavigator from "./app/navigation/AuthNavigator";
import AuthContext from "./app/auth/context";

import { firebase } from "./app/auth/firebaseConfig";
import colors from "./app/config/colors";

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    LogBox.ignoreLogs(["Setting a timer"]);
  });

  const restoreUser = async () => {
    firebase.default.auth().onAuthStateChanged(function (user) {
      if (user) {
        setUser(user);
      } else {
        console.log("User not verified");
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
