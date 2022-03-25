import * as Notifications from "expo-notifications";
import listings from "./listings";

const scheduleNotification = async (title, body, date) => {
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
    },
    trigger: {
      date: date,
    },
  });

  listings.addReminder(identifier, title, body, date);
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
};
