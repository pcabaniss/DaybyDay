import * as Notifications from "expo-notifications";
import listings from "./listings";

const scheduleNotification = async (title, body, date, isImmediate) => {
  if (isImmediate == false) {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: {
        date: date,
      },
    });
    listings.addReminder(identifier, title, body, date, isImmediate);
  } else {
    listings.addReminder("identifier", title, body, date, isImmediate);
  }
};

const deleteAllNotifications = () => {
  Notifications.cancelAllScheduledNotificationsAsync();
};

const loadAllNotifications = async (email) => {
  // Go through all notifications in DB and re-schedule them
  listings.getReminders(email);
};

const sendNotification = async (email, title, body, date, isImmediate) => {
  if (isImmediate == false) {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: {
        date: date,
      },
    });
    listings.sendReminder(email, identifier, title, body, date, isImmediate);
  } else {
    listings.sendReminder(email, "identifier", title, body, date, isImmediate);
  }
};

const sendImmediateNotification = async (title, body) => {
  //Send whenever request is sent to business and when business updates
  //status of that request + if accepted, schedule that notification

  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
    },
    trigger: {
      seconds: 5,
    },
  });
};

/*async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: title,
      body: body,
      data: { someData: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }*/

export default {
  scheduleNotification,
  deleteAllNotifications,
  loadAllNotifications,
  sendImmediateNotification,
  sendNotification,
};
