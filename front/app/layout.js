import localFont from "next/font/local";
import "./globals.css";
import Header from "./Component/Header";
import LayoutComponent from "./Component/LayoutComponent";
import { JetBrains_Mono } from "next/font/google";
import { Cairo } from "next/font/google";

import { AuthContextProvider } from "./Context/AuthContext";
import { PostContextProvider } from "./Context/PostContext";
import { CommentContextProvider } from "./Context/CommentContext";
import { MessageContextProvider } from "./Context/MessageContext";
import { NotifyContextProvider } from "./Context/NotifyContext";
import { NewsContextProvider } from "./Context/NewsContext";
import { CommunityContextProvider } from "./Context/CommunityContext";
import { StoryContextProvider } from "./Context/StoryContext";
import { AlertContextProvider } from "./Context/AlertContext";
import { ReportContextProvider } from "./Context/ReportContext";
import { SocketProvider } from "./Context/SocketContext";
import { EventProvider } from "./Context/EventContext";
import { AsideContextProvider } from "./Context/AsideContext";
import { ReelsProvider } from "./Context/ReelsContext";
import { MusicProvider } from "./Context/MusicContext";
import { TranslateContextProvider } from "./Context/TranslateContext";
import { ThemeContextProvider } from "./Context/ThemeContext";
import { MusicPlayerProvider } from "./Context/MusicPlayerContext";
import { UserContextProvider } from "./Context/UserContext";
import { UserAdminContextProvider } from "./Context/UserAdminContext";
import { VerifyContextProvider } from "./Context/VerifyContext";


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
  title: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} - Home`,
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
        <AlertContextProvider>
          <AuthContextProvider>
            <SocketProvider>
              <UserContextProvider>
                <VerifyContextProvider>
                  <UserAdminContextProvider>
                    <NotifyContextProvider>
                      <MessageContextProvider>
                        <PostContextProvider>
                          <CommentContextProvider>
                            <CommunityContextProvider>
                              <StoryContextProvider>
                                <NewsContextProvider>
                                  <ReportContextProvider>
                                    <ReelsProvider>
                                      <EventProvider>
                                        <MusicProvider>
                                          <MusicPlayerProvider>
                                            <ThemeContextProvider>
                                              <TranslateContextProvider>
                                                <AsideContextProvider>
                                                  <LayoutComponent>
                                                    {children}
                                                  </LayoutComponent>
                                                </AsideContextProvider>
                                              </TranslateContextProvider>
                                            </ThemeContextProvider>
                                          </MusicPlayerProvider>
                                        </MusicProvider>
                                      </EventProvider>
                                    </ReelsProvider>
                                  </ReportContextProvider>
                                </NewsContextProvider>
                              </StoryContextProvider>
                            </CommunityContextProvider>
                          </CommentContextProvider>
                        </PostContextProvider>
                      </MessageContextProvider>
                    </NotifyContextProvider>
                  </UserAdminContextProvider>
                </VerifyContextProvider>
              </UserContextProvider>
            </SocketProvider>
          </AuthContextProvider>
        </AlertContextProvider>
      </body>
    </html>
  );
}
