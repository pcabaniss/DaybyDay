import React, { useState, useEffect, useRef } from "react";
import { AppState } from "react-native";
import PushNotificationIOS from "@react-native-community/push-notification-ios";

// apn badge context to access badge number
export const APNBadgeContext = React.createContext({
  badge: 0,
  setBadge: () => {},
});
export const useApnBadge = () => React.useContext(APNBadgeContext);

export const APNBadgeProvider = (props) => {
  const [badge, _setBadge] = useState(0);
  const badgeRef = useRef(badge);

  const setBadge = (val) => {
    badgeRef.current = val;
    PushNotificationIOS.setApplicationIconBadgeNumber(val);
    _setBadge(val);
  };

  const handleBadge = (state) => {
    if (state === "active") {
      PushNotificationIOS.getApplicationIconBadgeNumber((num) => {
        setBadge(num);
      });
    }
  };

  useEffect(() => {
    PushNotificationIOS.getApplicationIconBadgeNumber((num) => {
      setBadge(num);
    });
    AppState.addEventListener("change", handleBadge);
    return () => {
      AppState.addEventListener("change", handleBadge).remove();

      //AppState.removeEventListener("change", handleBadge);
    };
  }, []);

  return (
    <APNBadgeContext.Provider
      value={{
        badge: badgeRef.current,
        setBadge: setBadge,
      }}
    >
      {props.children}
    </APNBadgeContext.Provider>
  );
};
