import React, { useState } from "react";
import { StyleSheet, View, Text, Platform, Alert } from "react-native";
import moment from "moment";
import {} from "date-fns";
import * as Yup from "yup";

import {
  AppForm as Form,
  AppFormField as FormField,
  SubmitButton,
} from "../components/forms";

import AppButton from "../components/AppButton";
import Notifications from "../api/Notifications";

import DateTimePicker from "@react-native-community/datetimepicker";
import colors from "../config/colors";
import Screen from "../components/Screen";
import listingsApi from "../api/listings";
import UploadScreen from "./UploadScreen";
import listings from "../api/listings";

const timeFormatter = (date) => {
  console.log(date);
  let d = moment(date);
  return d.format("dddd MMMM D, YYYY");
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  timeStart: Yup.string().nullable().label("StartTime"),
  timeFinish: Yup.string().nullable().label("FinishTime"),
  description: Yup.string().required().label("Description"),
});

function AgendaDetailsScreen({ navigation, route }) {
  const { day, title, id, timeStart, timeEnd, description, isCustom } =
    route.params;

  const currentDate = timeFormatter(day);
  const [dateStart, setStartDate] = useState(timeStart);
  const [dateEnd, setEndDate] = useState(new Date(timeEnd));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  console.log(day);

  const onChangeStart = async (event, selectedDate) => {
    const startDate = selectedDate;
    setShow(Platform.OS === "ios");
    setStartDate(startDate);
    console.log("Changed date to: " + startDate);
  };

  const onChangeEnd = (event, selectedDate) => {
    const endDate = selectedDate;
    setShow(Platform.OS === "ios");
    setShow(Platform.OS === "android");
    setEndDate(endDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const alertBox = () => {
    Alert.alert("Cannot edit times from requests. ");
  };

  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const cancel = () => {
    listings.cancelAppointment(day, timeStart, description, isCustom);

    navigation.goBack();
  };

  const cancelPressed = () => {
    if (isCustom) {
      Alert.alert(
        "Are you sure you want to cancel?",
        "You cannot undo this action.",
        [
          { text: "No", style: "cancel" },
          {
            text: "Yes",
            onPress: () => {
              cancel();
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Are you sure you want to cancel?",
        "Once you cancel, we cannot guarantee you get this spot back.",
        [
          { text: "No", style: "cancel" },
          {
            text: "Yes",
            onPress: () => {
              cancel();
            },
          },
        ]
      );
    }
  };

  const handleUpdate = async (listing) => {
    Notifications.scheduleNotification(
      listing.title,
      listing.description,
      dateStart,
      false
    );

    setProgress(0);
    setUploadVisible(true);
    listing.timeStart = dateStart.toString();
    listing.timeFinish = dateEnd.toString();
    listing.dateClicked = day;
    listing.id = id;
    const result = await listingsApi.updateListing({ ...listing }, (progress) =>
      setProgress(progress)
    );

    if (result.ok) {
      setUploadVisible(false);
      console.log("Could not save listing. Error: " + result.originalError);
      return alert("Could not save listing.");
    }
    //listingsApi.getDate(day);

    navigation.navigate("Calendar");
    //resetForm();
  };

  return (
    <Screen style={styles.container}>
      <UploadScreen
        onDone={() => setUploadVisible(false)}
        progress={progress}
        visible={uploadVisible}
      />
      <View style={styles.header}>
        <Text style={styles.headerText}>{currentDate}</Text>
      </View>
      <Form
        initialValues={{
          title: title,
          timeStart: "",
          timeFinish: "",
          description: description,
          dateClicked: "",
        }}
        onSubmit={handleUpdate}
        validationSchema={validationSchema}
      >
        <FormField maxLength={255} name="title">
          {title}
        </FormField>

        {isCustom ? (
          <View style={styles.date}>
            <Text style={styles.text}>Start: </Text>
            <DateTimePicker
              name="timeStart"
              value={dateStart}
              mode={"time"}
              is24Hour={true}
              display="default"
              onChange={onChangeStart}
              style={styles.picker}
            />
            <Text style={styles.text}>Finish: </Text>
            <DateTimePicker
              name="timeFinish"
              value={dateEnd}
              mode={"time"}
              is24Hour={true}
              display="default"
              onChange={onChangeEnd}
              textColor={colors.black}
              style={styles.picker}
            />
          </View>
        ) : (
          //Need to add optionality to cancel request here.
          <View style={styles.date}>
            <Text style={styles.text}>Start: </Text>
            <Text onPress={alertBox} style={styles.notCustom}>
              {timeStart}
            </Text>
            <Text style={styles.text}>Finish: </Text>
            <Text onPress={alertBox} style={styles.notCustom}>
              {timeEnd}
            </Text>
          </View>
        )}
        <FormField
          maxLength={255}
          multiline
          name="description"
          numberOfLines={3}
          //placeholder={description}
        >
          {description}
        </FormField>

        <SubmitButton title="Update" />
        <AppButton
          title="Cancel Appointment"
          color={colors.danger}
          onPress={cancelPressed}
        />
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.blue,
  },
  date: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",

    padding: 10,
    width: "100%",
    height: 50,
  },
  header: {
    height: 30,
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderRadius: 10,
    alignSelf: "center",
  },
  headerText: {
    fontWeight: "600",
    fontStyle: "italic",
    fontSize: 16,
    color: colors.dark,
  },
  notCustom: {
    backgroundColor: colors.white,
    borderColor: colors.black,
    borderWidth: 3,
    borderRadius: 10,
    overflow: "hidden",
    width: "22%",
    textAlign: "center",
    height: 27,
    fontSize: 15,
  },
  picker: {
    width: "25%",
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 10,
    overflow: "hidden",
  },
  text: {
    fontWeight: "bold",
    color: colors.white,
  },
});

export default AgendaDetailsScreen;
