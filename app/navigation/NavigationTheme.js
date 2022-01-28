import { DefaultTheme, useTheme } from "@react-navigation/native";
import colors from "../config/colors";

export default {
  ...DefaultTheme,

  colors: {
    ...DefaultTheme.colors,
    primary: colors.dark,
    background: colors.white,
  },
};
