import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { date } from "yup/lib/locale";

function CalendarScreen(props) {
  const selectedDates = (day) => {};
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Calendar
          onDayPress={(day) => {
            console.log("selected day", day);
            selectedDates(day);
          }}
          hideDayNames={false}
          markedDates={date}
          onPressArrowLeft={(subtractMonth) => subtractMonth()}
          onPressArrowRight={(addMonth) => addMonth()}
          enableSwipeMonths={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default CalendarScreen;
