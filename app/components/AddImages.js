import React, { useState } from "react";
import { View, StyleSheet, Alert, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";

import listings from "../api/listings";

function AddImages({ email, pic }) {
  const [image, setImage] = useState(pic);

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

  const takePhoto = async () => {
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
      setImage(source);
      console.log(result.uri);
    } catch (error) {
      console.log("Error taking picture.");
    }
  };

  const getPlatformPath = ({ path, uri }) => {
    return Platform.select({
      android: { value: path },
      ios: { value: uri },
    });
  };

  const getFileName = (name, path) => {
    if (name != null) {
      return name;
    }

    if (Platform.OS === "ios") {
      path = "~" + path.substring(path.indexOf("/Documents"));
    }
    return path.split("/").pop();
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        allowsEditing: true,
        //aspect: [4,3],
        quality: 1,
      });

      const path = getPlatformPath(result).value;

      console.log(path);
      listings.saveImages(email, path);
      await listings.getImages(email);

      //Send a promise to save the picture to storage once register button is clicked
      if (!result.cancelled) setImage(path);
    } catch (error) {
      console.log("Error reading image" + error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Upload image" onPress={alertButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default AddImages;
