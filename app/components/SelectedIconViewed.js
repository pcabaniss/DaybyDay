import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import MessageForm from "./MessageForm";
import ViewSchedulingCalendar from "./calendar/ViewSchedulingCalendar";
import PhotoGallery from "./PhotoGallery";
import ReviewScreen from "../screens/ReviewScreen";
import listings from "../api/listings";

const Tab = createBottomTabNavigator();

function SelectedIconViewed({
  navigation,
  business,
  businessPic,
  businessName,
  myUN,
  myPP,
}) {
  const [images, setImages] = useState();

  useEffect(() => {
    const getInfo = async () => {
      const gallery = await listings.getImages(business);

      setImages(gallery);
    };

    getInfo();
  }, []);

  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBarOptions={{
          tabStyle: {
            paddingBottom: 3,
            borderColor: colors.black,
            backgroundColor: colors.primaryLight,
            //alignSelf: "center",
            //padding: 10,
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 1.0,
            shadowRadius: 2,
            shadowColor: "rgba(193, 211, 251, 0.5)",
            elevation: 5,
          },
          style: {
            backgroundColor: colors.white,
            borderTopColor: colors.black,
          },
          activeTintColor: colors.primaryDark,
          inactiveTintColor: colors.white,
          showLabel: false,
        }}
      >
        <Tab.Screen
          name="Schedule"
          options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="calendar-month"
                color={color}
                size={25}
              />
            ),
          }}
        >
          {(props) => (
            <ViewSchedulingCalendar navigation={navigation} email={business} />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Message"
          options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="message-text"
                color={color}
                size={25}
              />
            ),
          }}
        >
          {(props) => (
            <MessageForm
              type="user"
              business={business}
              businessPic={businessPic}
              businessName={businessName}
              userName={myUN}
              userPic={myPP}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Reviews"
          options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="star-circle-outline"
                color={color}
                size={25}
              />
            ),
          }}
        >
          {(props) => (
            <ReviewScreen
              navigation={navigation}
              business={business}
              isUser={true}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Pictures"
          options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="image-multiple-outline"
                color={color}
                size={22}
              />
            ),
          }}
        >
          {(props) => (
            <PhotoGallery email={business} isUser={true} gallery={images} />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column-reverse",
    height: "100%",
    backgroundColor: colors.primaryLight,
  },
});

export default SelectedIconViewed;
