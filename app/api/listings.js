import client from "./client";
import { firebase } from "../auth/firebaseConfig";
import moment from "moment";
import Notifications from "./Notifications";
import { Linking } from "react-native";
import qs from "qs";

import { Alert } from "react-native";

const endPoint = "/listings";

const getListings = () => client.get(endPoint);

const safetyFirst = (notSafeEmail) => {
  const email = notSafeEmail.replace(".", "-");
  const safeEmail = email.replace("@", "-");

  return safeEmail;
};

const calculateHours = (open, interval, ampm) => {
  if (interval > 45 || interval == undefined) {
    const another = moment(open).add(interval, "minutes");

    return another.toString();
  } else {
    const another = moment(open).add(30, "minutes");
    //console.log(another.utcOffset(480).toString());

    return another.toString();
  }
};

const getUser = () => {
  const user = firebase.default.auth().currentUser.email;
  const safeEmail = safetyFirst(user);
  return firebase.default.firestore().collection(safeEmail);
};

const currentUser = () => {
  return firebase.default.database();
};

const returnEmail = () => {
  return firebase.default.auth().currentUser.email;
};

const saveAbout = (text) => {
  getUser().doc("About").set({
    aboutText: text,
  });
};

const getAbout = async () => {
  var info = {};

  await getUser()
    .doc("About")
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();

        info = data.aboutText;
      } else {
        info = null;
      }
    });
  return info;
};

const getAboutFor = async (email) => {
  const safeEmail = safetyFirst(email);
  var info = {};
  await firebase.default
    .firestore()
    .collection(safeEmail)
    .doc("About")
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();

        info = data.aboutText;
      } else {
        info = null;
      }
    });
  return info;
};

const saveSchedule = (day, open, close, isOpen, letter, interval, slots) => {
  getUser().doc("Schedule").collection(day).doc("info").set({
    open: open,
    close: close,
    isOpen: isOpen,
    letter: letter,
    interval: interval,
    slots: slots,
  });
};

const getSchedule = async (day) => {
  var info = {};

  await getUser()
    .doc("Schedule")
    .collection(day)
    .doc("info")
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        info = data;
        return data;
      } else {
        info = null;
      }
    });

  return info;
};

const getDate = async (date) => {
  const arrayz = [];

  const doc = await getUser()
    .doc(date)
    .collection("listing")
    .get()
    .then((doc) => {
      doc.forEach((snapshot) => {
        if (snapshot.exists) {
          arrayz.push(snapshot.data());
        }
      });
    });

  return arrayz;
};

const deleteListing = (listing) => {
  getUser()
    .doc(listing.date)
    .collection("listing")
    .get()
    .then((doc) => {
      doc.forEach((snapshot) => {
        if (snapshot.data().title == listing.name) {
          firebase.default
            .firestore()
            .collection(safeEmail)
            .doc(listing.date)
            .collection("listing")
            .doc(snapshot.id)
            .delete();
        } else {
          return;
        }
      });
    });
};

const addListing = (listing, business, onUploadProgress) => {
  //content-type are specific lines to tell the server what data we are sending
  //for JSON its 'application/json'
  //for picture or video its 'multipart/form-data'

  const startingTime = moment(listing.timeStart).format("hh:mm A");
  const data = new FormData();
  data.append("title", listing.title);

  getUser()
    .doc(listing.dateClicked)
    .collection("listing")
    .doc(business + "_" + startingTime)
    .set({
      title: listing.title,
      timeStart: listing.timeStart,
      timeFinish: listing.timeFinish,
      description: listing.description,
      id: listing.dateClicked + listing.title,
      business: business,
    });

  return client.post(endPoint, data, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });
};

const updateListing = (listing, onUploadProgress) => {
  const data = new FormData();
  data.append("title", listing.title);

  getUser()
    .doc(listing.dateClicked)
    .collection("listing")
    .get()
    .then((doc) => {
      doc.forEach((snapshot) => {
        if (snapshot.data().id == listing.id) {
          getUser()
            .doc(listing.dateClicked)
            .collection("listing")
            .doc(snapshot.id)
            .update({
              title: listing.title,
              timeStart: listing.timeStart,
              timeFinish: listing.timeFinish,
              description: listing.description,
            });
        } else {
          return;
        }
      });
    });
  return client.post(endPoint, data, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });
};

