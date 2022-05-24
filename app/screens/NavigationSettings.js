import React from "react";
import { View, StyleSheet, Text } from "react-native";
import colors from "../config/colors";

function NavigationSettings(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Turn notifications off/on? </Text>
      <View style={styles.body}>
        <Text style={{ fontSize: 20, color: colors.white, paddingTop: 5 }}>
          - Go to your phones settings.
        </Text>
        <Text style={{ fontSize: 20, color: colors.white, paddingTop: 5 }}>
          - Click "Notifications"
        </Text>
        <Text style={{ fontSize: 20, color: colors.white, paddingTop: 5 }}>
          - Scroll to "Day by Day"
        </Text>
        <Text style={{ fontSize: 20, color: colors.white, paddingTop: 5 }}>
          - Select/deselect "Allow Notifications"
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingTop: 15,
    paddingLeft: 15,
  },
  container: { flex: 1, backgroundColor: colors.black },
  title: {
    fontSize: 28,
    alignSelf: "center",
    paddingTop: 20,
    color: colors.green,
  },
});

export default NavigationSettings;
