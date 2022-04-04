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
import * as ImagePicker from "expo-image-picker";
import { Rating } from "react-native-ratings";
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

  useEffect(() => {
    getRating();
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

  const getFileName = (path) => {
    return path.split("/").pop();
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

  return (
    <ScrollView scrollEnabled style={{ backgroundColor: colors.dark }}>
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

          <Text style={{ paddingLeft: 5, color: colors.light }}>
            {capEmail}
          </Text>
          <Rating
            type="custom"
            ratingCount={5}
            showRating={false}
            tintColor={colors.black}
            startingValue={rating}
            ratingColor={colors.yellow}
            style={{ padding: 10, alignSelf: "flex-start" }}
            ratingBackgroundColor={colors.light}
            readonly
            imageSize={20}
          />
        </View>
      </View>
      <View style={styles.boxContainer}>
        {<SelectedIcon email={email} navigation={navigation} />}
      </View>
    </ScrollView>
  );

  /*return (
    <ScrollView
      scrollEnabled
      style={{ backgroundColor: colors.white, flex: 1 }}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.bgContainer}
          onPress={() => backgroundPressed()}
          activeOpacity={3}
        >
          <ImageBackground
            source={require("../assets/couch.jpg")}
            resizeMode="cover"
            style={styles.image}
          >
            <TouchableOpacity
              onPress={() => alertButton()}
              style={styles.picContainer}
            >
              <Image source={{ uri: image }} style={styles.profilePic} />
            </TouchableOpacity>
          </ImageBackground>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "99%",
          backgroundColor: colors.white,
          alignSelf: "center",
        }}
      >
        <View style={{ paddingRight: 10 }}>
          <Text style={styles.nameText}>{name}</Text>

          <Text style={{ paddingLeft: 5, paddingBottom: 15 }}>{capE}</Text>
        </View>

        <FlatList
          data={menuItems}
          horizontal
          scrollEnabled={false}
          contentContainerStyle={styles.icon}
          renderItem={() => {
            return (
              <MaterialCommunityIcons
                name="star"
                size={40}
                color={colors.yellow}
              />
            );
          }}
        />
      </View>
      <ListItemSeperator />
      <View style={{ alignSelf: "center", paddingTop: 10, height: 80 }}>
        <FlatList
          horizontal
          scrollEnabled={false}
          data={menuItems}
          contentContainerStyle={{
            height: 60,
          }}
          ItemSeparatorComponent={SpaceSeperator}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity onPress={() => setSelected(item.title)}>
                <Icon
                  name={item.icon.name}
                  size={60}
                  backgroundColor={item.icon.backgroundColor}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.boxContainer}>
        {<SelectedIcon prop={selected} navigation={navigation} />}
      </View>
    </ScrollView>
  );*/
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
    backgroundColor: colors.black,
    width: "100%",
    paddingLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  boxContainer: {
    height: 500,
  },

  picContainer: {
    flex: 1,
    flexDirection: "row",

    //width: "100%",
    padding: 5,
    backgroundColor: colors.black,
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
    color: colors.dark,
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
