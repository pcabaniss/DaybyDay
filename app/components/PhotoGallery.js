import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import colors from "../config/colors";
import listings from "../api/listings";
import AddImages from "./AddImages";

function PhotoGallery({ email, isUser, gallery }) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageuri, setImageuri] = useState("");
  const [imageURL, setImageURL] = useState("");

  const checkIfEmpty = () => {
    if (gallery.length == 0) {
      return true;
    }
    return false;
  };

  const showModalFunction = (visible, downloadURL, imageURL) => {
    //handler to handle the click on image of Grid
    //and close button on modal
    setImageuri(downloadURL);
    setIsOpen(visible);
    setImageURL(imageURL);
  };

  const renderEmtyGallery = () => {
    return (
      <View scrollEnabled style={styles.empty}>
        <Text style={{ alignSelf: "center" }}>
          This business has not uploaded pictures yet.
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
            listings.deleteImage(pic);
            setIsOpen(false);
          },
        },
      ]
    );
  };

  return (
    <>
      {checkIfEmpty() ? (
        renderEmtyGallery()
      ) : (
        <ScrollView>
          <View style={styles.container}>
            {isUser ? <View /> : <AddImages email={email} />}
            {isOpen ? (
              <Modal
                transparent={true}
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
              <>
                {gallery.map((item) => (
                  <TouchableOpacity
                    style={styles.imageContainerStyle}
                    onPress={() => {
                      showModalFunction(true, item.downloadURL, item.imageURL);
                    }}
                    onLongPress={() => console.log("Long tap!")}
                  >
                    <Image
                      style={styles.image}
                      source={{ uri: item.downloadURL }}
                      //resizeMode={"center"}
                      defaultSource={require("../assets/defaultImage.png")}
                      resizeMethod={"resize"}
                    />
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "white",
  },
  image: {
    height: 150,
    width: Dimensions.get("screen").width / 3.33,
    borderColor: colors.black,
    borderWidth: 1,
    //borderRadius: 300,
  },
  imageContainerStyle: {
    margin: 1,
    padding: 5,
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
