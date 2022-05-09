import React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import Notifications from "../api/Notifications";
import colors from "../config/colors";
import listings from "../api/listings";

function HelpAndSupport(props) {
  const getNotifications = async () => {
    const not = await Notifications.checkBadges();
    console.log(not);
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
