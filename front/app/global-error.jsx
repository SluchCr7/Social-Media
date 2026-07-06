'use client';

import { useEffect } from 'react';
import { ErrorView } from './Component/ErrorBoundary';
import "./globals.css";
import { Cairo, JetBrains_Mono } from "next/font/google";

// Re-import fonts to match root layout styles as closely as possible
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400"],
  style: ["normal", "italic"],
  variable: "--font-english",
});

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-arabic",
});

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Next.js root layout global-error caught:', error);
  }, [error]);

  return (
    <html
      lang="en"
      className={`${jetBrainsMono.variable} ${cairo.variable}`}
    >
      <body
        className={`antialiased bg-lightMode-bg dark:bg-darkMode-bg min-h-screen flex items-center justify-center`}
      >
        <ErrorView error={error} resetErrorBoundary={reset} />
      </body>
    </html>
  );
}
