import React from "react";
import { View, StyleSheet, FlatList, SafeAreaView } from "react-native";
import ListItem from "../components/ListItem";
import colors from "../config/colors";
import ListItemSeperator from "../components/ListItemSeperator";
import moment from "moment";

const settingItems = [
  {
    title: "Notifications",
    targetScreen: "Dates",
  },
  {
    title: "Privacy",
    targetScreen: "Messages",
  },
  {
    title: "Payment Settings",
    targetScreen: "Settings",
  },
  {
    title: "Password & Security",
    targetScreen: "Settings",
  },
  {
    title: "Identity Verification",
    targetScreen: "Settings",
  },
  {
    title: "Membership",
    targetScreen: "Settings",
  },
  {
    title: "Legal",
    targetScreen: "Settings",
  },
  {
    title: "Contact Us",
    targetScreen: "Settings",
  },
];

function SettingsScreen(props) {
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
    backgroundColor: colors.background,
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
