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
import listings from "../api/listings";
import Seperator from "./Seperator";

function RequestFlatList(data, status) {
  const [statusPressed, setStatusPressed] = useState(true);

  const iconTurn = () => {
    if (!statusPressed) {
      return "chevron-right";
    } else {
      return "chevron-down";
    }
  };

  const colorSelect = () => {
    if (status == "Pending") {
      return colors.primaryLight;
    } else if (status == "Accepted") {
      return colors.greenCheck;
    } else {
      return colors.danger;
    }
  };

  return (
    <View style={styles.container}>
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
            ItemSeparatorComponent={Seperator}
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
                      //Make a delete function
                      //Picture from business
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
  },
  noDice: {
    backgroundColor: colors.primary,
    width: "100%",
    height: 50,
  },

  titleText: {
    fontSize: 30,
    textAlign: "center",
  },
  requestBox: {
    backgroundColor: colors.primary,
    padding: 5,
  },
});

export default RequestFlatList;
