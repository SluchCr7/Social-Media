/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // or 'media' if you want to use system preference
  theme: {
    extend: {
      colors: {
        lightMode: {
          bg: "#ffffff",    // Background: white
          fg: "#000000",    // Foreground elements: black
          text: "#8b4513",  // Primary text: warm dark tone inspired by #ffb703
          text2: "#a65e00", // Secondary text: slightly deeper tone of #ffba08
          menu: "#f0f0f0"   // Menu: very light gray for contrast with white bg
        },
        darkMode: {
          bg: "#000000",
          fg: "#ffffff",
          text: "#ffb703",
          text2: "#ffba08",
          menu : "#0a0a0a"
        },
      },
    },
  },
  plugins: [],
};
