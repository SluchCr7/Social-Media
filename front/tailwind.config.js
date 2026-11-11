/** @type {import('tailwindcss').Config} */
const brandBlue = {
  50: "#eff5ff",
  100: "#dce9ff",
  200: "#bfd6ff",
  300: "#93baff",
  400: "#6094ff",
  500: "#3d74f5",
  600: "#2f5de8",
  700: "#284acb",
  800: "#293fa3",
  900: "#27387f",
  950: "#1a254f",
};

const brandViolet = {
  50: "#f1f1ff",
  100: "#e5e5ff",
  200: "#ceceff",
  300: "#aaaaff",
  400: "#8580ff",
  500: "#685bf5",
  600: "#5144e5",
  700: "#4336ca",
  800: "#382fa3",
  900: "#312c82",
  950: "#1e1b4b",
};

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
        brand: brandBlue,
        blue: brandBlue,
        indigo: brandViolet,
        violet: brandViolet,
        purple: brandViolet,
        lightMode: {
          bg: "#ffffff",
          fg: "#000000",
          text: "#5144e5",
          text2: "#374151",    // gray-700
          menu: "#f9fafb",      // gray-50
          textSoft: '#6b7280', // نص خفيف
          border: '#e5e7eb',
        },
        darkMode: {
          bg: "#000000",
          fg: "#ffffff",
          text: "#8580ff",
          text2: "#93baff",
          menu: "#111827" ,     // gray-900
          textSoft: '#9ca3af',
          border: '#2e3a47',
        },
      },
    },
  },
  plugins: [],
};
