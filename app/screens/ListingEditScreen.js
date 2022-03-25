import React, { useState } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import * as Yup from "yup";

import {
  AppForm as Form,
  AppFormField as FormField,
  SubmitButton,
} from "../components/forms";

import DateTimePicker from "@react-native-community/datetimepicker";
import colors from "../config/colors";
import Screen from "../components/Screen";
import listingsApi from "../api/listings";
import UploadScreen from "./UploadScreen";
import moment from "moment";
import Notifications from "../api/Notifications";

//This screen needs to be a searchable database of businesses that are
// currently signed up in the app and go from there. Including the scheduling
//screen, looking at profiles, etc.

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  timeStart: Yup.string().nullable().label("StartTime"),
  timeFinish: Yup.string().nullable().label("FinishTime"),
  description: Yup.string().required().label("Description"),
});

function ListingEditScreen({ navigation, route }) {
  const { day } = route.params;
  const [dateStart, setStartDate] = useState(new Date());
  const [dateEnd, setEndDate] = useState(new Date());
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

  const timeFormatter = (date) => {
    let d = moment(date);

    console.log(d.format("hh:mm A"));
    return d.format("hh:mm A");
  };
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (listing, { resetForm }) => {
    Notifications.scheduleNotification(
      listing.title,
      listing.description,
      dateStart
    );
    setProgress(0);
    setUploadVisible(true);

    listing.timeStart = timeFormatter(dateStart);
    listing.timeFinish = timeFormatter(dateEnd);
    listing.dateClicked = day;
    const result = await listingsApi.addListing({ ...listing }, (progress) =>
      setProgress(progress)
    );

    if (result.ok) {
      setUploadVisible(false);
      console.log("Could not save listing. Error: " + result.originalError);
      return alert("Could not save listing.");
    }
    listingsApi.getDate(day);

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
      <Form
        initialValues={{
          title: "",
          timeStart: "",
          timeFinish: "",
          description: "",
          dateClicked: "",
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormField maxLength={255} name="title" placeholder="Title" />
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
        <FormField
          maxLength={255}
          multiline
          name="description"
          numberOfLines={3}
          placeholder="Description"
        />

        <SubmitButton title="Add" color={colors.greenCheck} />
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.black,
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
  picker: {
    width: "25%",
    backgroundColor: "white",
    borderColor: "black",
    borderRadius: 10,
    overflow: "hidden",
  },

  text: {
    fontWeight: "bold",
    color: colors.white,
  },
});
export default ListingEditScreen;
