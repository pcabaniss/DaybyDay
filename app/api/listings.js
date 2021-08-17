import client from "./client";

const endPoint = "/listings";

const getListings = () => client.get(endPoint);

const addListing = (listing, onUploadProgress) => {
  //content-type are specific lines to tell the server what data we are sending
  //for JSON its 'application/json'
  //for picture or video its 'multipart/form-data'
  const data = new FormData();
  data.append("title", listing.title);
  data.append("price", listing.price);
  data.append("categoryId", listing.category.value);
  data.append("description", listing.description);

  listing.images.forEach((image, index) =>
    data.append("images", {
      name: "image" + index,
      type: "image/jpeg",
      uri: image,
    })
  );

  if (listing.location)
    data.append("location", JSON.stringify(listing.location));

  return client.post(endPoint, data, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });
};

export default {
  getListings,
  addListing,
};
