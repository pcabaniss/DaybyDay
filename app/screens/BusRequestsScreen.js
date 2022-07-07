import React, { useState, useEffect } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { useIsFocused } from "@react-navigation/core";
import listings from "../api/listings";
import colors from "../config/colors";
import BusRequestFlatList from "../components/BusRequestFlatList";

//Update to show a flatlist of current requests. On the business
//profile make sure you are allowed to edit the requests and go from there

//This screen should only display users requests and not be interactable.
//The business one should be interactable.
//User should only see what business they requested and the corresponding
//Date

function BusRequestScreen({ navigation, route }) {
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
    const requests = await listings.getBusRequests();
    requests.forEach((item) => {
      if (item.request == "pending") {
        pending.push(item);
      } else if (item.request == "accepted") {
        accepted.push(item);
      } else if (item.request == "denied") {
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
    <KeyboardAvoidingView style={styles.pending}>
      {BusRequestFlatList(pendingArray, "Pending", navigation)}
      {BusRequestFlatList(acceptedArray, "Accepted", pic)}
      {BusRequestFlatList(deniedArray, "Denied", pic)}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  pending: {
    flex: 1,
    backgroundColor: colors.primary,
  },
});

export default BusRequestScreen;
