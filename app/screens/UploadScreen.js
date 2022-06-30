import React from "react";
import { View, StyleSheet, Modal } from "react-native";
import * as Progress from "react-native-progress";
import LottieView from "lottie-react-native";

import colors from "../config/colors";

function UploadScreen({ onDone, progress = 0, visible = false }) {
  return (
    <Modal visible={visible}>
      <View style={styles.container}>
        {progress < 1 ? (
          <LottieView
            autoPlay
            loop
            onAnimationFinish={onDone}
            source={require("../assets/animations/dayAndNight.json")}
            style={styles.amimation}
          />
        ) : (
          <LottieView
            autoPlay
            loop
            onAnimationFinish={onDone}
            source={require("../assets/animations/dayAndNight.json")}
            style={styles.amimation}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  animation: {
    width: 150,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});

export default UploadScreen;
