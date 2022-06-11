import React, { useState, useEffect } from "react";
import {
  Alert,
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/core";

import listings from "../api/listings";
import colors from "../config/colors";

function UserProfileSettingsScreen({ route, navigation }) {
  const { name, pic, email } = route.params;
  const [image, setImage] = useState(pic);
  const [verified, setVerified] = useState(false);

  const isFocused = useIsFocused();

  var capitalEmail = email.charAt(0).toUpperCase() + email.slice(1);

  useEffect(() => {
    const ver = listings.checkIfVerified();

    setVerified(ver);
  }, [isFocused]);

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        mediaTypes: "Images",
      });
      console.log("Got picture from camera: " + result);
      const source = result.uri;
      if (Platform.OS === "ios") {
        source.replace("file://", "");
      }

      listings.replaceImage(email, source);
      setImage(source);
      console.log(result.uri);
    } catch (error) {
      console.log("Error taking picture.");
    }
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        allowsEditing: true,
        //aspect: [4,3],
        quality: 1,
      });
      const source = result.uri;
      if (Platform.OS === "ios") {
        source.replace("file://", "");
      }
      await listings.replaceImage(email, source);
      //Send a promise to save the picture to storage once register button is clicked
      if (!result.cancelled) setImage(source);
    } catch (error) {
      console.log("Error reading image" + error);
    }
  };

  const imagePressed = () => {
    Alert.alert("Change profile picture?", "", [
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

  const isVerified = () => {
    return (
      <MaterialCommunityIcons
        name="check-circle"
        size={30}
        color={colors.greenCheck}
      />
    );
  };

  const isNotVerified = () => {
    return (
      <MaterialCommunityIcons
        name="close-box"
        size={30}
        color={colors.danger}
      />
    );
  };

  const clicked = () => {
    listings.sendVerificationEmail();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => imagePressed()}>
        <Image source={{ uri: image }} style={styles.profilePic} />
      </TouchableOpacity>
      <View style={styles.title}>
        <Text style={styles.name}>{name}</Text>
        {verified ? (
          <Text style={styles.icon}>{isVerified()}</Text>
        ) : (
          <Text style={styles.icon}>{isNotVerified()}</Text>
        )}
      </View>
      {verified ? (
        <View />
      ) : (
        <Text onPress={clicked}>Click to send verification email.</Text>
      )}
      <Text style={styles.smallText}>{capitalEmail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    paddingTop: 15,
    paddingLeft: 10,
    alignSelf: "center",
  },
  name: {
    paddingTop: 15,
    fontSize: 30,
    fontWeight: "500",
  },
  title: {
    flexDirection: "row",
  },
  profilePic: {
    height: 180,
    width: 180,
    borderColor: colors.dark,
    borderRadius: 90,
    borderWidth: 5,
    overflow: "hidden",
  },
  smallText: {
    paddingTop: 10,
    fontSize: 22,
    fontWeight: "500",
  },
});

export default UserProfileSettingsScreen;
