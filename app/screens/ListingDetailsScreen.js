import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "react-native-expo-image-cache";

import ListItem from "../components/ListItem";
import AppText from "../components/AppText";
import colors from "../config/colors";

//This screen will be an interactive calendar that you can insert your
//daily schedule into, as well as see any scheduled appointments made
//throught the app. Also be able to edit them if need be.
// That means navigation from this page to business pages, and update
//the backend as well simultaniously.

function ListingDetailsScreen({ route }) {
  const listing = route.params;

  return (
    <View>
      <View style={styles.details}>
        <AppText style={styles.title}>Hello</AppText>
        <AppText style={styles.price}>World</AppText>
        <View style={styles.userContainer}>
          <ListItem
            image={require("../assets/mosh.jpg")}
            title="Generic Name"
            subTitle="5 Listings"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  details: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
  },
  price: {
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  userContainer: {
    marginVertical: 40,
  },
});

export default ListingDetailsScreen;
