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
    .ref(safeEmail + "/UserInfo")
    .get()
    .then((doc) => {
      return doc.child("name").val();
    });
  return name;
};

const pullImage = (email) => {
  const safeEmail = safetyFirst(email);
  const pic = currentUser()
    .ref(safeEmail + "/UserInfo")
    .get()
    .then((image) => {
      return image.child("profilePic").val();
    });
  return pic;
};

const pullProfileType = (email) => {
  const safeEmail = safetyFirst(email);
  const type = currentUser()
    .ref(safeEmail + "/UserInfo")
    .get()
    .then((profile) => {
      return profile.child("isBusiness").val();
    });
  return type;
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
};
