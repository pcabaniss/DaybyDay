import React from "react";
import { StyleSheet, View, FlatList } from "react-native";

import Screen from "../components/Screen";
import ListItem from "../components/ListItem";
import colors from "../config/colors";
import Icon from "../components/Icon";
import ListItemSeperator from "../components/ListItemSeperator";
import useAuth from "../auth/useAuth";
import SettingsScreen from "./SettingsScreen";

const menuItems = [
  {
    title: "My Dates",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
      key: 1,
    },
    targetScreen: "Dates",
  },
  {
    title: "My Messages",
    icon: {
      name: "email",
      backgroundColor: colors.secondary,
      key: 2,
    },
    targetScreen: "Messages",
  },
  {
    title: "Settings",
    icon: {
      name: "account-cog",
      backgroundColor: "#cdc392",
      key: 3,
    },
    targetScreen: "Settings",
  },
  {
    title: "Help & Support",
    icon: {
      name: "head-question",
      backgroundColor: colors.blue,
      key: 4,
    },
    targetScreen: "SupportScreen",
  },
];

function AccountScreen({ navigation }) {
  const { user, logOut } = useAuth();

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title={user.name}
          subTitle={user.email}
          image={require("../assets/mosh.jpg")}
          onPress={() => navigation.navigate("Profile")}
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItems.title}
          ItemSeparatorComponent={ListItemSeperator}
          contentContainerStyle={{
            borderRadius: 25,
            backgroundColor: colors.white,
            overflow: "hidden",
          }}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              IconComponent={
                <Icon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              onPress={() => navigation.navigate(item.targetScreen)}
            />
          )}
        />
      </View>
      <View style={styles.container}>
        <ListItem
          title="Log Out"
          IconComponent={<Icon name="logout" backgroundColor={colors.danger} />}
          onPress={() => logOut()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.black,
  },
  screen: {
    backgroundColor: colors.background,
  },
});

export default AccountScreen;
