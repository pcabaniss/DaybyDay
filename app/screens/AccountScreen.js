import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { useIsFocused } from "@react-navigation/core";

import Screen from "../components/Screen";
import ListItem from "../components/ListItem";
import colors from "../config/colors";
import Icon from "../components/Icon";

import useAuth from "../auth/useAuth";
import listings from "../api/listings";
import Seperator from "../components/Seperator";

const menuItems = [
  {
    title: "Requests",
    icon: {
      name: "alarm-check",
      backgroundColor: colors.primary,
    },
    key: "Dates",
    targetScreen: "Dates",
  },
  {
    title: "Messages",
    icon: {
      name: "email",
      backgroundColor: colors.secondary,
    },
    key: "Messages",
    targetScreen: "Messages",
  },
  {
    title: "Settings",
    icon: {
      name: "account-cog",
      backgroundColor: "#cdc392",
    },
    key: "Settings",
    targetScreen: "Settings",
  },
  {
    title: "Help & Support",
    icon: {
      name: "head-question",
      backgroundColor: colors.blue,
    },
    key: "Help",
    targetScreen: "Help",
  },
];

function AccountScreen({ navigation }) {
  const isFocused = useIsFocused();

  const { user, logOut } = useAuth();
  const [name, setName] = useState("");
  const [pic, setPic] = useState(" ");
  const [business, setBusiness] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const refresh = navigation.addListener("focus", () => {
      setLoading(true);
      getPic();
      setLoading(false);
    });
    return refresh;
  }, [isFocused]);

  const getName = async () => {
    const name = await listings.getMyName();
    const isBusiness = await listings.pullProfileType(user.email);

    setBusiness(isBusiness);
    setName(name);
  };
  var email = user.email.charAt(0).toUpperCase() + user.email.slice(1);

  const getPic = async () => {
    //const picture = await listings.pullImage(user.email);
    const picture = await listings.getProfilePic(user.email);
    setPic(picture);
  };

  getName();
  getPic();

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title={name}
          subTitle={email}
          image={pic}
          onPress={() =>
            navigation.navigate("Edit Profile", {
              name: name,
              email: user.email,
              pic: pic,
            })
          }
          key="one"
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          scrollEnabled={false}
          //keyExtractor={(menuItem) => menuItems.title}
          ItemSeparatorComponent={Seperator}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              IconComponent={
                <Icon
                  name={item.icon.name}
                  iconColor={colors.black}
                  title={item.title}
                  isBusiness={business}
                />
              }
              onPress={() =>
                navigation.navigate(item.targetScreen, {
                  email: user.email,
                  name: name,
                  pic: pic,
                })
              }
            />
          )}
        />
      </View>
      <View style={styles.logOut}>
        <ListItem
          title="Log Out"
          IconComponent={
            <Icon
              name="logout"
              backgroundColor={colors.black}
              iconColor={colors.danger}
            />
          }
          onPress={() => logOut()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    backgroundColor: colors.white,
    width: "100%",
  },
  logOut: {
    marginVertical: 20,
    backgroundColor: colors.white,
    width: "100%",
  },
  screen: {
    backgroundColor: colors.black,
    padding: 10,
  },
});

export default AccountScreen;
