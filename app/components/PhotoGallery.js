import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Button,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { ImageGallery } from "@georstat/react-native-image-gallery";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import listings from "../api/listings";
import AddImages from "./AddImages";

import FastImage from "react-native-fast-image";
import { useIsFocused } from "@react-navigation/core";
import DaySeperator from "./DaySeprator";

function PhotoGallery({ email, isUser, navigation }) {
  //const [indexSelected, setIndexSelected] = useState(0);
  const [images, setImages] = useState([]);
  const [temp, setTemp] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [imageuri, setImageuri] = useState("");

  const isFocused = useIsFocused();

  const getGallery = async () => {
    //const test = await listings.testGet(email);
    const gallery = await listings
      .getImages(email)
      .then(console.log("Got pics..."));

    setTemp(gallery);
  };

  useEffect(() => {
    getGallery();

    setImages(temp);
  }, [isFocused]);

  const showModalFunction = (visible, imageURL) => {
    //handler to handle the click on image of Grid
    //and close button on modal
    setImageuri(imageURL);
    setIsOpen(visible);
  };
  //Redefine to have a delete images function if a bus profile

  return (
    <View style={styles.container}>
      {isUser ? <View /> : <AddImages email={email} />}
      {isOpen ? (
        <Modal
          transparent={false}
          animationType={"fade"}
          visible={isOpen}
          onRequestClose={() => {
            showModalFunction(!isOpen, "");
          }}
        >
          <View style={styles.modelStyle}>
            <Image
              style={styles.fullImageStyle}
              source={{ uri: imageuri }}
              resizeMethod={"resize"}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.closeButtonStyle}
              onPress={() => {
                showModalFunction(!isOpen, "");
              }}
            >
              <Image
                source={{
                  uri: "https://raw.githubusercontent.com/AboutReact/sampleresource/master/close.png",
                }}
                style={{ width: 35, height: 35 }}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      ) : (
        <View style={styles.container}>
          <FlatList
            data={images}
            contentContainerStyle={{ padding: 5 }}
            renderItem={({ item }) => {
              console.log(item);
              return (
                <TouchableOpacity
                  style={styles.imageContainerStyle}
                  onPress={() => {
                    showModalFunction(true, item);
                  }}
                >
                  <Image
                    style={styles.image}
                    source={{ uri: item }}
                    //resizeMode={"center"}
                    resizeMethod={"resize"}
                  />
                </TouchableOpacity>
              );
            }}
            key={Math.random()}
            numColumns={3}
            keyExtractor={(item) => {
              item;
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop: 5,
    //backgroundColor: colors.green,
  },
  image: {
    height: 120,
    width: "100%",
    borderColor: colors.black,
    borderWidth: 1,
    //borderRadius: 300,
  },
  imageContainerStyle: {
    flex: 1,
    flexDirection: "column",
    margin: 1,
    backgroundColor: colors.medium,
  },
  titleStyle: {
    padding: 16,
    fontSize: 20,
    color: "white",
    backgroundColor: "green",
  },

  fullImageStyle: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "98%",
    resizeMode: "contain",
  },
  modelStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  closeButtonStyle: {
    width: 25,
    height: 25,
    top: 50,
    right: 20,
    position: "absolute",
  },
});

export default PhotoGallery;
