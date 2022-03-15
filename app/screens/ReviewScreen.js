import React, { useState, useEffect } from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { useIsFocused } from "@react-navigation/core";

import colors from "../config/colors";
import { AirbnbRating, Rating } from "react-native-ratings";
import PercentageBar from "../components/PercentageBar";
import SpaceSeperator from "../components/SpaceSeperator";
import listings from "../api/listings";

//This screen will show the overall review rating and give option to leave
//a review if you are a user (only once).
//TODO: Make a function that returns the average review
//Make a function to take you to review page
//Retrieve reviews and average them based on other ratings
//Make an if statement that will check if user has made a review already

function ReviewScreen({ navigation, business, isUser }) {
  const isFocused = useIsFocused();

  const [reviews, setReviews] = useState([{}]);
  const [total, setTotal] = useState(0);
  const [isUsers, setIsUsers] = useState(isUser);
  const [totalRating, setTotalRating] = useState(3);
  const [onesStar, setOneStar] = useState(0);
  const [twosStar, setTwoStar] = useState(0);
  const [threesStar, setThreeStar] = useState(0);
  const [foursStar, setFourStar] = useState(0);
  const [fivesStar, setFiveStar] = useState(0);

  useEffect(() => {
    getReviews();
  }, [isFocused]);

  const totalStars = (total, stars) => {
    if (stars == 0) {
      return 0;
    }
    return (total / stars) * 10;
  };
  const getReviews = async () => {
    //Total number of stars
    var total = 0;
    //Total number of reviews
    var count = 0;

    var oneStar = 0;
    var twoStar = 0;
    var threeStar = 0;
    var fourStar = 0;
    var fiveStar = 0;

    const gotReviews = await listings.getRatings(business);
    const userDidReview = listings.returnEmail();

    setReviews(gotReviews);

    gotReviews.map((item) => {
      count++;
      total = total + item.rating;
      if (item.user == userDidReview) {
        setIsUsers(false);
      }
      if (item.rating == 1) {
        oneStar++;
      } else if (item.rating == 2) {
        twoStar++;
      } else if (item.rating == 3) {
        threeStar++;
      } else if (item.rating == 4) {
        fourStar++;
      } else if (item.rating == 5) {
        fiveStar++;
      }
    });
    setTotal(count);
    setOneStar(oneStar);
    setTwoStar(twoStar);
    setThreeStar(threeStar);
    setFourStar(fourStar);
    setFiveStar(fiveStar);

    const totalStars = (total / count).toFixed(1);
    setTotalRating(totalStars);
  };

  return (
    <View style={styles.container}>
      {isUsers ? (
        <Button
          title="Add a review?"
          color={colors.orange}
          onPress={() => navigation.navigate("input", { business: business })}
        />
      ) : (
        <View />
      )}

      <Text style={styles.title}>Customer reviews</Text>
      <View style={styles.stars}>
        <Rating
          //calculate count from listings
          type="custom"
          ratingCount={5}
          showRating={false}
          tintColor="#F5F8FF"
          style={{ padding: 10 }}
          ratingColor={colors.yellow}
          ratingBackgroundColor={colors.light}
          startingValue={totalRating}
          readonly={true}
        />
        <Text>{totalRating} out of 5</Text>
      </View>
      <Text style={styles.totalText}>({total} Reviews)</Text>
      <View style={styles.bars}>
        <PercentageBar
          starText={"5 Star"}
          percentage={totalStars(total, fivesStar)}
        />
        <SpaceSeperator />
        <PercentageBar
          starText={"4 Star"}
          percentage={totalStars(total, foursStar)}
        />
        <SpaceSeperator />
        <PercentageBar
          starText={"3 Star"}
          percentage={totalStars(total, threesStar)}
        />
        <SpaceSeperator />
        <PercentageBar
          starText={"2 Star"}
          percentage={totalStars(total, twosStar)}
        />
        <SpaceSeperator />
        <PercentageBar
          starText={"1 Star"}
          percentage={totalStars(total, onesStar)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bars: {
    marginTop: 40,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingBottom: 40,
    minWidth: "80%",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1.0,
    shadowRadius: 2,
    shadowColor: "rgba(193, 211, 251, 0.5)",
    elevation: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#323357",
    textAlign: "center",
  },
  stars: {
    marginTop: 20,
    marginBottom: 5,
    flexDirection: "row",
    backgroundColor: "#F5F8FF",
    borderRadius: 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalText: {
    alignSelf: "center",
    color: colors.medium,
  },
});

export default ReviewScreen;
