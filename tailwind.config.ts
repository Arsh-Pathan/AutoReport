import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Times New Roman", "Liberation Serif", "serif"],
      },
      colors: {
        ink: "#111827",
        paper: "#fafaf7",
      },
    },
  },
  plugins: [],
};
export default config;
