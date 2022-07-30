import * as Notifications from "expo-notifications";
import { firebase } from "../auth/firebaseConfig";

const scheduleNotification = async (title, body, date, isImmediate) => {
  const user = firebase.default.auth().currentUser.email;

  const semail = user.replace(".", "-");
  const safeEmail = semail.replace("@", "-");

  if (!isImmediate) {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: {
        //Will throw error on emulator.
        date: date,
        repeats: false,
      },
    });

    firebase.default
      .firestore()
      .collection(safeEmail)
      .doc("Reminders")
      .collection("Scheduled")
      .add({
        identifier: identifier,
        title: title,
        body: body,
        date: date,
        isImmediate: isImmediate,
      });
  } else {
    firebase.default
      .firestore()
      .collection(safeEmail)
      .doc("Reminders")
      .collection("Scheduled")
      .add({
        identifier: "identifier",
        title: title,
        body: body,
        date: date,
        isImmediate: isImmediate,
      });
  }
};

const checkBadges = async () => {
  const not = await Notifications.getBadgeCountAsync();

  return not;
};
const addBadge = (number) => {
  Notifications.setBadgeCountAsync(number);
};

const deleteAllNotifications = () => {
  Notifications.cancelAllScheduledNotificationsAsync();
};

const sendNotification = async (email, title, body, date, isImmediate) => {
  const semail = email.replace(".", "-");
  const safeEmail = semail.replace("@", "-");

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

    firebase.default
      .firestore()
      .collection(safeEmail)
      .doc("Reminders")
      .collection("Scheduled")
      .add({
        identifier: identifier,
        title: title,
        body: body,
        date: date,
        isImmediate: isImmediate,
      });
  } else {
    firebase.default
      .firestore()
      .collection(safeEmail)
      .doc("Reminders")
      .collection("Scheduled")
      .add({
        identifier: "identifier",
        title: title,
        body: body,
        date: date,
        isImmediate: isImmediate,
      });
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

const loadAllNotifications = async (email) => {
  // Go through all notifications in DB and re-schedule them
  const semail = email.replace(".", "-");
  const safeEmail = semail.replace("@", "-");

  await firebase.default
    .firestore()
    .collection(safeEmail)
    .doc("Reminders")
    .collection("Scheduled")
    .get()
    .then((reminder) => {
      reminder.forEach((item) => {
        const data = item.data();
        if (item.exists) {
          if (data.isImmediate == true) {
            sendImmediateNotification(data.title, data.body);
          } else {
            scheduleNotification(data.title, data.body, -data.date, false);
          }
        }
      });
    })
    .then(
      firebase.default
        .firestore()
        .collection(safeEmail)
        .doc("Reminders")
        .collection("Scheduled")
        .get()
        .then((reminder) => {
          reminder.forEach((item) => {
            const data = item.data();
            if (item.exists) {
              if (data.isImmediate == true)
                firebase.default
                  .firestore()
                  .collection(safeEmail)
                  .doc("Reminders")
                  .collection("Scheduled")
                  .doc(item.id)
                  .delete();
            }
          });
        })
    );
  const messageBadge = await getMessageBadges();
  const requestBadge = await getRequestBadges();

  addBadge(messageBadge + requestBadge);
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
  checkBadges,
  addBadge,
};
