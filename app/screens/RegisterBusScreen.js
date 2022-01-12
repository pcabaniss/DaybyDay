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
  const [image, setImage] = useState();

  useEffect(() => {
    requestLibraryPermission();
    requestCameraPermission();
  }, []);

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

    console.log("Successfully logged in!");
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
      console.log("Got picture from camera: " + result);
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
      const source = result.uri;
      if (Platform.OS === "ios") {
        source.replace("file://", "");
      }

      //Send a promise to save the picture to storage once register button is clicked
      if (!result.cancelled) setImage(source);
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

  return (
    <>
      <ActivityIndicator visible={registerApi.loading || loginApi.loading} />
      <ScrollView style={styles.scroll}>
        <Text style={styles.header}>Business</Text>
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
                      color={colors.black}
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
            <Text style={{ color: colors.dark, flex: 1 }}>
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
            <SubmitButton title="Register" color={colors.primary} />
          </Form>
        </Screen>
      </ScrollView>
    </>
  );
}

//Image picker

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.blue,
  },
  imageContainer: {
    backgroundColor: colors.blue,
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
    height: 400, //Noteworthy-Bold
    backgroundColor: colors.blue,
    fontSize: 80,
    textAlign: "center",
    fontFamily: "Noteworthy-Bold",
    paddingTop: 25,
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
});

export default RegisterScreen;