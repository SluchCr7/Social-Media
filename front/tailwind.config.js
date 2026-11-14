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

const defaultAccent = {
  50: "#f0f8f9",
  100: "#e1f0f3",
  200: "#bedfe4",
  300: "#8cc6d0",
  400: "#06b6d4",
  500: "#048298",
  600: "#047286",
  700: "#035e6d",
  800: "#024955",
  900: "#02343d",
  950: "#012228",
};

const userAccent = Object.fromEntries(
  Object.entries(defaultAccent).map(([shade, fallback]) => {
    const fallbackRgb = fallback
      .slice(1)
      .match(/.{2}/g)
      .map((channel) => Number.parseInt(channel, 16))
      .join(" ");
    return [
      shade,
      `rgb(var(--user-accent-${shade}, ${fallbackRgb}) / <alpha-value>)`,
    ];
  })
);

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
        indigo: userAccent,
        violet: userAccent,
        purple: userAccent,
        lightMode: {
          bg: "#ffffff",
          fg: "#000000",
          text: "rgb(var(--user-accent-600, 4 114 134) / <alpha-value>)",
          text2: "#374151",    // gray-700
          menu: "#f9fafb",      // gray-50
          textSoft: '#6b7280', // نص خفيف
          border: '#e5e7eb',
        },
        darkMode: {
          bg: "#000000",
          fg: "#ffffff",
          text: "rgb(var(--user-accent-400, 6 182 212) / <alpha-value>)",
          text2: "rgb(var(--user-accent-300, 140 198 208) / <alpha-value>)",
          menu: "#111827" ,     // gray-900
          textSoft: '#9ca3af',
          border: '#2e3a47',
        },
      },
    },
  },
  plugins: [],
};
