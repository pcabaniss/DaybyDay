import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import { Swipeable } from "react-native-gesture-handler";

import AppText from "./AppText";

//List item is a view rendered multiple times taking in different information
//for each colunm

function ListItem({
  title,
  subTitle,
  image,
  IconComponent,
  onPress,
  renderRightActions,
  trigger,
}) {
  if (title != undefined) {
    var capitalEmail = title.charAt(0).toUpperCase() + title.slice(1);
  }

  return (
    //By default the flex is set to vertical but we set this one to row
    //so it will display views side by side
    //we put a view as a child because we want the second view to be vertical
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity underlayColor={colors.light} onPress={onPress}>
        <View style={styles.container}>
          {IconComponent}
          {trigger ? (
            <View
              style={{
                backgroundColor: colors.danger,
                height: 15,
                width: 15,
                borderRadius: 8,
                marginLeft: -10,
                marginRight: 5,
              }}
            ></View>
          ) : (
            <View></View>
          )}

          {image && <Image style={styles.image} source={{ uri: image }} />}

          <View style={styles.detailsContainer}>
            <AppText style={styles.title} numberOfLines={1}>
              {capitalEmail}
            </AppText>
            {subTitle && (
              <AppText style={styles.subTitle} numberOfLines={2}>
                {subTitle}
              </AppText>
            )}
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={25}
            color={colors.medium}
          />
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
    backgroundColor: colors.white,
    borderWidth: 1,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.white,
    borderWidth: 1,
  },
  subTitle: {
    color: colors.medium,
    fontSize: 16,
  },
  title: {
    fontWeight: "600",
    fontSize: 22,
    color: colors.dark,
  },
});

export default ListItem;
