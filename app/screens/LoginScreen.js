import React, { useState } from "react";
import { Image, StyleSheet, Text } from "react-native";
import { firebase } from "../auth/firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import UploadScreen from "./UploadScreen";
import * as Yup from "yup";

import authApi from "../api/auth";
import Screen from "../components/Screen";
import {
  AppForm,
  AppFormField,
  ErrorMessage,
  SubmitButton,
} from "../components/forms/index";
import useAuth from "../auth/useAuth";
import colors from "../config/colors";
import Notifications from "../api/Notifications";

//With Yup we can set the scheme for each of our text fields easily since
//it is intigrated with Formik
const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen({ navigation }) {
  const { logIn } = useAuth();

  const [loginFailed, setLoginFailed] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async ({ email, password }) => {
    setProgress(0);
    setUploadVisible(true);

    await firebase.default
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => console.log("Logging in...."))
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
    //.then(Notifications.loadAllNotifications(email));

    if (!result.ok) {
      setUploadVisible(false);

      return setLoginFailed(true);
    }
    setLoginFailed(false);
    logIn(result.data);
  };

  const forgottenPassword = () => {
    navigation.navigate("Forgot");
  };
  return (
    <Screen style={styles.container}>
      <UploadScreen
        onDone={() => setUploadVisible(false)}
        progress={progress}
        visible={uploadVisible}
      />
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      <AppForm
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <ErrorMessage
          error="Invalid email and/or password."
          visible={loginFailed}
        />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="email"
          keyboardType="email-address"
          name="email"
          placeholder="Email"
          textContentType="emailAddress"
        />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          name="password"
          placeholder="Password"
          secureTextEntry
          textContentType="password"
        />
        <Text style={styles.text}>
          Forgotten anything?{" "}
          <Text
            style={{ textDecorationLine: "underline" }}
            onPress={() => forgottenPassword()}
          >
            Click here.
          </Text>
        </Text>
        <SubmitButton title="Login" color={colors.green} />
      </AppForm>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.primary,
  },
  logo: {
    width: 350,
    height: 100,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  text: {
    textAlign: "center",
    color: colors.white,
  },
});

export default LoginScreen;
