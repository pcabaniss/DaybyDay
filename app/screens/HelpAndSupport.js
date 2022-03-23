import React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import notifee from "@notifee/react-native";
import colors from "../config/colors";

function HelpAndSupport(props) {
  const onDisplayNotification = async () => {
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });

    await notifee.requestPermission();

    await notifee.displayNotification({
      title: "Test Notification",
      body: "This is a test notification.",
      android: {
        channelId,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text>
        This screen will hold all the links; FAQ, website, customer service, and
        social media.
      </Text>
      <Button
        color={colors.white}
        title="Click to recieve a notification!"
        onPress={() => onDisplayNotification()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue,
  },
});

export default HelpAndSupport;
