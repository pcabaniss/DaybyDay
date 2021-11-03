import React from "react";
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

const menuItems = [
  {
    title: "Schedule",
    icon: {
      name: "calendar-month",
      backgroundColor: colors.primary,
    },
    key: "schedule",
  },
  {
    title: "Message",
    icon: {
      name: "email-outline",
      backgroundColor: colors.secondary,
    },
    key: "Message",
  },
  {
    title: "Reviews",
    icon: {
      name: "star-circle-outline",
      backgroundColor: colors.red,
    },
    key: "reviews",
  },
  {
    title: "About",
    icon: {
      name: "head-question",
      backgroundColor: colors.blue,
    },
    key: "About",
  },
];

function ProfileSettingsScreen(props) {
  const profilePicPressed = () => {
    console.log("Pressed profile pic!");
  };

  const backgroundPressed = () => {
    console.log("Pressed background pic!");
  };

  return (
    <ScrollView style={{ backgroundColor: colors.white }}>
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
          justifyContent: "space-between",
        }}
      >
        <View style={{ paddingRight: 10 }}>
          <Text style={styles.nameText}>Business Name</Text>

          <Text style={{ paddingLeft: 5, paddingBottom: 15 }}>
            Email@email.com
          </Text>
        </View>
        <FlatList
          data={menuItems}
          horizontal
          contentContainerStyle={styles.icon}
          renderItem={() => {
            return (
              <MaterialCommunityIcons name="star" size={40} color="#FDCA40" />
            );
          }}
        />
      </View>
      <ListItemSeperator />
      <View style={{ alignSelf: "center", paddingTop: 10 }}>
        <FlatList
          horizontal
          data={menuItems}
          contentContainerStyle={{
            height: 60,
          }}
          ItemSeparatorComponent={SpaceSeperator}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity>
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
      <Text>
        This will be a reactive box that displays information based on the icon
        selected
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bgContainer: {
    borderRadius: 10,
    borderWidth: 5,
    borderColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  image: {
    height: 300,
    width: "100%",
    justifyContent: "flex-end",
  },
  picContainer: {
    justifyContent: "center",
    width: 150,
  },
  profilePic: {
    height: 150,
    width: 150,
    borderColor: colors.white,
    borderRadius: 75,
    borderWidth: 3,
    overflow: "hidden",
  },
  nameText: {
    fontSize: 30,
    paddingLeft: 3,
    color: colors.black,
  },
  icon: {
    borderWidth: 2,
    borderColor: colors.medium,
    width: "100%",
    borderRadius: 17,
    alignSelf: "center",
  },
});

export default ProfileSettingsScreen;
