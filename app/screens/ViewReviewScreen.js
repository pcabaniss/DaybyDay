import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import ReviewProp from "../components/ReviewProp";
import SpaceSeperator from "../components/SpaceSeperator";

function ViewReviewScreen({ route, navigation }) {
  const { reviews } = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons
          name="chevron-down"
          size={30}
          color={colors.green}
        />
      </TouchableOpacity>
      <FlatList
        data={reviews}
        ItemSeparatorComponent={SpaceSeperator}
        renderItem={(review) => {
          return (
            <ReviewProp
              user={review.item.user}
              rating={review.item.rating}
              review={review.item.review}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    backgroundColor: colors.medium,
    borderColor: colors.dark,
    borderWidth: 3,
    borderRadius: 5,
    height: 30,
    width: "40%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ViewReviewScreen;
