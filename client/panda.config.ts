import {
  defineConfig,
  defineGlobalStyles,
  defineKeyframes,
} from "@pandacss/dev";

const globalCss = defineGlobalStyles({
  body: {
    lineHeight: "1.5",
    fontFamily: "Jua, sans-serif",
    fontWeight: 400,
    fontStyle: "normal",
  },
  "img, picture, video, canvas, svg": {
    display: "block",
    maxWidth: "100%",
  },
  "input, button, textarea, select": {
    font: "inherit",
  },
  "input, label": {
    display: "block",
  },
  "p, h1, h2, h3, h4, h5, h6": {
    overflowWrap: "break-word",
  },
  h1: {
    fontSize: 48,
  },
  p: {
    fontSize: 20,
  },
  "*": {
    margin: 0,
  },
  "*, *::before, *::after": {
    boxSizing: "border-box",
  },
  "*:focus": {
    outline: "none",
  },
});

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      keyframes: {
        scrollBackwards: {
          "0%": {
            transform: "translateX(-90%)",
          },
          "100%": {
            transform: "translateX(-0%)",
          },
        },
        scrollForward: {
          "0%": {
            transform: "translateX(0%)",
          },
          "100%": {
            transform: "translateX(-100%)",
          },
        },
      },
      tokens: {
        colors: {
          ["ww-green"]: { value: "#E0FFD2" },
          ["ww-yellow"]: { value: "#FDFFD2" },
          ["ww-blue"]: { value: "#829BF2" },
          ["ww-pink"]: { value: "#FFB4C2" },
          ["ww-red"]: { value: "#DA7297" },
          ["ww-primary-text"]: { value: "#000000" },
          ["ww-black"]: { value: "#000000" },
          ["ww-white"]: { value: "#FFFFFF" },
          ["ww-grey"]: { value: "#BFBFBF" },
        },
        radii: {
          ["br-12"]: { value: "12px" },
          ["br-25"]: { value: "25px" },
        },
        shadows: {
          ["ww-thicc"]: {
            value: {
              offsetX: 6,
              offsetY: 10,
              blur: 0,
              spread: 0,
              color: "#BFBFBF",
            },
          },
          ["ww-mid"]: {
            value: {
              offsetX: 4,
              offsetY: 8,
              blur: 0,
              spread: 0,
              color: "#BFBFBF",
            },
          },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
  globalCss,
});
