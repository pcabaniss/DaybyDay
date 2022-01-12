import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/core";
import listings from "../api/listings";
import RequestFlatList from "../components/RequestFlatList";
import colors from "../config/colors";

//Update to show a flatlist of current requests. On the business
//profile make sure you are allowed to edit the requests and go from there

//This screen should only display users requests and not be interactable.
//The business one should be interactable.
//User should only see what business they requested and the corresponding
//Date

function RequestScreen({ navigation, route }) {
  const { pic } = route.params;
  const isFocused = useIsFocused();

  const [pendingArray, setPendingArray] = useState([]);
  const [deniedArray, setDeniedArray] = useState([]);
  const [acceptedArray, setAcceptedArray] = useState([]);

  var pending = [];
  var accepted = [];
  var denied = [];

  useEffect(() => {
    const refresh = navigation.addListener("focus", async () => {
      getRequests();
    });
    return refresh;
  }, [isFocused]);

  const getRequests = async () => {
    const requests = await listings.getUserRequests();

    requests.forEach((item) => {
      if (item.status == "pending") {
        pending.push(item);
      } else if (item.status == "accepted") {
        accepted.push(item);
      } else if (item.status == "denied") {
        denied.push(item);
      }
    });

    if (accepted.length > 0) {
      setAcceptedArray(() => accepted);
    }
    if (pending.length > 0) {
      setPendingArray(() => pending);
    }
    if (denied.length > 0) {
      setDeniedArray(() => denied);
    }
  };

  //getRequests();
  /**
   * Object {
  "dat": "2022-01-16",
  "request": "pending",
  "time": "06:18 am",
  "timeRequested": "01-07 10:57:49 pm",
  "user": "testing-gmail-com",
}
   */

  return (
    <View style={styles.pending}>
      {RequestFlatList(pendingArray, "Pending", pic)}
      {RequestFlatList(acceptedArray, "Accepted")}
      {RequestFlatList(deniedArray, "Denied")}
    </View>
  );
}

const styles = StyleSheet.create({
  pending: {
    flex: 1,
    backgroundColor: colors.blue,
  },
  accepted: {},
  denied: {},
  titleText: {
    fontSize: 30,
    textAlign: "center",
    backgroundColor: colors.green,
  },
  requestBox: {
    backgroundColor: colors.white,
    padding: 5,
  },
});

export default RequestScreen;
