/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lightMode: {
          bg: "#ffffff",
          fg: "#000000",
          text: "#1f2937",     // gray-800
          text2: "#374151",    // gray-700
          menu: "#f9fafb"      // gray-50
        },
        darkMode: {
          bg: "#000000",
          fg: "#ffffff",
          text: "#fbbf24",     // amber-400
          text2: "#facc15",    // yellow-400
          menu: "#111827"      // gray-900
        },
      },
    },
  },
  plugins: [],
};
