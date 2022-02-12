import client from "./client";
import { firebase } from "../auth/firebaseConfig";
import listings from "./listings";
//const register = (userInfo) => client.post("/users", userInfo);
const register = (userInfo) => (
  client.post("/users", userInfo),
  firebase.default
    .auth()
    .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == "auth/weak-password") {
        alert("The password is too weak.");
      } else {
        alert(errorMessage);
      }
      console.log(error);
    })
    .then(
      firebase.default
        .database()
        .ref("users/" + userInfo.safeEmail.toLowerCase() + "/UserInfo")
        .set({
          name: userInfo.name,
          email: userInfo.email,
          isBusiness: userInfo.business,
        })
    )
    .then(listings.saveProfilePic(userInfo.email, userInfo.image))
    .then(console.log("Registered " + userInfo))
);

export default { register };
