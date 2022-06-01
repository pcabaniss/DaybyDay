import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import colors from "../config/colors";
import ListItem from "./ListItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ListItemSeperator from "./ListItemSeperator";
import moment from "moment";

function BusRequestFlatList(data, status, navigation) {
  const [statusPressed, setStatusPressed] = useState(true);
  const colorSelect = () => {
    if (status == "Pending") {
      return colors.medium;
    } else if (status == "Accepted") {
      return colors.green;
    } else {
      return colors.red;
    }
  };
  const pressedListing = (item) => {
    console.log(item);
    if (status == "Pending") {
      navigation.navigate("Answer", { item: item });
    } else {
      console.log(status + " Listing pressed!");
    }
  };

  const iconTurn = () => {
    if (!statusPressed) {
      return "chevron-right";
    } else {
      return "chevron-down";
    }
  };

  //add onclick event to be able to make a decision on the request.
  return (
    <KeyboardAvoidingView style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setStatusPressed(!statusPressed);
        }}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          borderColor: colors.dark,
          borderWidth: 1,
          borderRadius: 5,
          backgroundColor: colorSelect(),
          overflow: "hidden",
        }}
      >
        <Text style={styles.titleText}>{status}</Text>
        <MaterialCommunityIcons
          name={iconTurn()}
          size={40}
          color={colors.black}
        />
      </TouchableOpacity>
      {statusPressed ? (
        <>
          <FlatList
            data={data}
            scrollEnabled
            ItemSeparatorComponent={ListItemSeperator}
            renderItem={({ item }) => {
              const userName =
                item.user.charAt(0).toUpperCase() + item.user.slice(1);
              return (
                <TouchableOpacity style={styles.requestBox}>
                  <View>
                    <ListItem
                      title={userName}
                      subTitle={
                        "Date Requested: \n" +
                        moment(item.dateRequested).format("MMM Do") +
                        " at " +
                        item.timeRequested
                      }
                      //Work on the onclick function!
                      //Picture from User
                      onPress={() => pressedListing(item)}
                      image={item.picture}
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </>
      ) : (
        <View></View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
  },
  noDice: {
    backgroundColor: colors.black,
    width: "100%",
    height: 50,
  },

  titleText: {
    fontSize: 30,
    textAlign: "center",
  },
  requestBox: {
    backgroundColor: colors.white,
    padding: 5,
  },
});

export default BusRequestFlatList;
