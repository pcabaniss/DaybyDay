import client from "./client";
import firebase from "firebase";

const login = (email, password) => client.post("/auth", { email, password });

export default {
  login,
};
