import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useIsFocused } from "@react-navigation/core";

import colors from "../config/colors";
import SelectedIcon from "../components/SelectedIcon";
import listings from "../api/listings";

function ProfileSettingsScreen({ route, navigation }) {
  const { name, pic, email } = route.params;

  const isFocused = useIsFocused();

  var capEmail = email.charAt(0).toUpperCase() + email.slice(1);

  const [selected, setSelected] = useState("About");
  const [image, setImage] = useState(pic);
  const [about, setAbout] = useState(" ");
  const [rating, setRating] = useState(4);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    getRating();
    const ver = listings.checkIfVerified();

    setVerified(ver);
  }, [isFocused]);

  const getRating = async () => {
    const gotRating = await listings.getRatings(email);

    var count = 0;
    var total = 0;

    gotRating.map((item) => {
      count++;
      total = total + item.rating;
    });

    const totalStars = (total / count).toFixed(1);
    //console.log(totalStars);
    setRating(totalStars);
  };

  const pullAboutInfo = async (email) => {
    const data = await listings.getAboutFor(email);

    if (data != undefined || data != null) {
      setAbout(data);
    } else {
      setAbout("No information yet!");
    }
  };
  pullAboutInfo(email);

  const changeText = (text) => {
    setAbout(text);

    saveAbout(text);
  };

  const saveAbout = (text) => {
    pullAboutInfo();
    listings.saveAbout(text);
  };

  const alertButton = () => {
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
      listings.replaceImage(email, source);
      //Send a promise to save the picture to storage once register button is clicked
      if (!result.cancelled) setImage(source);
    } catch (error) {
      console.log("Error reading image" + error);
    }
  };

  const clicked = () => {
    listings.sendVerificationEmail();
  };

  const isVerified = () => {
    return (
      <MaterialCommunityIcons
        name="check-circle"
        size={15}
        color={colors.greenCheck}
      />
    );
  };

  const isNotVerified = () => {
    return (
      <MaterialCommunityIcons
        name="close-box"
        size={15}
        color={colors.danger}
      />
    );
  };

  return (
    <ScrollView scrollEnabled style={{ backgroundColor: colors.white }}>
      <View style={styles.picContainer}>
        <TouchableOpacity onPress={() => alertButton()}>
          <Image source={{ uri: image }} style={styles.profilePic} />
        </TouchableOpacity>
        <View style={{ paddingLeft: 10, flex: 1 }}>
          <TextInput
            editable
            multiline
            onChangeText={changeText}
            value={about}
            placeholder="This is where the about goes."
            style={styles.aboutText}
          ></TextInput>
        </View>
      </View>
      <View style={styles.nameBox}>
        <View style={{ paddingRight: 10 }}>
          <Text style={styles.nameText}>{name}</Text>

          <Text
            style={{
              paddingLeft: 5,
              color: colors.primaryDark,
              paddingBottom: 10,
            }}
          >
            {capEmail} {verified ? isVerified() : isNotVerified()}
          </Text>
          {verified ? (
            <View />
          ) : (
            <Text
              style={{
                textDecorationLine: "underline",
                color: "white",
                paddingBottom: 3,
              }}
              onPress={clicked}
            >
              Click to send verification email.
            </Text>
          )}
        </View>
      </View>
      <View style={styles.boxContainer}>
        {<SelectedIcon email={email} navigation={navigation} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  aboutText: {
    fontSize: 16,
    paddingTop: 10,
    color: colors.white,
    borderRadius: 10,
    padding: 15,
    flex: 1,
  },
  nameBox: {
    backgroundColor: colors.primary,
    width: "100%",
    paddingLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  boxContainer: {
    height: 500,
    backgroundColor: colors.primary,
  },

  picContainer: {
    flex: 1,
    flexDirection: "row",

    //width: "100%",
    padding: 5,
    backgroundColor: colors.primary,
  },
  profilePic: {
    height: 120,
    width: 120,
    borderColor: colors.medium,
    borderRadius: 90,
    borderWidth: 1,
    overflow: "hidden",
  },
  nameText: {
    fontSize: 30,
    paddingLeft: 3,
    fontWeight: "bold",
    color: colors.white,
  },
  icon: {
    borderRadius: 17,
    paddingLeft: 4,
    paddingTop: 5,
    //flex: 1,
    //backgroundColor: colors.white,
    width: "100%",
  },
});

export default ProfileSettingsScreen;
