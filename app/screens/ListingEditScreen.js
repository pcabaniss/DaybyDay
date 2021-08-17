import React, { useState } from "react";
import { StyleSheet, Button, View, Text } from "react-native";
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
import FormImagePicker from "../components/forms/FormImagePicker";
import Screen from "../components/Screen";
import listingsApi from "../api/listings";
import useLocation from "../hooks/useLocation";
import UploadScreen from "./UploadScreen";

//This screen needs to be a searchable database of businesses that are
// currently signed up in the app and go from there. Including the scheduling
//screen, looking at profiles, etc.

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  price: Yup.number().required().min(1).max(10000).label("Price"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
  images: Yup.array().min(1, "Please select at least one image."),
});

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

function ListingEditScreen() {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
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

  const location = useLocation();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (listing, { resetForm }) => {
    setProgress(0);
    setUploadVisible(true);
    const result = await listingsApi.addListing(
      { ...listing, location },
      (progress) => setProgress(progress)
    );

    if (!result.ok) {
      setUploadVisible(false);
      return alert("Could not save listing.");
    }

    resetForm();
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
          price: "",
          description: "",
          category: null,
          images: [],
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormField maxLength={255} name="title" placeholder="Title" />
        <View style={styles.date}>
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={"time"}
            is24Hour={true}
            display="default"
            onChange={onChange}
            style={styles.picker}
          />
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={"time"}
            is24Hour={true}
            display="default"
            onChange={onChange}
            style={styles.picker}
          />
        </View>
        <Picker
          items={categories}
          name="category"
          numberOfColumns={3}
          placeholder="Category"
          PickerItemComponent={CategoryPickerItem}
          width="50%"
        />
        <FormField
          maxLength={255}
          multiline
          name="description"
          numberOfLines={3}
          placeholder="Description"
        />
        <SubmitButton title="Post" />
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.background,
  },
  date: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    padding: 10,
    width: "100%",
    height: 50,
  },
  picker: {
    width: "50%",
  },
});
export default ListingEditScreen;
