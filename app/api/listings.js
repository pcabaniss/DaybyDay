import client from "./client";
import { firebase } from "../auth/firebaseConfig";
const endPoint = "/listings";

const getListings = () => client.get(endPoint);

const addListing = (listing, onUploadProgress) => {
  //content-type are specific lines to tell the server what data we are sending
  //for JSON its 'application/json'
  //for picture or video its 'multipart/form-data'
  const data = new FormData();
  data.append("title", listing.title);
  firebase
    .database()
    .ref("/user")
    .set({
      data: {
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
};
