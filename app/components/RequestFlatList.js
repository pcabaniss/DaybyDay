import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import colors from "../config/colors";
import ListItem from "./ListItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ListItemSeperator from "./ListItemSeperator";
import moment from "moment";

function RequestFlatList(data, status, pic) {
  const [statusPressed, setStatusPressed] = useState(true);

  const iconTurn = () => {
    if (!statusPressed) {
      return "chevron-right";
    } else {
      return "chevron-down";
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setStatusPressed(!statusPressed);
        }}
        style={styles.titleContainer}
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
              const businessName =
                item.business.charAt(0).toUpperCase() + item.business.slice(1);
              return (
                <TouchableOpacity style={styles.requestBox}>
                  <View>
                    <ListItem
                      title={businessName}
                      subTitle={
                        "Date Requested: \n" +
                        moment(item.dateRequested).format("MMM Do") +
                        " at " +
                        item.timeRequested
                      }
                      //Picture from business
                      image={pic}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blue,
  },
  noDice: {
    backgroundColor: colors.black,
    width: "100%",
    height: 50,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: colors.background,
    borderColor: colors.medium,
    borderWidth: 1,
    borderRadius: 5,
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

export default RequestFlatList;