const getMyName = async () => {
  const myEmail = returnEmail();
  const safeEmail = safetyFirst(myEmail);

  const name = await currentUser()
    .ref("users/" + safeEmail + "/UserInfo")
    .get()
    .then((doc) => {
      return doc.child("name").val();
    });

  return name;
};

const replaceImage = async (email, filePath) => {
  const response = await fetch(filePath);
  const blob = await response.blob();
  var ref = firebase
    .storage()
    .ref()
    .child(email + "/images/profilePic/");
  ref.put(blob);
};

const pushProfilePic = (email, pic) => {
  const safeEmail = safetyFirst(email);
  firebase.default
    .database()
    .ref()
    .child("users/" + safeEmail + "/profilePicture")
    .set({ profilePicture: pic });
};

const saveProfilePic = async (email, filePath) => {
  const response = await fetch(filePath);
  const blob = await response.blob();
  var ref = firebase.default
    .storage()
    .ref()
    .child(email + "/images/profilePic/");
  ref.put(blob).then(async () => {
    const pic = await getProfilePic(email);
    pushProfilePic(email, pic);
  });
};

const getProfilePic = async (email) => {
  return await firebase.default
    .storage()
    .ref()
    .child(email + "/images/profilePic")
    .getDownloadURL();
};

const saveImages = async (email, jpg, filePath) => {
  const safeEmail = safetyFirst(email);

  firebase.default
    .firestore()
    .collection(safeEmail)
    .doc("images")
    .collection("gallery")
    .add({
      imageName: jpg,
    })
    .then(console.log("Saved image!"));

  const response = await fetch(filePath);
  const blob = await response.blob();
  var ref = firebase
    .storage()
    .ref()
    .child(email + "/images/gallery/" + jpg);
  ref.put(blob);
};

const getDaysOff = async (business) => {
  const safeEmail = safetyFirst(business);

  const dotw = [
    { day: "Sunday", letter: "S", number: 0 },
    { day: "Monday", letter: "M", number: 1 },
    { day: "Tuesday", letter: "T", number: 2 },
    { day: "Wednesday", letter: "W", number: 3 },
    { day: "Thursday", letter: "Th", number: 4 },
    { day: "Friday", letter: "F", number: 5 },
    { day: "Saturday", letter: "Sa", number: 6 },
  ];

  var daysOff = [];

  await firebase.default
    .firestore()
    .collection(safeEmail)
    .doc("Schedule")
    .get()
    .then((ss) => {
      dotw.map((day) => {
        ss.ref
          .collection(day.day)
          .get()
          //misc == info in db
          .then((misc) => {
            if (misc.empty) {
              //Getting days off
              daysOff.push(day.day);
            } else {
              misc.forEach((bow) => {
                if (bow.exists) {
                  //For getting the days of operation
                }
              });
            }
          });
      });
    });

  return daysOff;
};

const getImages = async (email) => {
  const safeEmail = safetyFirst(email);
  var gallery = [];
  await firebase.default
    .firestore()
    .collection(safeEmail)
    .doc("images")
    .collection("gallery")
    .get()
    .then((image) => {
      image.forEach(async (url) => {
        if (url.exists) {
          const data = url.data();
          const fbPic = await firebase.default
            .storage()
            .ref(email + "/images/gallery/" + data.imageName)
            .getDownloadURL();

          gallery.push({
            downloadURL: fbPic,
            imageURL: data.imageName,
          });
        }
      });
    });

  return gallery;
};

const deleteImage = (imageURL) => {
  const email = returnEmail();

  firebase.default
    .storage()
    .ref()
    .child(email + "/images/gallery/" + imageURL)
    .delete();

  getUser()
    .doc("images")
    .collection("gallery")
    .get()
    .then((image) => {
      image.forEach(async (url) => {
        if (url.exists) {
          const image = url.data().imageName;
          if (imageURL == image) {
            getUser()
              .doc("images")
              .collection("gallery")
              .doc(url.id)
              .delete()
              .then(console.log("Deleted image!"));
          }
        }
      });
    });
};

const pullProfileType = (email) => {
  const safeEmail = safetyFirst(email);
  const user = safeEmail.charAt(0).toUpperCase() + safeEmail.slice(1);

  var info = {};
  const type = currentUser()
    .ref("users/" + safeEmail + "/UserInfo")
    .get()
    .then((profile) => {
      return profile.child("isBusiness").val();
    });
  return type;
};

