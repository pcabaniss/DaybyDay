import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
  Alert,
  Text,
  ScrollView,
} from "react-native";
import * as Yup from "yup";
import { firebase } from "../auth/firebaseConfig";
import AppIntroSlider from "react-native-app-intro-slider";
import LottieView from "lottie-react-native";

import ActivityIndicator from "../components/ActivityIndicator";
import usersApi from "../api/users";
import authApi from "../api/auth";
import useApi from "../hooks/useApi";
import useAuth from "../auth/useAuth";
import Screen from "../components/Screen";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  AppForm as Form,
  AppFormField as FormField,
  ErrorMessage,
  SubmitButton,
} from "../components/forms";
import colors from "../config/colors";
import listings from "../api/listings";
import ListItemSeperator from "../components/ListItemSeperator";

/**
 * Needs a onboarding/intro slider screen that displays only once per download explaining the
 * apps features.
 * Each page should have a brief explaination on the top of the differences
 * if a business page have a space for 'company name'
 */

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  //array().min(1, "Please select a profile picture."),
});

function RegisterScreen() {
  const registerApi = useApi(usersApi.register);
  const loginApi = useApi(authApi.login);

  const auth = useAuth();
  const [showMain, setShowMain] = useState(false);
  const [error, setError] = useState();
  const [image, setImage] = useState();

  useEffect(() => {
    requestLibraryPermission();
    requestCameraPermission();
    setShowMain(false);
  }, []);

  const slides = [
    {
      key: "k1",
      title: "Customer!",
      text: "You have chosen to create a customer profile. This means you will be using the app to search for, and schedule appointments with existing businesses. ",
      icon: "account-cash",
      lottie: require("../assets/animations/customer.json"),
      titleStyle: styles.title,
      textStyle: styles.text,
      imageStyle: styles.image,
      backgroundColor: "#F7BB64",
    },
    {
      key: "k2",
      title: "Agenda",
      text: "See your scheduled appointments, schedule custom appointments, and keep track of daily life with the agenda.",
      icon: "notebook",
      lottie: require("../assets/animations/agenda.json"),
      titleStyle: styles.title,
      textStyle: styles.text,
      imageStyle: styles.image,
      backgroundColor: "#F4B1BA",
    },
    {
      key: "k3",
      title: "Discover",
      text: "Discover new businesses and interact with them. Schedule new appointments and keep in touch with messaging, then leave reviews when you have used their services.",
      icon: "briefcase-search",
      lottie: require("../assets/animations/review.json"),
      titleStyle: styles.title,
      textStyle: styles.text,
      imageStyle: styles.image,
      backgroundColor: "#4093D2",
    },
    {
      key: "k4",
      title: "Profile",
      text: "Keep your information up to date and keep track of in-app settings, requests, and messages",
      icon: "account-cog",
      lottie: require("../assets/animations/profile.json"),
      titleStyle: styles.title,
      textStyle: styles.text,
      imageStyle: styles.image,
      backgroundColor: colors.orange,
    },
    {
      key: "k5",
      title: "Enjoy",
      text: "Schedule some peace of mind and enjoy having more orginization in your daily life.",
      icon: "robot-happy",
      lottie: require("../assets/animations/relax.json"),
      titleStyle: styles.title,
      textStyle: styles.text,
      imageStyle: styles.image,
      backgroundColor: "#644EE2",
    },
  ];

  const handleSubmit = async (userInfo) => {
    const email = userInfo.email.replace(".", "-");
    const safeEmail = email.replace("@", "-");
    userInfo.safeEmail = safeEmail;
    userInfo.image = image;
    const result = await registerApi.request(userInfo);
    console.log("Working..........");
    console.log(image);
    const { data: authToken } = await loginApi.request(
      userInfo.email,
      userInfo.password,
      userInfo.safeEmail,
      userInfo.name,
      userInfo.image,
      userInfo.business
    );
    if (!authToken) {
      console.log("Error: " + error);
      return;
    }
    auth.logIn(authToken);
    firebase.default
      .auth()
      .signInWithEmailAndPassword(userInfo.email, userInfo.password)
      .catch(function (error) {
        console.log("Encountered Error!");
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === "auth/wrong-password") {
          alert("Wrong password.");
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  };

  // image picker

  const requestLibraryPermission = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted)
      alert("You need to enable permissions to access the library.");
  };

  const requestCameraPermission = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) alert("You need to enable permissions to access the Camera.");
  };

  const handlePress = () => {
    if (!image) alertButton();
    else
      Alert.alert("Delete", "Are you sure you want to delete this image?", [
        { text: "Yes", onPress: () => setImage(null) },
        { text: "No" },
      ]);
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        mediaTypes: "Images",
      });
      setImage(result.uri);
      console.log(result.uri);
    } catch (error) {
      console.log("Error taking picture.");
    }
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        allowsEditing: true,
        //aspect: [4,3],
        quality: 1,
      });
      //Send a promise to save the picture to storage once register button is clicked
      if (!result.cancelled) setImage(result.uri);
      console.log(result.uri);
    } catch (error) {
      console.log("Error reading image" + error);
    }
  };

  const alertButton = () => {
    Alert.alert("Upload from?", "", [
      {
        text: "Photo Library",
        onPress: () => {
          selectImage();
        },
      },
      {
        text: "Take Picture",
        onPress: () => {
          takePhoto();
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const onSkipSlides = () => {
    setShowMain(true);
  };

  const onDoneWithSlides = () => {
    setShowMain(true);
  };

  return (
    <>
      <ActivityIndicator visible={registerApi.loading || loginApi.loading} />
      {showMain ? (
        <ScrollView style={styles.scroll}>
          <Text style={styles.header}>Customer</Text>
          <ListItemSeperator />
          <Text style={styles.description}>
            If you will be using DxD for discovering businesses and making
            appointments.
          </Text>
          <ListItemSeperator />

          <Screen style={styles.container}>
            <Form
              initialValues={{
                name: "",
                safeEmail: "",
                email: "",
                password: "",
                image: "",
                business: false,
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <View style={styles.imagePicker}>
                <TouchableWithoutFeedback onPress={handlePress}>
                  <View style={styles.imageContainer}>
                    {!image && (
                      <MaterialCommunityIcons
                        color={colors.dark}
                        name="account"
                        size={75}
                      />
                    )}
                    {image && (
                      <Image
                        name="image"
                        source={{ uri: image }}
                        style={styles.image}
                      />
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <ErrorMessage error={error} visible={error} />
              <FormField
                autoCorrect={false}
                icon="account"
                name="name"
                placeholder="Name"
              />
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="email"
                keyboardType="email-address"
                name="email"
                placeholder="Email"
                textContentType="emailAddress"
              />

              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="lock"
                name="password"
                placeholder="Password"
                secureTextEntry
                textContentType="password"
              />
              <SubmitButton
                title="Lets get started"
                color={colors.greenCheck}
              />
            </Form>
          </Screen>
        </ScrollView>
      ) : (
        <AppIntroSlider
          data={slides}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  backgroundColor: item.backgroundColor,
                  flex: 1,
                  paddingTop: 20,
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  padding: 20,
                }}
              >
                <Text style={styles.tutorialTitle}>{item.title}</Text>
                <LottieView
                  source={item.lottie}
                  loop
                  autoPlay
                  style={{ width: 200, height: 200 }}
                />
                <Text style={styles.tutorialText}>{item.text}</Text>
              </View>
            );
          }}
          onDone={onDoneWithSlides}
          onSkip={onSkipSlides}
        />
      )}
    </>
  );
}

//Image picker

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.black,
  },
  description: {
    backgroundColor: colors.black,
    fontSize: 18,
    padding: 5,
    paddingTop: 15,
    paddingBottom: 15,
    textAlign: "center",
    color: colors.white,
  },
  imageContainer: {
    backgroundColor: colors.light,
    borderRadius: 50,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    width: 100,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePicker: {
    height: 120,
    alignContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: colors.black,
    fontSize: 80,
    textAlign: "center",
    fontFamily: "Kohinoor Bangla",
    paddingTop: 15,
    color: colors.green,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.black,
  },
  tutorialTitle: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    //marginTop: 20,
    justifyContent: "flex-start",
  },
  tutorialText: {
    color: "#fff",
    fontSize: 20,
  },
  tutorialImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});

export default RegisterScreen;
