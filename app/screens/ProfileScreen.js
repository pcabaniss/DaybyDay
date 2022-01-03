import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import colors from "../config/colors";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SpaceSeperator from "../components/SpaceSeperator";
import Icon from "../components/Icon";
import ListItemSeperator from "../components/ListItemSeperator";
import SelectedIcon from "../components/SelectedIcon";
import listings from "../api/listings";
import SelectedIconViewed from "../components/SelectedIconViewed";

function ProfileScreen({ route, navigation }) {
  const menuItems = [
    {
      title: "Schedule",
      icon: {
        name: "calendar-month",
        backgroundColor: colors.black,
      },
      key: "schedule",
      onPress: () => console.log("Schedule"),
    },
    {
      title: "Message",
      icon: {
        name: "email-outline",
        backgroundColor: colors.black,
      },
      key: "Message",
      onPress: () => console.log("Message"),
    },
    {
      title: "Reviews",
      icon: {
        name: "star-circle-outline",
        backgroundColor: colors.black,
      },
      key: "reviews",
      onPress: () => console.log("Reviews"),
    },
    {
      title: "About",
      icon: {
        name: "information-outline",
        backgroundColor: colors.black,
      },
      key: "About",
      onPress: () => console.log("About"),
    },
  ];

  const { name, pic, email } = route.params;

  const [selected, setSelected] = useState("About");
  const [image, setImage] = useState(pic);

  return (
    <ScrollView
      scrollEnabled
      style={{ backgroundColor: colors.white, flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.bgContainer}>
          <ImageBackground
            source={require("../assets/couch.jpg")}
            resizeMode="cover"
            style={styles.image}
          >
            <View style={styles.picContainer}>
              <Image source={{ uri: image }} style={styles.profilePic} />
            </View>
          </ImageBackground>
        </View>
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

          <Text style={{ paddingLeft: 5, paddingBottom: 15 }}>{email}</Text>
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
        {
          <SelectedIconViewed
            prop={selected}
            navigation={navigation}
            email={email}
          />
        }
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bgContainer: {
    // borderRadius: 10,
    borderWidth: 5,
    borderColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.blue,
  },
  boxContainer: {
    backgroundColor: colors.blue,
    borderRadius: 10,
    borderColor: colors.medium,
    borderWidth: 1,
    alignSelf: "center",
    height: "100%",
    width: "98%",
  },
  image: {
    height: 250,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  picContainer: {
    justifyContent: "center",
    width: 180,
  },
  profilePic: {
    height: 180,
    width: 180,
    borderColor: colors.white,
    borderRadius: 90,
    borderWidth: 5,
    overflow: "hidden",
  },
  nameText: {
    fontSize: 30,
    paddingLeft: 3,
    color: colors.black,
  },
  icon: {
    borderColor: colors.light,
    borderRadius: 17,
    alignSelf: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
});

export default ProfileScreen;
