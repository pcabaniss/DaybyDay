import React from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  SafeAreaView,
} from "react-native";
import ListItem from "../components/ListItem";
import Accordion from "@dooboo-ui/native-accordion";
import colors from "../config/colors";
import Icon from "../components/Icon";
import ListItemSeperator from "../components/ListItemSeperator";

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
          keyExtractor={(item, index) => item.title}
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
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.black,
  },
});

export default SettingsScreen;
