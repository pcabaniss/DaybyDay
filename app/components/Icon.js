import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import Notifications from "../api/Notifications";
import colors from "../config/colors";
import listings from "../api/listings";

function Icon({
  name,
  size = 50,
  backgroundColor = colors.black,
  iconColor = colors.white,
  title,
  isBusiness,
}) {
  const [badge, setBadge] = useState();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (badge == 0) {
      setIsVisible(false);
    }
  });

  const getBadges = async () => {
    const count = await listings.getMessageBadges();

    setBadge(count);

    if (badge > 0) {
      setIsVisible(true);
    }
  };

  const getReqBadges = async () => {
    const count = await listings.getRequestBadges();

    setBadge(count);

    if (badge > 0) {
      setIsVisible(true);
    }
  };

  //Go to inbox screen and further add badges and update on clicked

  if (title == "Messages") {
    getBadges();
  } else if (title == "Requests" && isBusiness == true) {
    getReqBadges();
  }

  return (
    <>
      <View
        style={{
          borderRadius: size / 2,
          padding: 3,
          marginRight: 5,
          //backgroundColor,
          // alignItems: "center",
          //justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons
          name={name}
          color={iconColor}
          size={size * 0.5}
        />
      </View>
      {isVisible ? (
        <View
          style={{
            backgroundColor: colors.danger,
            height: 15,
            width: 15,
            borderRadius: 8,
            marginBottom: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ fontSize: 10, fontWeight: "bold", color: colors.white }}
          >
            {badge}
          </Text>
        </View>
      ) : (
        <View></View>
      )}
    </>
  );
}

export default Icon;

/*
 */
