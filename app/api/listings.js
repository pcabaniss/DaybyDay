import client from "./client";
import { firebase } from "../auth/firebaseConfig";
const endPoint = "/listings";

const getListings = () => client.get(endPoint);

const safetyFirst = (notSafeEmail) => {
  const email = notSafeEmail.replace(".", "-");
  const safeEmail = email.replace("@", "-");

  return safeEmail;
};

const getUser = () => {
  const user = firebase.default.auth().currentUser.email;
  const safeEmail = safetyFirst(user);
  return firebase.default.firestore().collection(safeEmail);
};

const currentUser = () => {
  return firebase.default.database();
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

const addListing = (listing, onUploadProgress, updateComplete) => {
  //content-type are specific lines to tell the server what data we are sending
  //for JSON its 'application/json'
  //for picture or video its 'multipart/form-data'
  const data = new FormData();
  data.append("title", listing.title);

  getUser()
    .doc(listing.dateClicked)
    .collection("listing")
    .add({
      title: listing.title,
      timeStart: listing.timeStart,
      timeFinish: listing.timeFinish,
      categoryID: listing.category.label,
      isRepeating: listing.repeating.label,
      description: listing.description,
      id: listing.dateClicked + listing.title,
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
              categoryID: listing.category.label,
              isRepeating: listing.repeating.label,
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

const getName = (email) => {
  const safeEmail = safetyFirst(email);

  const name = currentUser()
    .ref("users/" + safeEmail + "/UserInfo")
    .get()
    .then((doc) => {
      return doc.child("name").val();
    });
  return name;
};

const replaceImage = async (email, pic) => {
  const safeEmail = safetyFirst(email);
  await currentUser()
    .ref("users/" + safeEmail + "/UserInfo/")
    .update({ profilePic: pic })

    .then(console.log("Saved new photo!" + pic));
};

const pullImage = async (email) => {
  const safeEmail = safetyFirst(email);
  const pic = currentUser()
    .ref("users/" + safeEmail + "/UserInfo")
    .get()
    .then((image) => {
      return image.child("profilePic").val();
    });
  /*
  
    const pic = await firebase.default
      .storage()
      .ref(safeEmail + "/profilePicture")
      .getDownloadURL();
   
      */
  return pic;
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

const saveMessages = (message, otherUsers, createdAt, user) => {
  //console.log(message[0]);

  const otherSafeEmail = safetyFirst(otherUsers.email);

  //main sender of the message
  getUser()
    .doc("messages")
    .collection(otherUsers.email)
    .add({
      messages: {
        _id: user._id,
        createdAt: createdAt,
        text: message[0].text,
        user: {
          _id: "DXD" + otherUsers._id,
          email: otherUsers.email,
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
        .collection(user.email)
        .add({
          messages: {
            _id: user._id,
            createdAt: createdAt,
            text: message[0].text,
            user: {
              _id: "DXD" + otherUsers._id,
              email: otherUsers.email,
              name: otherUsers.name,
            },
          },
        })
    )
    .then(
      getUser()
        .doc("inbox")
        .set({
          email: {
            email: otherUsers.email,
            latestMessage: message[0].text,
          },
        })
    )
    .then(
      firebase.default
        .firestore()
        .collection(otherSafeEmail)
        .doc("inbox")
        .set({
          email: {
            email: user.email,
            latestMessage: message[0].text,
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
  var info = {};

  await getUser()
    .doc("inbox/")
    .get()
    .then((collection) => {
      const data = collection.data();
      info = data.email;
    });

  return info;
};

const getSearchResults = async (text = "null") => {
  var info = [];
  const names = await currentUser()
    .ref("users/")
    .get()
    .then((name) => {
      name.forEach((user) => {
        const email = user.child("UserInfo/email").val();
        const name = user.child("UserInfo/name").val();

        if (
          email.toLowerCase().includes(text.toLowerCase()) ||
          name.toLowerCase().includes(text.toLowerCase())
        ) {
          console.log(name);
          //should be true
          if (user.child("UserInfo/isBusiness").val() == true) {
            info.push({
              email: email,
              name: name,
              key: 0,
              pic: user.child("UserInfo/profilePic").val(),
            });
          }
        } else {
          info = undefined;
          return info;
        }
      });
    });
  return info;
};

const sendRequest = async (time, date, business, timeOfRequest) => {
  //console.log(time, date, business, timeRequested);
  const safeEmail = safetyFirst(business);
  //may have to come back and change this to be more fluid.
  const user = firebase.default.auth().currentUser.email;
  const userEmail = safetyFirst(user);
  console.log(user);
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
    });

  await getUser().doc("myRequests/").collection("list/").add({
    dateRequested: date,
    status: "pending",
    timeRequested: time,
    user: userEmail,
    timeOfRequest: timeOfRequest,
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
  console.log(info);
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
  console.log(info);
  return info;
};

export default {
  getListings,
  addListing,
  getDate,
  deleteListing,
  updateListing,
  pullImage,
  getName,
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
  getHours,
  getHoursFor,
  getSearchResults,
  sendRequest,
  getUserRequests,
  getBusRequests,
};
