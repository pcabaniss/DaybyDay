import { useContext } from "react";
import jwtDecode from "jwt-decode";
import AuthContext from "./context";
import { firebase } from "../auth/firebaseConfig";
import authStorage from "./storage";

export default useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const logIn = (authToken) => {
    const user = jwtDecode(authToken);
    setUser(user);
    authStorage.setToken(authToken);
  };

  const logOut = () => {
    setUser(null);
    authStorage.removeToken();
    firebase.default.auth().signOut();
  };

  return { user, logOut, logIn };
};
