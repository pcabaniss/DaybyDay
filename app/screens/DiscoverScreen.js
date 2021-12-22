import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, SafeAreaView, View, Text } from "react-native";
import { Searchbar } from "react-native-paper";

import ActivityIndicator from "../components/ActivityIndicator";
import AppText from "../components/AppText";
import Button from "../components/AppButton";
import Card from "../components/Card";
import colors from "../config/colors";
import listings from "../api/listings";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import useApi from "../hooks/useApi";

function DiscoverScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState();
  const [results, setResults] = useState(false);
  const [tempResults, setTempResults] = useState([
    {
      email: "none",
      key: 0,
      id: "",
      pic: "",
    },
  ]);

  const getListingsApi = useApi(listings.getListings);

  useEffect(() => {
    listings.getSearchResults();
    getListingsApi.request();
  }, []);

  const searchFuntion = async (text) => {
    setSearchQuery(text);
    if (text == "") {
      setResults(false);
    } else {
      const results = await listings.getSearchResults(text);
      if (results == undefined) {
        console.log("nope");
        setResults(false);
      } else {
        setTempResults(results);
        setResults(true);
        console.log(tempResults);
      }
    }
  };

  const clickedProfile = (email, pic, name) => {
    navigation.navigate("ProfileView", {
      name: name,
      pic: pic,
      email: email,
    });
  };

  //Onclick to the business profile now!

  return (
    <>
      <ActivityIndicator visible={getListingsApi.loading} />
      <Screen style={styles.container}>
        {getListingsApi.error && (
          <>
            <AppText>Couldnt retrieve listings.</AppText>
            <Button name="Retry" onPress={getListingsApi.request()} />
          </>
        )}
        <Searchbar
          style={styles.search}
          placeholder="Search"
          onChangeText={searchFuntion}
          value={searchQuery}
          collapsable={true}
        />
        {results ? (
          <FlatList
            data={tempResults}
            keyExtractor={(item) => "" + item.id}
            style={styles.list}
            renderItem={({ item }) => (
              <Card
                title={item.email}
                subTitle={"business"}
                onPress={() => clickedProfile(item.email, item.pic, item.name)}
                thumbnailUrl={item.pic}
                imageUrl={item.pic.replace("file://", "")}
              />
            )}
          />
        ) : (
          <>
            <FlatList
              //Create a function that picks random businesses and displays their
              //cards
              data={getListingsApi.data}
              keyExtractor={(listings) => listings.id.toString()}
              style={styles.list}
              renderItem={({ item }) => (
                <Card
                  title={item.title}
                  subTitle={"$" + item.price}
                  imageUrl={item.images[0].url}
                  onPress={() =>
                    navigation.navigate(routes.LISTING_DETAILS, item)
                  }
                  thumbnailUrl={item.images[0].thumbnailUrl}
                />
              )}
            />
          </>
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blue,
    padding: 10,
  },
  list: {
    paddingTop: 10,
  },
  search: {
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 25,
  },
  searchResults: {
    backgroundColor: colors.white,

    alignSelf: "center",
    paddingTop: 30,
    position: "absolute",
  },
});

export default DiscoverScreen;
