import client from "./client";
import { firebase } from "../auth/firebaseConfig";
import listings from "./listings";
//const register = (userInfo) => client.post("/users", userInfo);
const register = (userInfo) => (
  client.post("/users", userInfo),
  firebase.default
    .auth()
    .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
    .then((userCredential) => {
      userCredential.user.sendEmailVerification();

      firebase.default
        .database()
        .ref("users/" + userInfo.safeEmail.toLowerCase() + "/UserInfo")
        .set({
          name: userInfo.name,
          email: userInfo.email,
          isBusiness: userInfo.business,
          isVerfied: false,
        });

      listings.saveProfilePic(userInfo.email, userInfo.image);
    })
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
);

export default { register };