/**
 * 
 * Array [
  Object {
    "_id": "f463f2c2-5d57-4452-abcf-0c0e1157fb06",
    "createdAt": 2021-11-17T06:48:59.634Z,
    "text": "Fdsafsdf",
    "user": Object {
      "_id": 1,
      "email": "ip@gmail.com",
      "name": "Image picker",
    },
  },
]
 */

const saveMessages = (message, otherUsers, createdAt, sender) => {
  const otherSafeEmail = safetyFirst(otherUsers._id);

  //main sender of the message
  getUser()
    .doc("messages")
    .collection(otherUsers._id)
    .add({
      messages: {
        _id: sender._id,
        avatar: sender.avatar,
        createdAt: createdAt,
        key: Math.round(Math.random() * 1000000),
        text: message[0].text,
        user: {
          _id: otherUsers._id,
          avatar: sender.avatar,
          name: otherUsers.name,
        },
      },
    })
    //This is for the recipients DB
    .then(
      firebase.default
        .firestore()
        .collection(otherSafeEmail)
        .doc("messages")
        .collection(sender._id)
        .add({
          messages: {
            _id: sender._id,
            avatar: sender.avatar,
            key: Math.round(Math.random() * 1000000),
            createdAt: createdAt,
            text: message[0].text,
            user: {
              _id: otherUsers._id,
              avatar: sender.avatar,
              name: otherUsers.name,
            },
          },
        })
    )
    .then(
      getUser()
        .doc("inbox")
        .collection("recents")
        .doc(otherUsers._id)
        .set({
          business: {
            email: otherUsers._id,
            latestMessage: message[0].text,
            avatar: otherUsers.avatar,
            name: otherUsers.name,
            unread: false,
          },
        })
    )
    .then(
      firebase.default
        .firestore()
        .collection(otherSafeEmail)
        .doc("inbox")
        .collection("recents")
        .doc(firebase.default.auth().currentUser.email)
        .set({
          business: {
            email: sender._id,
            latestMessage: message[0].text,
            avatar: sender.avatar,
            name: sender.name,
            unread: true,
          },
        })
    );
};

const getMessages = async (otherEmail) => {
  var info = [];

  await getUser()
    .doc("messages")
    .collection(otherEmail)
    .get()
    .then((collection) => {
      collection.forEach((item) => {
        const data = item.data();
        info.push(data.messages);
        info.sort((a, b) => b.createdAt - a.createdAt);
      });
    });

  return info;
};

const deleteMessage = (message) => {
  /**Message object example: 
   * 
  "avatar": *Profile picture Download link*
  "email": *email to be deleted*
  "latestMessage": *Latest message*
   */
  const deletion = async (deletedEmail) => {
    //Delete from mains inbox
    getUser().doc("inbox").collection("recents").doc(deletedEmail).delete();

    //Making ref for db of messages.
    const mesRef = getUser().doc("messages").collection(deletedEmail);

    mesRef.get().then((querySnapshot) => {
      Promise.all(querySnapshot.docs.map((d) => d.ref.delete()));
    });
  };

  getUser()
    .doc("inbox")
    .collection("recents")
    .get()
    .then((email) => {
      email.forEach((item) => {
        if (item.exists) {
          const data = item.data();
          if (data.business.email == message.email) {
            deletion(message.email).then(
              console.log("Successfully deleted message threads.")
            );
          }
        }
      });
    });
};

const getHours = async (dayOf) => {
  var info = {};

  await getUser()
    .doc("Schedule")
    .collection(dayOf)
    .doc("info")
    .get()
    .then((collection) => {
      if (collection.exists) {
        const data = collection.data();
        var slots = data.slots;
        if (data.slots == undefined) {
          slots = 1;
        }

        if (collection.exists) {
          info = {
            open: data.open,
            close: data.close,
            interval: data.interval,
            slots: slots,
          };
          return info;
        }
      }
      info = null;
      return info;
    });
  return info;
};

const getHoursFor = async (dayOf, email) => {
  const safeEmail = safetyFirst(email);
  var info = {};

  await firebase.default
    .firestore()
    .collection(safeEmail)
    .doc("Schedule")
    .collection(dayOf)
    .doc("info")
    .get()
    .then((collection) => {
      if (collection.exists) {
        const data = collection.data();
        var slots = data.slots;
        if (data.slots == undefined) {
          slots = 1;
        }

        info = {
          open: data.open,
          close: data.close,
          interval: data.interval,
          slots: slots,
        };
        return info;
      }
      info = null;
      return info;
    });
  return info;
};

