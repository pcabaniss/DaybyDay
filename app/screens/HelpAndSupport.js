import React from "react";
import * as Notifications from "expo-notifications";
import { Text, View, StyleSheet, Button } from "react-native";

import colors from "../config/colors";
import listings from "../api/listings";

function HelpAndSupport(props) {
  const getNotifications = async () => {
    const temp = await Notifications.getAllScheduledNotificationsAsync();
    console.log(temp);
  };
  return (
    <View style={styles.container}>
      <Text>
        This screen will hold all the links; FAQ, website, customer service, and
        social media.
      </Text>
      <Button
        title="Test me."
        color={colors.blue}
        onPress={() => getNotifications()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default HelpAndSupport;
