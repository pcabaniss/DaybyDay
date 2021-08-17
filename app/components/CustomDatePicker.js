import React from "react";
import { View, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

function CustomDatePicker(props) {
  return (
    <View style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {},
  picker: {},
});

export default CustomDatePicker;