const getInbox = async () => {
  const blockedList = [];

  await getUser()
    .doc("privacy")
    .collection("blockedList")
    .get()
    .then((item) => {
      item.forEach((name) => {
        if (name.exists) {
          const data = name.data();
          blockedList.push(data.businessEmail);
        }
      });
    });

  var info = [];
  var count = 0;
  await getUser()
    .doc("inbox")
    .collection("recents")
    .get()
    .then((email) => {
      email.forEach((item) => {
        if (item.exists) {
          const data = item.data();
          info.push(data.business);
        }
      });
    });

  blockedList.forEach((blocked) => {
    info.forEach((business) => {
      if (business.email == blocked.toLowerCase()) {
        info.splice(count, 1);
      }
    });
    count = count + 1;
  });
  if (info.length == 0) {
    return undefined;
  }
  return info;
};

const getSearchResults = async (text = "null") => {
  var info = [];
  var count = 0;

  const blockedList = await getBlockedList();

  await currentUser()
    .ref()
    .child("users/")
    .get()
    .then((name) => {
      name.forEach((user) => {
        const email = user.child("UserInfo/email").val();
        const name = user.child("UserInfo/name").val();
        const pic = user.child("profilePicture/profilePicture").val();
        if (
          email.toLowerCase().includes(text.toLowerCase()) ||
          name.toLowerCase().includes(text.toLowerCase())
        ) {
          //should be true
          if (user.child("UserInfo/isBusiness").val() == true) {
            info.push({
              email: email,
              name: name,
              key: 0,
              pic: pic,
            });
          }
        }
      });
    });

  info.forEach((item) => {
    blockedList.forEach((business) => {
      if (item.email == business.toLowerCase()) {
        info.splice(count, 1);
      }
    });
    count = count + 1;
  });
  return info;
};

const sendRequest = async (
  time,
  date,
  business,
  timeOfRequest,
  duration,
  picture
) => {
  //console.log(time, date, business, timeRequested);
  const safeEmail = safetyFirst(business);
  //may have to come back and change this to be more fluid.
  const user = firebase.default.auth().currentUser.email;
  const userEmail = safetyFirst(user);
  const userPic = await getProfilePic(user);

  await firebase.default
    .firestore()
    .collection(safeEmail)
    .doc("requests/")
    .collection("list/")
    .add({
      dateRequested: date,
      timeRequested: time,
      request: "pending",
      user: user,
      timeOfRequest: timeOfRequest,
      duration: duration,
      picture: userPic,
    });

  await getUser().doc("myRequests/").collection("list/").add({
    dateRequested: date,
    status: "pending",
    timeRequested: time,
    user: userEmail,
    timeOfRequest: timeOfRequest,
    business: business,
    duration: duration,
    picture: picture,
  });

  await getUser().doc(date).collection("/requests").add({
    business: business,
  });
};

const getUserRequests = async () => {
  var info = [];

  await getUser()
    .doc("myRequests/")
    .collection("list/")
    .get()
    .then((item) => {
      item.forEach((obby) => {
        if (obby.exists) {
          info.push(obby.data());
        } else {
          info = undefined;
        }
        return info;
      });
    });
  return info;
};

const getBusRequests = async () => {
  var info = [];

  await getUser()
    .doc("requests/")
    .collection("list/")
    .get()
    .then((item) => {
      item.forEach((obby) => {
        if (obby.exists) {
          info.push(obby.data());
        } else {
          info = undefined;
        }
        return info;
      });
    });

  return info;
};

const getPendingRequests = async (business, day, time) => {
  var count = 0;
  const safeBusEmail = safetyFirst(business);

  await firebase.default
    .firestore()
    .collection(safeBusEmail)
    .doc("requests/")
    .collection("list/")
    .get()
    .then((request) => {
      request.forEach((doc) => {
        const data = doc.data();
        if (
          data.request == "pending" &&
          data.timeRequested == time &&
          data.dateRequested == day
        ) {
          count += 1;
        }
      });
    });
  return count;
};

