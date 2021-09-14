import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, SafeAreaView } from "react-native";
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

function DiscoverScreen(props) {
  const [searchQuery, setSearchQuery] = useState();

  const getListingsApi = useApi(listings.getListings);

  useEffect(() => {
    getListingsApi.request();
  }, []);

  const onChangeSearch = (query) => setSearchQuery(query);
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
          placeholder="Discover"
          onChangeText={onChangeSearch}
          value={searchQuery}
          collapsable={true}
        />
        <FlatList
          data={getListingsApi.data}
          keyExtractor={(listings) => listings.id.toString()}
          style={styles.list}
          renderItem={({ item }) => (
            <Card
              title={item.title}
              subTitle={"$" + item.price}
              imageUrl={item.images[0].url}
              onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)}
              thumbnailUrl={item.images[0].thumbnailUrl}
            />
          )}
        />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default DiscoverScreen;
