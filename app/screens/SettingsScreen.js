import React from "react";
import { View, StyleSheet, FlatList, SafeAreaView } from "react-native";
import ListItem from "../components/ListItem";
import colors from "../config/colors";
import ListItemSeperator from "../components/ListItemSeperator";
import moment from "moment";

/** Things to add in setting:
 * Blocked profiles
 * Notification settings
 * Personal Information (Password/username)
 * Legal information
 * Contact info
 */
const settingItems = [
  //Display current notification settings. Instructions on how to turn off.
  {
    title: "Notifications",
    targetScreen: "notifications",
  },

  //Display information on blocked profiles, and reported cases.
  {
    title: "Data & Privacy",
    targetScreen: "Messages",
  },
  /*
  {
    title: "Payment Settings",
    targetScreen: "Settings",
  },
   {
    title: "Membership",
    targetScreen: "Settings",
  },
  */
  //Change password and view information.
  {
    title: "Password & Security",
    targetScreen: "security",
  },
  //Display contact info/email. Business hours, and maybe an FAQ website?
  {
    title: "Contact Us",
    targetScreen: "Settings",
  },
];

function SettingsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container}>
        <FlatList
          data={settingItems}
          keyExtractor={(item) => item.title}
          ItemSeparatorComponent={ListItemSeperator}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              onPress={() => navigation.navigate(item.targetScreen)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.black,
  },
  container: {
    marginVertical: 20,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: colors.black,
    borderWidth: 3,
    width: "97%",
    alignSelf: "center",
    borderColor: colors.black,
  },
});

export default SettingsScreen;
