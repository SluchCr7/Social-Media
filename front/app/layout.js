import localFont from "next/font/local";
import "./globals.css";
import Header from "./Component/Header";
import { JetBrains_Mono } from "next/font/google";
// import i18n from "./utils/i18n";
import LayoutComponent from "./Component/LayoutComponent";
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

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"]
  , weight: ["100", "200", "300", "400"]
  , style: ["normal", "italic"]
})

export const metadata = {
  title: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} - Home`,
  description: "Share your thoughts with the world and connect with others", 
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-lightMode-bg dark:bg-darkMode-bg transition-all duration-500  ${jetBrainsMono.className}`}
      >
        <AlertContextProvider>
          <AuthContextProvider>
            <NotifyContextProvider>
              <MessageContextProvider>
                <PostContextProvider>
                  <CommentContextProvider>
                    <CommunityContextProvider>
                      <StoryContextProvider>
                        <NewsContextProvider>
                          <ReportContextProvider>
                            <LayoutComponent>
                                {children}
                            </LayoutComponent>
                          </ReportContextProvider>
                        </NewsContextProvider>
                      </StoryContextProvider>
                    </CommunityContextProvider>
                  </CommentContextProvider>
                </PostContextProvider>
              </MessageContextProvider>
            </NotifyContextProvider>
          </AuthContextProvider>
        </AlertContextProvider>
      </body>
    </html>
  );
}
