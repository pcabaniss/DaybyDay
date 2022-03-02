import React, { useCallback, useState, useEffect } from "react";
import { View, StyleSheet, Image, KeyboardAvoidingView } from "react-native";
import { useIsFocused } from "@react-navigation/core";

import { GiftedChat } from "react-native-gifted-chat";
import listings from "../api/listings";
import colors from "../config/colors";

/**
 * The message will contain the following params: 
 * 
 * _id: string | number
  text: string
  createdAt: Date | number
  user: User
  image?: string
  video?: string
  audio?: string
  system?: boolean
  sent?: boolean
  received?: boolean
  pending?: boolean
  quickReplies?: QuickReplies
 */

/**
   * _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
   */

/**
 * This screen will house the sending and retrieving functions based on the 2 users from the params.
 */

function ChatScreen({ navigation, route }) {
  const isFocused = useIsFocused();

  const { name, email, otherUser } = route.params;
  const [messages, setMessages] = useState([]);
  const [userAvatar, setUserAvatar] = useState(" ");
  const [otherAvatar, setOtherAvatar] = useState(" ");

  const getUserPic = async () => {
    const pic = await listings.getProfilePic(email);
    setUserAvatar(pic);
  };

  const getOtherPic = async () => {
    const pic = await listings.getProfilePic(otherUser);
    setOtherAvatar(pic);
  };
  useEffect(() => {
    const refreshed = navigation.addListener("focus", () => {
      getMessages();
    });

    return refreshed;
  });
  getUserPic();
  getOtherPic();

  const sender = {
    _id: email,
    name: name,
    avatar: userAvatar,
    key: Math.round(Math.random() * 1000000),
  };

  //Will send otherUser credentials when i pull from database
  const reciever = {
    _id: otherUser,
    name: "Other User Name",
    avatar: otherAvatar,
    key: Math.round(Math.random() * 1000000),
  };

  const getMessages = async () => {
    const messageArray = await listings.getMessages(otherUser);
    //setMessages([]);
    setMessages((previousMessages) => GiftedChat.append([], messageArray));
  };

  const onSend = useCallback((messages = [], sender, recipients) => {
    // This is where the typed message is
    //console.log(messages);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const temp = messages[0];
    const createdAt = Date.parse(temp.createdAt);
    listings.saveMessages(messages, recipients, createdAt, sender);
    //save messages to database
    //something like postMessages(message, otherUser)
  }, []);
  return (
    <View style={styles.container}>
      <GiftedChat
        user={{ _id: otherUser }}
        onSend={(messages) => onSend(messages, sender, reciever)}
        messages={messages}
        showUserAvatar
        key={Math.round(Math.random() * 1000000)}
        inverted={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue,
  },
});

export default ChatScreen;
