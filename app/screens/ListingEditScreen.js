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
import listings from "../api/listings";
import UploadScreen from "./UploadScreen";
import moment from "moment";
import Notifications from "../api/Notifications";
import TestPicker from "../components/TestPicker";

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
  const [show, setShow] = useState(false);

  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const [isShowingStart, setIsShowingStart] = useState(false);
  const [isShowingEnd, setIsShowingEnd] = useState(false);

  const showPickerStart = () => {
    setIsShowingStart(true);
  };

  const showPickerEnd = () => {
    setIsShowingEnd(true);
  };

  const onChangeStart = async (event, selectedDate) => {
    setShow(Platform.OS === "ios");
    setIsShowingStart(false);
    setStartDate(selectedDate);
  };

  const onChangeEnd = (event, selectedDate) => {
    setShow(Platform.OS === "ios");
    setIsShowingEnd(false);
    setEndDate(selectedDate);
  };

  const handleSubmit = async (listing, { resetForm }) => {
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
    const result = listings.addListing({ ...listing }, "Custom");

    if (!result) {
      setUploadVisible(false);
      //console.log("Could not save listing. Error: " + result.originalError);
      return alert("Could not save listing.");
    } else {
      setUploadVisible(false);
    }

    listings.getDate(day);

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
          {Platform.OS == "android" ? (
            <>
              <Text style={styles.text}>Start: </Text>
              <TestPicker
                dateProp={dateStart}
                isShowing={isShowingStart}
                onChange={onChangeStart}
                showPicker={showPickerStart}
              />
              <Text style={styles.text}>Finish: </Text>
              <TestPicker
                dateProp={dateEnd}
                isShowing={isShowingEnd}
                onChange={onChangeEnd}
                showPicker={showPickerEnd}
              />
            </>
          ) : (
            <>
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
            </>
          )}
        </View>
        <FormField
          maxLength={255}
          multiline
          name="description"
          numberOfLines={3}
          placeholder="Description"
        />

        <SubmitButton title="Add" color={colors.green} />
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.primary,
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
