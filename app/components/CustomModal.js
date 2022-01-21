import React from "react";
import { View, StyleSheet, Modal, Text } from "react-native";
import colors from "../config/colors";

function CustomModal(isVisible, item, onClose) {
  console.log(item);
  return (
    <Modal visible={isVisible} onRequestClose={onClose}>
      <View style={styles.container}>
        <Text>Hello</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.red,
    width: "100%",
    height: "100%",
    fontSize: 100,
  },
});

export default CustomModal;
