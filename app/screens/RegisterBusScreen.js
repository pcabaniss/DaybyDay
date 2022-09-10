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
import ListItemSeperator from "../components/ListItemSeperator";

/**
 * Create a tab navigator for 2 screens, a business page and a customer one
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
  const [error, setError] = useState();
  const [showMain, setShowMain] = useState(false);
  const [image, setImage] = useState();

  useEffect(() => {
    setShowMain(false);
  }, []);

  const slides = [
    {
      key: "k1",
      title: "Lets get down to business",
      text: "You have chosen to create a business profile. This means you'll be using this app to discover, communicate, and engage with customers.",
      icon: "account-group-outline",
      lottie: require("../assets/animations/business.json"),
      titleStyle: styles.title,
      textStyle: styles.text,
      imageStyle: styles.image,
      backgroundColor: "#F7BB64",
    },
    {
      key: "k2",
      title: "Make your schedule",
      text: "With Day by Day you can set your own hours, and how many appointments you want in a day.",
      icon: "calendar-clock",
      lottie: require("../assets/animations/calendar.json"),
      titleStyle: styles.title,
      textStyle: styles.text,
      imageStyle: styles.image,
      backgroundColor: "#F4B1BA",
    },
    {
      key: "k3",
      title: "Profile creation",
      text: "Let your customers know all about your business with your customizable profile.",
      icon: "card-account-details-star",
      lottie: require("../assets/animations/profile.json"),
      titleStyle: styles.title,
      textStyle: styles.text,
      imageStyle: styles.image,
      backgroundColor: "#4093D2",
    },
    {
      key: "k4",
      title: "Agenda",
      text: "Keep track of all your custom or scheduled appointments with in the agenda tab.",
      icon: "notebook",
      lottie: require("../assets/animations/agenda.json"),
      titleStyle: styles.title,
      textStyle: styles.text,
      imageStyle: styles.image,
      backgroundColor: "#644EE2",
    },
    {
      key: "k5",
      title: "Settings",
      text: "Check on your messages, requests, and notifications in the account settings tab.",
      icon: "cog",
      lottie: require("../assets/animations/bell.json"),
      titleStyle: styles.title,
      textStyle: styles.text,
      imageStyle: styles.image,
      backgroundColor: "#644EE2",
    },
  ];

  const handleSubmit = async (userInfo) => {
    if (userInfo.email.length < 5) {
      return Alert.alert(
        "Hmmm, somethings not right.",
        "Looks like there's a problem with your email, please double check it and try again.",
        [{ text: "OK", style: "cancel" }]
      );
    }
    if (!image) {
      return Alert.alert(
        "Hold on a sec.",
        "Looks like like you forget a profile picture, please upload one and try again.",
        [{ text: "OK", style: "cancel" }]
      );
    }

    const email = userInfo.email.split(".").join("-");
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

    console.log("Successfully logged in!");
  };

  // image picker

  const requestLibraryPermission = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    return granted;
  };

  const requestCameraPermission = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();

    return granted;
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
    const request = await requestCameraPermission();
    if (!request) {
      return alert("You need to enable permissions to access the Camera.");
    } else {
      try {
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          mediaTypes: "Images",
        });
        console.log("Got picture from camera: " + result);
        const source = result.uri;
        if (Platform.OS === "ios") {
          source.replace("file://", "");
        }
        listings.replaceImage(email, source);
        setImage(source);
        console.log(result.uri);
      } catch (error) {
        console.log("Error taking picture.");
      }
    }
  };

  const selectImage = async () => {
    const result = await requestLibraryPermission();

    if (!result) {
      return alert("You need to enable permissions to access the library.");
    } else {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: "Images",
          allowsEditing: true,
          //aspect: [4,3],
          quality: 1,
        });
        const source = result.uri;
        if (Platform.OS === "ios") {
          source.replace("file://", "");
        }
        //listings.replaceImage(email, source);
        //Send a promise to save the picture to storage once register button is clicked
        if (!result.cancelled) setImage(source);
      } catch (error) {
        console.log("Error reading image" + error);
      }
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
          <Text style={styles.header}>Business</Text>
          <ListItemSeperator />

          <Screen style={styles.container}>
            <Form
              initialValues={{
                name: "",
                safeEmail: "",
                email: "",
                password: "",
                image: "",
                business: true,
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
                        name="account-group"
                        size={65}
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
                icon="shopping"
                name="name"
                placeholder="Business Name"
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
              <Text style={{ color: colors.primaryDark, flex: 1 }}>
                **This email will be displayed to customers for contact.
              </Text>
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
    marginTop: 10,
    backgroundColor: colors.primary,
  },
  imageContainer: {
    backgroundColor: colors.white,
    borderRadius: 50,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    width: 100,
    overflow: "hidden",
  },
  description: {
    backgroundColor: colors.primary,
    color: colors.white,
    fontSize: 18,
    padding: 5,
    paddingTop: 15,
    paddingBottom: 15,
    textAlign: "center",
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
    backgroundColor: colors.primary,
    color: "white",
    fontSize: 80,
    textAlign: "center",
    fontFamily: "Kohinoor Bangla",
    paddingTop: 15,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.primary,
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
