import localFont from "next/font/local";
import "./globals.css";
import Header from "./Component/Header";
import LayoutComponent from "./Component/LayoutComponent";
import { JetBrains_Mono } from "next/font/google";
import { Cairo } from "next/font/google";

import ReduxProvider from "./redux/ReduxProvider";
import I18nProvider from "./providers/I18nProvider.jsx";

// 🟢 استيراد الخط الإنجليزي
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400"],
  style: ["normal", "italic"],
  variable: "--font-english",
});

// 🟢 استيراد الخط العربي
const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-arabic",
});

export const metadata = {
  title: `${process.env.NEXT_PUBLIC_WEBSITE_NAME || 'Zociel'} - Home`,
  description: "Share your thoughts with the world and connect with others",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${jetBrainsMono.variable} ${cairo.variable}`}
    >
      <body
        className={`antialiased bg-lightMode-bg dark:bg-darkMode-bg transition-all duration-500`}
      >
        <I18nProvider>
          <ReduxProvider>
            <LayoutComponent>
              {children}
            </LayoutComponent>
          </ReduxProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
