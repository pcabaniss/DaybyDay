import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyDc-1slfARS2h3Xr6ExyyisYZqirL3wmiI",
  authDomain: "slate-e5529.firebaseapp.com",
  projectId: "slate-e5529",
  databaseUrl: "https://slate-e5529-default-rtdb.firebaseio.com/",
  storageBucket: "slate-e5529.appspot.com",
  messagingSenderId: "431024329793",
  appId: "1:431024329793:web:c91cdcaad645c70a5da2c0",
  measurementId: "G-E4TJ4XKTZW",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export { firebase };
