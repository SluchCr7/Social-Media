import localFont from "next/font/local";
import "./globals.css";
import Header from "./Component/Header";
import { JetBrains_Mono } from "next/font/google";
import LayoutComponent from "./Component/LayoutComponent";
import { AuthContextProvider } from "./Context/AuthContext";
import { PostContextProvider } from "./Context/PostContext";
import { CommentContextProvider } from "./Context/CommentContext";
import { ReplyContextProvider } from "./Context/ReplyContext";
import { MessageContextProvider } from "./Context/MessageContext";
import { NotifyContextProvider } from "./Context/NotifyContext";
import { ReplyReplyContextProvider } from "./Context/ReplyReplyContext";
import { NewsContextProvider } from "./Context/NewsContext";
import { CommunityContextProvider } from "./Context/CommunityContext";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"]
  , weight: ["100", "200", "300", "400"]
  , style: ["normal", "italic"]
})

export const metadata = {
  title: "Slucht - Home",
  description: "Share your thoughts with the world and connect with others", 
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-lightMode-bg dark:bg-darkMode-bg transition-all duration-500  ${jetBrainsMono.className}`}
      >
        <AuthContextProvider>
          <NotifyContextProvider>
            <MessageContextProvider>
              <PostContextProvider>
                <CommentContextProvider>
                  <ReplyContextProvider>
                    <ReplyReplyContextProvider>
                      <CommunityContextProvider>
                        <NewsContextProvider>
                          <LayoutComponent>
                            {children}
                          </LayoutComponent>
                        </NewsContextProvider>
                      </CommunityContextProvider>
                    </ReplyReplyContextProvider>
                  </ReplyContextProvider>
                </CommentContextProvider>
              </PostContextProvider>
            </MessageContextProvider>
          </NotifyContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
