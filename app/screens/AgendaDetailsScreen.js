import React, { useState } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import moment from "moment";
import {} from "date-fns";
import * as Yup from "yup";

import {
  AppForm as Form,
  AppFormField as FormField,
  AppFormPicker as Picker,
  SubmitButton,
} from "../components/forms";

import DateTimePicker from "@react-native-community/datetimepicker";
import CategoryPickerItem from "../components/CategoryPickerItem";
import colors from "../config/colors";
import Screen from "../components/Screen";
import listingsApi from "../api/listings";
import UploadScreen from "./UploadScreen";

const timeFormatter = (date) => {
  let d = moment(date).utcOffset(date);
  return d.format("dddd MMMM D, YYYY");
};

const categories = [
  {
    label: "Furniture",
    value: 1,
    backgroundColor: "#fc5c65",
    icon: "floor-lamp",
  },
  {
    label: "Clothing",
    value: 2,
    backgroundColor: colors.primary,
    icon: "tshirt-v",
  },
  {
    label: "Camera",
    value: 3,
    backgroundColor: colors.secondary,
    icon: "camera",
  },
  {
    label: "Pets",
    value: 4,
    backgroundColor: "#7C77B9",
    icon: "dog",
  },
  {
    label: "Devices",
    value: 5,
    backgroundColor: "#8FBFE0",
    icon: "cellphone",
  },
  {
    label: "Health",
    value: 6,
    backgroundColor: "#14FFF7",
    icon: "weight-lifter",
  },
];

const isRepeating = [
  {
    label: "Never",
    value: 0,
  },
  { label: "Daily", value: 1 },
  {
    label: "Every other day",
    value: 2,
  },
  {
    label: "Weekly",
    value: 3,
  },
  {
    label: "Biweekly",
    value: 4,
  },
  {
    label: "Monthly",
    value: 5,
  },
  {
    label: "Yearly",
    value: 6,
  },
  {
    label: "Custom",
    value: 7,
  },
];

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  timeStart: Yup.string().nullable().label("StartTime"),
  timeFinish: Yup.string().nullable().label("FinishTime"),
  description: Yup.string().required().label("Description"),
  category: Yup.object().nullable().label("Category"),
  repeating: Yup.object().nullable().label("Repeating"),
});

function AgendaDetailsScreen({ navigation, route }) {
  const {
    day,
    title,
    id,
    timeStart,
    timeEnd,
    description,
    category,
    repeating,
  } = route.params;

  const currentDate = timeFormatter(day);
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

  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpdate = async (listing) => {
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
          title: "",
          timeStart: "",
          timeFinish: "",
          description: "",
          category: null,
          repeating: null,
          dateClicked: "",
        }}
        onSubmit={handleUpdate}
        validationSchema={validationSchema}
      >
        <FormField maxLength={255} name="title">
          {title}
        </FormField>

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
          //placeholder={description}
        >
          {description}
        </FormField>
        <View style={styles.twoPickers}>
          <Picker
            items={categories}
            name="category"
            numberOfColumns={3}
            placeholder={category}
            PickerItemComponent={CategoryPickerItem}
            width="48%"
          />
          <Picker
            items={isRepeating}
            name="repeating"
            numberOfColumns={1}
            placeholder={repeating}
            width="48%"
          />
        </View>
        <SubmitButton title="Update" />
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
  picker: {
    width: "23%",
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 10,
    overflow: "hidden",
  },
  twoPickers: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontWeight: "bold",
    color: colors.white,
  },
});

export default AgendaDetailsScreen;