const getAcceptedRequests = async (business, day, time) => {
  var count = 0;
  const safeBusEmail = safetyFirst(business);

  await firebase.default
    .firestore()
    .collection(safeBusEmail)
    .doc("requests/")
    .collection("list/")
    .get()
    .then((request) => {
      request.forEach((doc) => {
        const data = doc.data();
        if (
          data.request == "accepted" &&
          data.timeRequested == time &&
          data.dateRequested == day
        ) {
          count += 1;
        }
      });
    });
  return count;
};

const getNumberOfRequest = async (day, business) => {
  var count = 0;
  await getUser()
    .doc(day)
    .collection("requests")
    .get()
    .then((request) => {
      count = request.size;
    });
  return count;
};

const updateRequest = async (text, response, request) => {
  const businessName = firebase.default.auth().currentUser.email;
  const userSafeEmail = safetyFirst(request.user);

  const profilePic = await getProfilePic(businessName);

  await getUser()
    .doc("requests/")
    .collection("list/")
    .get()
    .then((item) => {
      item.forEach((obby) => {
        if (obby.exists) {
          const data = obby.data();
          if (data.timeOfRequest == request.timeOfRequest) {
            getUser()
              .doc("requests/")
              .collection("list/")
              .doc(obby.id)
              .update({
                dateRequested: data.dateRequested,
                request: response,
                timeRequested: data.timeRequested,
                user: data.user,
                timeOfRequest: data.timeOfRequest,
                duration: data.duration,
              })
              .catch((error) => {
                console.log("Error saving listing to business: " + error);
              });
          }
        }
      });
    });

  await firebase.default
    .firestore()
    .collection(userSafeEmail)
    .doc("myRequests/")
    .collection("list/")
    .get()
    .then((item) => {
      item.forEach((obby) => {
        if (obby.exists) {
          const data = obby.data();
          if (data.timeOfRequest == request.timeOfRequest) {
            firebase.default
              .firestore()
              .collection(userSafeEmail)
              .doc("myRequests/")
              .collection("list/")
              .doc(obby.id)
              .update({
                dateRequested: data.dateRequested,
                status: response,
                timeRequested: data.timeRequested,
                user: data.user,
                timeOfRequest: data.timeOfRequest,
                business: businessName,
                duration: data.duration,
              })
              .catch((error) => {
                console.log("Error saving listing to user: " + error);
              });
          }
        }
      });
    });

  if (response == "accepted") {
    const sender = {
      _id: businessName,
      name: "No name",
      email: businessName,
      avatar: profilePic,
    };

    //Will send otherUser credentials when I pull from database
    const reciever = {
      _id: request.user,
      name: "no name",
      email: request.user,
      avatar: request.picture,
    };
    const message = {
      _id: businessName,
      text: text,
      createdAt: new Date(),
      user: {
        _id: request.user,
        name: "no name yet",
        avatar: request.picture,
      },
    };
    if (text != " ") {
      saveMessages([message], reciever, new Date().valueOf(), sender);
    }
    const [time, ampm] = request.timeRequested.split(" ");

    const listing = {
      title: "Scheduled appointment.",
      timeStart: "Tue Dec 21 2021 " + time + ":22 GMT-0600",
      timeFinish: calculateHours(
        "Tue Dec 21 2021 " + time + ":22 GMT-0600 (CDT)",
        request.duration,
        ampm
      ),
      description: "An accepted scheduling request with " + request.user,
      id: request.user + request.timeRequested,
      dateClicked: request.dateRequested,
    };
    addListing(listing, request.user);

    firebase.default
      .firestore()
      .collection(userSafeEmail)
      .doc(listing.dateClicked)
      .collection("listing")
      .doc(businessName + "_" + request.timeRequested.toUpperCase())
      .set({
        title: "Scheduled appointment.",
        timeStart: "Tue Dec 21 2021 " + time + ":22 GMT-0600",
        timeFinish: calculateHours(
          "Tue Dec 21 2021 " + time + ":22 GMT-0600 (CDT)",
          request.duration,
          ampm
        ),
        description: "An accepted scheduling request with " + businessName,
        id: request.user + request.timeRequested,
        dateClicked: request.dateRequested,
      });

    Notifications.sendNotification(
      request.user,
      "Request accepted!",
      "Congratulations! Your appointment was accepted and scheduled.",
      Date(),
      true
    );
  }
  if (response == "denied") {
    Notifications.sendNotification(
      request.user,
      "Request denied.",
      "Unfortunately, your request was denied. Request a different time or contact the business.",
      Date(),
      true
    );
  }
};

