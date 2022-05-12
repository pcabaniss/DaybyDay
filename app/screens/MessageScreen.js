import React, { useState, useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import listings from "../api/listings";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ListItem from "../components/ListItem";
import ListItemDeleteItem from "../components/ListItemDeleteItem";
import ListItemSeperator from "../components/ListItemSeperator";

import colors from "../config/colors";

/**
 * This function will contain a listing function that will search and the DB
 * with a forEach and display a listItem (just like accountScreen) and
 * when you click on each one send the information as params to ChatScreen
 const initialMessage = [
   {
     id: 1,
     title: "T1",
     description: "D1",
     image: require("../assets/mosh.jpg"),
    },
  ];
  */

function MessageScreen({ navigation, route }) {
  const { email, name } = route.params;
  const [isEmpty, setIsEmpty] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [inbox, setInbox] = useState([{}]);

  //Next step is to pull the other user informatio from somewhere

  useEffect(() => {
    const getInbox = async () => {
      const gets = await listings.getInbox();
      setInbox(gets);
    };
    getInbox();

    if (inbox == undefined) {
      setInbox([]);
      setIsEmpty(true);
    }
  });

  const pressedOn = (email, name, item) => {
    navigation.navigate("Chat", {
      email: email,
      name: name,
      otherUser: item.email,
    });

    listings.updateUnread(item);
  };

  const handleDelete = (message) => {
    console.log("Pressed!");
    listings.deleteMessage(message);
    //Delete the message from messages
    setInbox(inbox.filter((m) => m.email !== message.email));
    //Call the server
  };

  // return cute image/animation here
  return (
    <View style={{ flex: 1 }}>
      {isEmpty ? (
        <View style={{ justifyContent: "center", flex: 1 }}>
          <MaterialCommunityIcons
            style={{
              alignSelf: "center",
            }}
            name="email-open-outline"
            size={130}
            color={colors.black}
          />
          <Text
            style={{ alignSelf: "center", fontSize: 20, color: colors.black }}
          >
            Inbox empty
          </Text>
        </View>
      ) : (
        <View>
          <FlatList
            data={inbox}
            //keyExtractor={(message) => message.id.toString()}
            renderItem={({ item }) => {
              // const newEmail =
              // item.email.charAt(0).toUpperCase() + item.email.slice(1);
              return (
                <ListItem
                  title={item.name}
                  subTitle={item.latestMessage}
                  image={item.avatar}
                  onPress={() => pressedOn(email, name, item)}
                  trigger={item.unread}
                  renderRightActions={() => (
                    <ListItemDeleteItem onPress={() => handleDelete(item)} />
                  )}
                />
              );
            }}
            ItemSeparatorComponent={ListItemSeperator}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(!refreshing);
            }}
          />
        </View>
      )}
    </View>
  );
}

export default MessageScreen;
