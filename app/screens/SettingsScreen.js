import React from "react";
import { View, StyleSheet, FlatList, SafeAreaView } from "react-native";
import ListItem from "../components/ListItem";
import colors from "../config/colors";
import Seperator from "../components/Seperator";

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
    subTitle: "Manage how your'e notified.",
    targetScreen: "notifications",
  },

  //Display information on blocked profiles, and reported cases.
  {
    title: "Data & Privacy",
    subTitle: "View our terms of service.",
    targetScreen: "dataAndPrivacy",
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
    subTitle: "Manage your blocked list and password.",
    targetScreen: "security",
  },
  //Display contact info/email. Business hours, and maybe an FAQ website?
  {
    title: "Contact Us",
    subTitle: "Have an issue or reccomendation?",
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
          ItemSeparatorComponent={Seperator}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              subTitle={item.subTitle}
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
    backgroundColor: colors.primary,
  },
  container: {
    marginTop: 15,
    padding: 10,
    backgroundColor: colors.primary,
    width: "100%",
  },
});

export default SettingsScreen;
