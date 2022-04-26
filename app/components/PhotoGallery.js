import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Alert,
} from "react-native";

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
  const [imageURL, setImageURL] = useState("");
  const [isEmpty, setISEmpty] = useState(false);

  const isFocused = useIsFocused();

  const getGallery = async () => {
    //const test = await listings.testGet(email);
  };

  useEffect(() => {
    const fetchData = async () => {
      const gallery = await listings
        .getImages(email)
        .then(console.log("Got pics..."));

      setTemp(gallery);
    };

    fetchData().catch(console.error);

    if (temp.length == 0) {
      setISEmpty(true);
    } else {
      setISEmpty(false);
    }
  }, []);

  const showModalFunction = (visible, downloadURL, imageURL) => {
    //handler to handle the click on image of Grid
    //and close button on modal
    setImageuri(downloadURL);
    setIsOpen(visible);
    setImageURL(imageURL);
  };

  const renderEmtyGallery = () => {
    return (
      <View style={styles.empty}>
        <Text style={{ alignSelf: "center" }}>
          This business has no uploaded pictures yet.
        </Text>
        <Text style={{ alignSelf: "center" }}>
          So enjoy this adorable picture of a puppy.
        </Text>
        <Image
          source={require("../assets/puppy.jpg")}
          resizeMethod={"resize"}
          style={{ width: "95%", height: "100%", alignSelf: "center" }}
        />
      </View>
    );
  };

  const deletePicture = (pic) => {
    Alert.alert(
      "Are you sure you want to delete this picture?",
      "You can't get it back once you do this.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "I'm sure",
          onPress: () => {
            listings.deleteImage(imageURL);
            setIsOpen(false);
          },
        },
      ]
    );
  };
  //Redefine to have a delete images function if a bus profile

  return (
    <>
      {isEmpty ? (
        renderEmtyGallery()
      ) : (
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
                {isUser ? (
                  <View></View>
                ) : (
                  <Text
                    style={styles.deleteButton}
                    onPress={() => deletePicture(imageURL)}
                  >
                    Delete?
                  </Text>
                )}
              </View>
            </Modal>
          ) : (
            <View style={styles.container}>
              <FlatList
                data={temp}
                contentContainerStyle={{ padding: 5 }}
                renderItem={({ item }) => {
                  console.log(item);
                  return (
                    <TouchableOpacity
                      style={styles.imageContainerStyle}
                      onPress={() => {
                        showModalFunction(
                          true,
                          item.downloadURL,
                          item.imageURL
                        );
                      }}
                      onLongPress={() => console.log("Long tap!")}
                    >
                      <Image
                        style={styles.image}
                        source={{ uri: item.downloadURL }}
                        //resizeMode={"center"}
                        resizeMethod={"resize"}
                      />
                    </TouchableOpacity>
                  );
                }}
                key={Math.random()}
                numColumns={3}
                keyExtractor={(item) => {
                  item.imageURL;
                }}
              />
            </View>
          )}
        </View>
      )}
    </>
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
  deleteButton: {
    width: "50%",
    height: 25,
    top: 60,
    left: 25,
    position: "absolute",
    fontSize: 18,
    color: colors.dark,
  },
  empty: {
    width: "95%",
    height: 500,
    alignSelf: "center",
  },
});

export default PhotoGallery;
