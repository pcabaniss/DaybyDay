import React, { useState, useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import listings from "../api/listings";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ListItem from "../components/ListItem";
import ListItemDeleteItem from "../components/ListItemDeleteItem";
import ListItemSeperator from "../components/ListItemSeperator";

import colors from "../config/colors";
import Seperator from "../components/Seperator";

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
  const [isEmpty, setIsEmpty] = useState(true);
  const [inbox, setInbox] = useState([]);

  //Next step is to pull the other user informatio from somewhere

  const getInbox = async () => {
    const gets = await listings.getInbox();

    setInbox(gets);
    if (gets == undefined) {
      setInbox([]);
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  };

  useEffect(() => {
    getInbox();
  }, []);

  /**
   * 
   * Array [
  Object {
    "avatar": "https://firebasestorage.googleapis.com/v0/b/slate-e5529.appspot.com/o/bladedaddy%40gmail.com%2Fimages%2FprofilePic?alt=media&token=e20b8a3a-8eb0-452c-8e84-48e84d1fb390",
    "email": "bladedaddy@gmail.com",
    "latestMessage": "",
    "name": "No name",
    "unread": true,
  },
]}
   */
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
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      {isEmpty ? (
        <View style={{ justifyContent: "center", flex: 1 }}>
          <MaterialCommunityIcons
            style={{
              alignSelf: "center",
            }}
            name="email-open-outline"
            size={130}
            color={colors.primary}
          />
          <Text
            style={{ alignSelf: "center", fontSize: 20, color: colors.primary }}
          >
            Inbox empty
          </Text>
        </View>
      ) : (
        <View style={{ backgroundColor: colors.primary, padding: 5 }}>
          <FlatList
            data={inbox}
            //keyExtractor={(message) => message.id.toString()}
            renderItem={({ item }) => {
              console.log("This is the item");
              console.log(item);
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
            ItemSeparatorComponent={Seperator}
          />
        </View>
      )}
    </View>
  );
}

export default MessageScreen;
