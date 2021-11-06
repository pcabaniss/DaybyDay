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
} from "react-native";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SpaceSeperator from "../components/SpaceSeperator";
import Icon from "../components/Icon";
import ListItemSeperator from "../components/ListItemSeperator";
import SelectedIcon from "../components/SelectedIcon";

const menuItems = [
  {
    title: "Schedule",
    icon: {
      name: "calendar-month",
      backgroundColor: colors.primary,
    },
    key: "schedule",
    onPress: () => console.log("Schedule"),
  },
  {
    title: "Message",
    icon: {
      name: "email-outline",
      backgroundColor: colors.secondary,
    },
    key: "Message",
    onPress: () => console.log("Message"),
  },
  {
    title: "Reviews",
    icon: {
      name: "star-circle-outline",
      backgroundColor: colors.red,
    },
    key: "reviews",
    onPress: () => console.log("Reviews"),
  },
  {
    title: "About",
    icon: {
      name: "information-outline",
      backgroundColor: colors.blue,
    },
    key: "About",
    onPress: () => console.log("About"),
  },
];

function ProfileSettingsScreen({ route }) {
  const { name, pic, email } = route.params;
  const [selected, setSelected] = useState("About");

  const profilePicPressed = () => {
    console.log("Pressed profile pic!");
  };

  const backgroundPressed = () => {
    console.log("Pressed background pic!");
  };

  return (
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
              onPress={() => profilePicPressed()}
              style={styles.picContainer}
            >
              <Image
                source={require("../assets/mosh.jpg")}
                style={styles.profilePic}
              />
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
        {<SelectedIcon prop={selected} />}
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
    backgroundColor: colors.white,
  },
  boxContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderColor: colors.black,
    borderWidth: 2,
    alignSelf: "center",
    height: "100%",
    width: "98%",
  },
  image: {
    height: 250,
    width: "100%",
    justifyContent: "flex-end",
    borderRadius: 10,
    overflow: "hidden",
  },
  picContainer: {
    justifyContent: "center",
    width: 150,
  },
  profilePic: {
    height: 150,
    width: 150,
    borderColor: colors.white,
    borderRadius: 10,
    borderWidth: 3,
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

export default ProfileSettingsScreen;
