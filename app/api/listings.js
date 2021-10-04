import client from "./client";
import { firebase } from "../auth/firebaseConfig";
const endPoint = "/listings";

const getListings = () => client.get(endPoint);

const getDate = async (date) => {
  const user = firebase.default.auth().currentUser.email;
  const email = user.replace(".", "-");
  const safeEmail = email.replace("@", "-");
  const arrayz = [];

  const doc = await firebase.default
    .firestore()
    .collection(safeEmail)
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
  const user = firebase.default.auth().currentUser.email;

  const email = user.replace(".", "-");
  console.log(user);
  const safeEmail = email.replace("@", "-");
  console.log(safeEmail);
  const arrayz = [];
  firebase.default
    .firestore()
    .collection(safeEmail)
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
  const user = firebase.default.auth().currentUser.email;

  const email = user.replace(".", "-");
  console.log(user);
  const safeEmail = email.replace("@", "-");
  console.log(safeEmail);
  //content-type are specific lines to tell the server what data we are sending
  //for JSON its 'application/json'
  //for picture or video its 'multipart/form-data'
  const data = new FormData();
  data.append("title", listing.title);

  firebase.default
    .firestore()
    .collection(safeEmail)
    .doc(listing.dateClicked)
    .collection("listing")
    .add({
      title: listing.title,
      timeStart: listing.timeStart,
      timeFinish: listing.timeFinish,
      categoryID: listing.category.label,
      isRepeating: listing.repeating.label,
      description: listing.description,
    });

  return client.post(endPoint, data, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });
};

export default {
  getListings,
  addListing,
  getDate,
  deleteListing,
};
