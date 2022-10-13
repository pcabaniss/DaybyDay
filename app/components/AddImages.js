import React, { useState } from "react";
import { View, StyleSheet, Alert, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";

import listings from "../api/listings";
import colors from "../config/colors";
import AppButton from "./AppButton";

function AddImages({ email }) {
  const alertButton = () => {
    Alert.alert("Upload picture from where?", "", [
      {
        text: "Photo Library",
        onPress: () => {
          selectImage();
        },
      },
      {
        text: "Take Picture",
        onPress: () => {
          takePhoto();
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const requestLibraryPermission = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    return granted;
  };

  const requestCameraPermission = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();

    return granted;
  };

  const takePhoto = async () => {
    const request = await requestCameraPermission();
    if (!request) {
      return alert("Day by Day needs permission to access your pictures.");
    } else {
      try {
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          mediaTypes: "Images",
        });
        console.log("Got picture from camera: " + result);
        const source = result;
        if (Platform.OS === "ios") {
          source.replace("file://", "");
        }
        const jpg = getFileName(result.uri);
        const path = getPlatformPath(result).value;
        //console.log(path);
        listings.saveImages(email, jpg, path);

        if (!result.cancelled) return;
      } catch (error) {
        console.log("Error taking picture.");
      }
    }
  };

  const getPlatformPath = ({ path, uri }) => {
    return Platform.select({
      android: { value: path },
      ios: { value: uri },
    });
  };

  const getFileName = (path) => {
    return path.split("/").pop();
  };

  const selectImage = async () => {
    const result = await requestLibraryPermission();

    if (!result) {
      return alert("Day by Day needs permission to access your pictures.");
    } else {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: "Images",
          allowsEditing: true,
          //aspect: [4,3],
          quality: 1,
        });
        const jpg = getFileName(result.uri);
        const path = getPlatformPath(result).value;
        //console.log(path);
        listings.saveImages(email, jpg, path);

        await listings.getImages(email);

        //Send a promise to save the picture to storage once register button is clicked
        if (!result.cancelled) return;
      } catch (error) {
        console.log("Error reading image" + error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <AppButton
        title="Upload image"
        onPress={alertButton}
        color={colors.blue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  image: {
    width: "50%",
    height: "50%",
  },
});

export default AddImages;
