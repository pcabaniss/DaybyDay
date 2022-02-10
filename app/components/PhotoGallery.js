import React, { useState } from "react";
import { View, StyleSheet, Button, Image, Dimensions } from "react-native";
import { ImageGallery } from "@georstat/react-native-image-gallery";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import listings from "../api/listings";
import AddImages from "./AddImages";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

function PhotoGallery({ email }) {
  const { width } = Dimensions.get("window");

  const [indexSelected, setIndexSelected] = useState(0);
  const [images, setImages] = useState([{}]);
  const [temp, setTemp] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const openGallery = () => {
    var i = 0;
    var boat = [];
    getGallery();
    setIsOpen(true);
    temp.forEach((pic) => {
      boat.push({ id: i, url: pic });
      i++;
    });
    setImages(boat);
  };
  const closeGallery = () => setIsOpen(false);

  const getGallery = async () => {
    var i = 0;
    var boat = [];
    //const test = await listings.testGet(email);
    const gallery = await listings.getImages(email);

    console.log("recieved gallery: ");
    setTemp(gallery);
  };

  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  const renderHeaderComponent = (image, currentIndex) => {
    return (
      <SafeAreaView style={{ padding: 10 }}>
        <MaterialCommunityIcons
          name="alpha-x-circle"
          color={colors.white}
          size={35}
          onPress={() => closeGallery()}
        />
      </SafeAreaView>
    );
  };
  //Redefine to have a delete images function if a bus profile

  return (
    <View style={styles.container}>
      <AddImages email={email} />
      <Button onPress={openGallery} title="View Gallery" />

      <ImageGallery
        close={closeGallery}
        isOpen={isOpen}
        images={images}
        renderCustomImage={(item, index, isSelected) => {
          return (
            <Image
              source={{ uri: item.url }}
              key={index}
              style={styles.image}
            />
          );
        }}
        resizeMode="contain"
        renderHeaderComponent={renderHeaderComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: colors.white,
  },
  image: {
    width: "100%",
    height: "100%",
    //borderRadius: 300,
  },
});

export default PhotoGallery;
