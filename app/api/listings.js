import client from "./client";
import { firebase } from "../auth/firebaseConfig";
const endPoint = "/listings";

const getListings = () => client.get(endPoint);

const getDate = async (date) => {
  const user = firebase.default.auth().currentUser.email;
  const email = user.replace(".", "-");
  const safeEmail = email.replace("@", "-");
  const doc = await firebase.default
    .firestore()
    .collection(safeEmail)
    .doc(date)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        const date = {
          title: data.listing.title,
          timeStart: data.listing.timeStart,
          timeFinish: data.listing.timeFinish,
          categoryID: data.listing.categoryID,
          isRepeating: data.listing.isRepeating,
          description: data.listing.description,
        };
        return date;
      } else {
        return null;
      }
    });
  return doc;
};

const addListing = (listing, onUploadProgress) => {
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
    .set({
      listing: {
        title: listing.title,
        timeStart: listing.timeStart,
        timeFinish: listing.timeFinish,
        categoryID: listing.category.label,
        isRepeating: listing.repeating.label,
        description: listing.description,
      },
    });
  //  if (listing.location)
  //    data.append("location", JSON.stringify(listing.location));

  return client.post(endPoint, data, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });
};

export default {
  getListings,
  addListing,
  getDate,
};
