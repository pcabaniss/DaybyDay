import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import ListItem from "../components/ListItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import Seperator from "../components/Seperator";

function SecuritySettings({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <ListItem
          title={"Change password"}
          subTitle={"Change your password whenever you want."}
          onPress={() => {
            navigation.navigate("changePassword");
          }}
          IconComponent={
            <MaterialCommunityIcons
              name="account-key"
              color={colors.black}
              size={30}
              style={{ paddingRight: 10 }}
            />
          }
        />

        <Seperator />
        <ListItem
          title={"Blocked list"}
          subTitle={"View and edit blocked users."}
          onPress={() => navigation.navigate("blockedList")}
          IconComponent={
            <MaterialCommunityIcons
              name="account-cancel"
              color={colors.black}
              size={30}
              style={{ paddingRight: 10 }}
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    flex: 1,
    padding: 10,
  },
  item: {
    height: 100,
    width: "100%",
    backgroundColor: colors.white,
  },
});

export default SecuritySettings;
