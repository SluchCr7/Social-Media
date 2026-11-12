import localFont from "next/font/local";
import "./globals.css";
import Header from "./Component/Header";
import LayoutComponent from "./Component/LayoutComponent";
import { JetBrains_Mono } from "next/font/google";
import { Cairo } from "next/font/google";
import Script from "next/script";

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

const appName = process.env.NEXT_PUBLIC_WEBSITE_NAME || "ThreadsV2";

export const metadata = {
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description: "Share your thoughts with the world and connect with others",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jetBrainsMono.variable} ${cairo.variable}`}
    >
      <head>
        <Script id="language-direction-bootstrap" strategy="beforeInteractive">
          {`(function(){try{var language=localStorage.getItem('language')||localStorage.getItem('i18nextLng')||navigator.language||'en';var code=language.toLowerCase().split('-')[0];if(code==='arabic')code='ar';if(code==='persian')code='fa';if(code==='urdu')code='ur';document.documentElement.lang=code;document.documentElement.dir=['ar','fa','he','ur'].includes(code)?'rtl':'ltr';}catch(_){}})();`}
        </Script>
      </head>
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
