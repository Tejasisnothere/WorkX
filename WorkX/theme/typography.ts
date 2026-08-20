import {TextStyle} from "react-native";

type TypographyStyles = {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  body: TextStyle;
  bodySmall: TextStyle;
  caption: TextStyle;
  button: TextStyle;
};

export const typography: TypographyStyles = {
  h1: {
    fontSize: 32,
    fontWeight: "700",
  },

  h2: {
    fontSize: 24,
    fontWeight: "700",
  },

  h3: {
    fontSize: 20,
    fontWeight: "600",
  },

  body: {
    fontSize: 16,
    fontWeight: "400",
  },

  bodySmall: {
    fontSize: 14,
    fontWeight: "400",
  },

  caption: {
    fontSize: 12,
    fontWeight: "400",
  },

  button: {
    fontSize: 16,
    fontWeight: "600",
  },
};