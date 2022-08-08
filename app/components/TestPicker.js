import React, { useState } from "react";
import { View, StyleSheet, Platform, Button, Text } from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import colors from "../config/colors";
import moment from "moment";

function TestPicker({ dateProp, onChange, isShowing, showPicker }) {
  const [date, setDate] = useState(new Date(dateProp));

  const timeFormatter = (recieved) => {
    const time = moment(recieved).format("LT");
    return time;
  };

  const onTap = (event, timeSelect) => {
    onChange("", timeSelect);
    setDate(timeSelect);
  };

  return (
    <>
      {!isShowing && (
        <View style={styles.btnCont}>
          <Button
            title={timeFormatter(date)}
            color={colors.medium}
            onPress={showPicker}
          />
        </View>
      )}
      {isShowing && (
        <DateTimePicker
          value={date}
          mode={"time"}
          minuteInterval={30}
          display={"default"}
          is24Hour={false}
          onChange={onTap}
          style={styles.picker}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  btnCont: {
    width: 110,
    height: 50,
  },
  // This only works on iOS
  picker: {
    width: 320,
    height: 260,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
});

export default TestPicker;
