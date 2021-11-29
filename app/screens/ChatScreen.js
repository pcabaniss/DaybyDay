import React, {
  useEffect,
  useCallback,
  useState,
  useLayoutEffect,
} from "react";
import { View, StyleSheet, Text } from "react-native";
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
  const { name, email, otherUser } = route.params;
  //navigation.setOptions({ headerTitle: "Bob the stanger" });
  const [messages, setMessages] = useState([]);
  const [sent, setSent] = useState(false);

  const sender = {
    _id: email,
    name: name,
    email: email,
  };

  //Will send otherUser credentials when i pull from database
  const reciever = {
    _id: otherUser,
    name: "Other User Name",
    email: otherUser,
    //avatar: "https://facebook.github.io/react/img/logo_og.png",
  };

  setInterval(() => {
    getMessages();
  }, 10000);

  const getMessages = async () => {
    const messageArray = await listings.getMessages(otherUser);
    setMessages(messageArray);
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
        user={reciever}
        onSend={(messages) => onSend(messages, sender, reciever)}
        messages={messages}
        inverted={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
});

export default ChatScreen;
