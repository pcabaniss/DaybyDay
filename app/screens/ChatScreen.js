import React, {
  useEffect,
  useCallback,
  useState,
  useLayoutEffect,
} from "react";
import { View, StyleSheet, Text } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import listings from "../api/listings";

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

  const user = {
    _id: 1,
    name: name,
    email: email,
  };

  //Will send otherUser credentials when i pull from database
  const otherUsers = {
    _id: 2,
    name: "Other User Name",
    email: otherUser,
    //avatar: "https://facebook.github.io/react/img/logo_og.png",
  };

  useEffect(() => {
    getMessages();
  }, []);

  const getMessages = async () => {
    const messageArray = await listings.getMessages(otherUser);
    console.log(messageArray);
    setMessages(messageArray);
    if (messageArray[0].user.email == email) {
      setSent(true);
    } else {
      setSent(false);
    }
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
  if (sent == true) {
    return (
      <View style={styles.container}>
        <GiftedChat
          user={user}
          onSend={(messages) => onSend(messages, user, otherUsers)}
          messages={messages}
          inverted={false}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <GiftedChat
          user={otherUsers}
          onSend={(messages) => onSend(messages, otherUsers, user)}
          messages={messages}
          inverted={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatScreen;
