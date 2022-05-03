import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { Searchbar } from "react-native-paper";

import ActivityIndicator from "../components/ActivityIndicator";
import Card from "../components/Card";
import colors from "../config/colors";
import listings from "../api/listings";
import Screen from "../components/Screen";
import useApi from "../hooks/useApi";

function DiscoverScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState();
  const [results, setResults] = useState(false);
  const [blockedList, setBlockedList] = useState([]);
  const [didSearch, setDidSearch] = useState("Search by name or email.");
  const [tempResults, setTempResults] = useState([
    {
      email: "",
      key: 0,
      name: "",
    },
  ]);

  const getListingsApi = useApi(listings.getListings);

  useEffect(() => {
    listings.getSearchResults();
    getBlockedList();
  }, []);

  const getBlockedList = async () => {
    const blocked = await listings.getBlockedList();

    setBlockedList(blocked);
  };

  const searchFuntion = async (text) => {
    setSearchQuery(text);
    if (text == "") {
      setDidSearch("Search by name or email.");
      setResults(false);
    } else {
      const results = await listings.getSearchResults(text);
      if (results.length == 0) {
        setResults(false);
        setDidSearch("No results found.");
      } else {
        setTempResults(results);
        setResults(true);
        console.log("Results found, loading....");
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
            renderItem={({ item }) => {
              return (
                <Card
                  title={item.name}
                  subTitle={item.email}
                  onPress={() =>
                    clickedProfile(item.email, item.pic, item.name)
                  }
                  imageUrl={item.pic}
                />
              );
            }}
          />
        ) : (
          <>
            <View style={styles.beforeView}>
              <Text style={styles.beforeSearch}>{didSearch}</Text>
            </View>
          </>
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  beforeView: {
    flex: 1,
    justifyContent: "center",
  },
  beforeSearch: {
    textAlign: "center",
    fontSize: 30,
    color: colors.medium,
    fontWeight: "bold",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 1.0,
    shadowRadius: 2,
    shadowColor: colors.dark,
    elevation: 5,
  },
  container: {
    backgroundColor: colors.black,
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
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1.0,
    shadowRadius: 2,
    shadowColor: colors.dark,
    elevation: 5,
  },
});

export default DiscoverScreen;