const saveRating = (business, rating, review) => {
  const safeBus = safetyFirst(business);
  const user = firebase.default.auth().currentUser.email;
  currentUser()
    .ref()
    .child("reviews/" + safeBus)
    .push({
      rating: rating,
      review: review,
      user: user,
    });
};

const getRatings = async (business) => {
  var train = [];
  const user = firebase.default.auth().currentUser.email;
  const safeBus = safetyFirst(business);
  await currentUser()
    .ref()
    .child("reviews/" + safeBus)
    .get()
    .then((review) => {
      review.forEach((item) => {
        if (item.exists()) {
          train.push(item.val());
        }
      });
    });
  return train;
};

//Make it to where on startup and log out all notifications are deleted on device and then
//when logging back in you will re-set all the notifications in your DB.

const addReminder = (identifier, title, body, date, isImmediate) => {
  getUser().doc("Reminders").collection("Scheduled").add({
    identifier: identifier,
    title: title,
    body: body,
    date: date,
    isImmediate: isImmediate,
  });
};

const sendReminder = (business, identifier, title, body, date, isImmediate) => {
  const safeEmail = safetyFirst(business);

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
};

const getReminders = async (email) => {
  const safeEmail = safetyFirst(email);
  var temp = [];
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
            Notifications.sendImmediateNotification(data.title, data.body);
          } else {
            Notifications.scheduleNotification(
              data.title,
              data.body,
              -data.date,
              false
            );
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
  var count = 0;
  const messageBadge = await getMessageBadges();
  const requestBadge = await getRequestBadges();

  Notifications.addBadge(messageBadge + requestBadge);
};

const reportBusiness = async (businessEmail, reason, email) => {
  let url = `mailto:${email}`;

  //Replace email with business email once created.
  const user = firebase.default.auth().currentUser.email;

  const query = qs.stringify({
    subject: "DAY X DAY ALERT: Reported business",
    body:
      "User " +
      user +
      " has reported " +
      businessEmail +
      " for the following reason: " +
      "ENTER REASON(S) HERE." +
      " Please respond immediately.",
    cc: "cc",
    bcc: "bcc",
  });

  if (query.length) {
    url += `?${query}`;
  }

  // check if we can use this link
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    throw new Error("Provided URL can not be handled");
  }

  return Linking.openURL(url);
};

const blockBusiness = (business) => {
  const safeBus = safetyFirst(business);
  firebase.default
    .firestore()
    .collection(safeBus.toLowerCase())
    .doc("privacy")
    .collection("blockedList")
    .add({
      businessEmail: business,
      blockedBy: firebase.default.auth().currentUser.email,
    });

  getUser()
    .doc("privacy")
    .collection("blockedList")
    .add({
      businessEmail: business,
    })
    .then(console.log("Successfully blocked!"));
};

const getBlockedList = async () => {
  var temp = [];

  await getUser()
    .doc("privacy")
    .collection("blockedList")
    .get()
    .then((item) => {
      item.forEach((name) => {
        if (name.exists) {
          const data = name.data();
          temp.push(data.businessEmail);
        }
      });
    });

  return temp;
};

const cancelAppointment = (day, startTime, description) => {
  /**
   * remove from both databases, will have to pull business name from user DB.
   * cancel any notifications with this date
   * send notification to business or user, whichever canceled.
   *
   */

  const [text, cancelee] = description.split("with ");

  const safeEmail = safetyFirst(cancelee);
  var canceler = firebase.default.auth().currentUser.email;

  getUser()
    .doc(day)
    .collection("listing")
    .doc(cancelee + "_" + startTime)
    .delete()
    .then(console.log("Deleted from canceler..."));

  firebase.default
    .firestore()
    .collection(safeEmail)
    .doc(day)
    .collection("listing")
    .doc(canceler + "_" + startTime)
    .delete()
    .then(console.log("Deleted from cancelee!"));

  Notifications.sendNotification(
    cancelee,
    "Appointment Canceled",
    "Unfortunatly, " +
      canceler +
      " has canceled your appointment with them at " +
      startTime +
      "on " +
      day,
    new Date(),
    true
  );
};

const getMessageBadges = async () => {
  var count = 0;

  await getUser()
    .doc("inbox")
    .collection("recents")
    .get()
    .then((messageThread) => {
      messageThread.forEach((item) => {
        if (item.exists) {
          const data = item.data();

          if (data.business.unread == true) {
            count++;
          }
        }
      });
    });

  return count;
};

