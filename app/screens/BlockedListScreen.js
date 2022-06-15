import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import listings from "../api/listings";
import ListItem from "../components/ListItem";
import ListItemSeperator from "../components/ListItemSeperator";
import Seperator from "../components/Seperator";
import colors from "../config/colors";

function BlockedListScreen({ navigation }) {
  const [blocked, setBlocked] = useState([{}]);
  const [empty, setEmpty] = useState(false);

  const gettem = async () => {
    const list = await listings.currentblockedList();

    setBlocked(list);

    if (blocked.length == 0 || blocked == [{}]) {
      setEmpty(true);
    } else {
      setEmpty(false);
    }
  };

  useEffect(() => {
    gettem();
  }, []);

  return (
    <View style={styles.container}>
      {empty ? (
        <View>
          <Text style={styles.text}>Nothing to show.</Text>
        </View>
      ) : (
        <View style={styles.item}>
          <FlatList
            data={blocked}
            scrollEnabled
            ItemSeparatorComponent={Seperator}
            contentContainerStyle={{
              borderRadius: 25,
              width: "99%",
              backgroundColor: colors.white,
              overflow: "hidden",
            }}
            renderItem={({ item }) => {
              return (
                <ListItem
                  title={item.name}
                  subTitle={item.email}
                  image={item.pic}
                  onPress={() =>
                    Alert.alert(
                      "Are you sure you want to unblock " + item.name + "?",
                      "They will be able to communicate with you through messaging again.",
                      [
                        {
                          text: "I'm sure.",
                          onPress: () => {
                            listings.unblock(item.email);
                            navigation.goBack();
                          },
                        },
                        { text: "Nevermind", style: "cancel" },
                      ]
                    )
                  }
                />
              );
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  item: {
    marginVertical: 20,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: colors.white,
    borderWidth: 3,
    width: "97%",
    alignSelf: "center",
    borderColor: colors.black,
  },
  text: {
    fontSize: 30,
    color: colors.primaryDark,
    alignSelf: "center",
  },
});

export default BlockedListScreen;