const getRequestBadges = async () => {
  var count = 0;

  await getUser()
    .doc("requests")
    .collection("list")
    .get()
    .then((messageThread) => {
      messageThread.forEach((item) => {
        if (item.exists) {
          const data = item.data();

          if (data.request == "pending") {
            count++;
          }
        }
      });
    });

  return count;
};

const updateBadgeCount = () => {};

const updateUnread = (item) => {
  getUser()
    .doc("inbox")
    .collection("recents")
    .doc(item.email)
    .set({
      business: {
        avatar: item.avatar,
        email: item.email,
        latestMessage: item.latestMessage,
        name: item.name,
        unread: false,
      },
    });
};

const changePassword = async (oldPW, newPW, onPress) => {
  const myEmail = firebase.default.auth().currentUser.email;

  const emailCred = firebase.default.auth.EmailAuthProvider.credential(
    myEmail,
    oldPW
  );

  await firebase.default
    .auth()
    .currentUser.reauthenticateWithCredential(emailCred)
    .then(() => {
      console.log("Updated Password");
      //Send email to them letting them know

      firebase.default.auth().currentUser.updatePassword(newPW);

      return Alert.alert(
        "Success!",
        "Your password was successfully changed.",
        [{ text: "Sweet!", onPress: onPress }]
      );
    })
    .catch((error) => {
      console.log("Error: " + error);
      return Alert.alert(
        "Something went wrong.",
        "Usually this happens due to a wrong password or a network issue. Please try again.",
        [{ text: "OK", style: "cancel" }]
      );
    });

  return;
};

const currentblockedList = async () => {
  var info = [];
  var count = 0;

  const blockedList = await getBlockedList();

  if (blockedList.length != 0) {
    await currentUser()
      .ref()
      .child("users/")
      .get()
      .then((name) => {
        name.forEach((user) => {
          const email = user.child("UserInfo/email").val();
          const name = user.child("UserInfo/name").val();
          const pic = user.child("profilePicture/profilePicture").val();

          //should be true

          info.push({
            email: email,
            name: name,
            key: 0,
            pic: pic,
          });
        });
      });
    info.forEach((item) => {
      blockedList.forEach((business) => {
        if (item.email != business.toLowerCase()) {
          info.splice(count, 1);
        }
      });
      count = count + 1;
    });
  } else {
    info == undefined;
  }

  return info;
};

const unblock = (blockedName) => {
  const safeBus = safetyFirst(blockedName);
  firebase.default
    .firestore()
    .collection(safeBus.toLowerCase())
    .doc("privacy")
    .collection("blockedList")
    .get()
    .then((item) => {
      item.forEach((doc) => {
        const data = doc.data();

        if (data.businessEmail.toLowerCase() == blockedName) {
          firebase.default
            .firestore()
            .collection(safeBus.toLowerCase())
            .doc("privacy")
            .collection("blockedList")
            .doc(doc.id)
            .delete();
        }
      });
    });

  getUser()
    .doc("privacy")
    .collection("blockedList")
    .get()
    .then((item) => {
      item.forEach((doc) => {
        const data = doc.data();

        if (data.businessEmail.toLowerCase() == blockedName) {
          getUser()
            .doc("privacy")
            .collection("blockedList")
            .doc(doc.id)
            .delete();
        }
      });
    });
};

export default {
  getListings,
  addListing,
  returnEmail,
  getDate,
  deleteListing,
  updateListing,
  saveImages,
  getDaysOff,
  getImages,
  saveProfilePic,
  getProfilePic,
  getMyName,
  pullProfileType,
  saveSchedule,
  getSchedule,
  getAbout,
  getAboutFor,
  replaceImage,
  saveAbout,
  saveMessages,
  getMessages,
  getInbox,
  deleteMessage,
  getHours,
  getHoursFor,
  getSearchResults,
  sendRequest,
  getNumberOfRequest,
  getUserRequests,
  getBusRequests,
  getPendingRequests,
  getAcceptedRequests,
  updateRequest,
  saveRating,
  getRatings,
  addReminder,
  getReminders,
  sendReminder,
  reportBusiness,
  blockBusiness,
  getBlockedList,
  cancelAppointment,
  deleteImage,
  getMessageBadges,
  getRequestBadges,
  updateUnread,
  changePassword,
  currentblockedList,
  unblock,
};
