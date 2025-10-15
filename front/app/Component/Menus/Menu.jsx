import React, { useState } from 'react';
import MenuFollowers from './MenuFollowers';
import MenuMessagesFromMe from './MenuMessagesFromMe';
import { useAuth } from '../../Context/AuthContext';
import HashtagsMenu from './HashtagsMenu';
import Communities from './Communities';
import Link from 'next/link';
import News from './News';
import MenuAllNews from '../MenuAllNews';
import MenuFrinds from './MenuFrinds';
import MenuUpComingEvents from './MenuUpComingEvents';
import { useTranslation } from 'react-i18next';

const Menu = () => {
  const { user, isLogin } = useAuth();
  const {t} = useTranslation()
  const [showAllNews ,setShowAllNews] = useState(false)
  return (
    <div className="hidden lg:flex flex-col items-start gap-4 w-[35%] min-h-screen bg-lightMode-bg dark:bg-darkMode-bg px-6 py-8">
      {isLogin ? (
        <>
          <MenuUpComingEvents/>
          <HashtagsMenu />
          <News showAllNews={showAllNews} setShowAllNews={setShowAllNews} />
          <MenuMessagesFromMe />
          <Communities />
          {/* <MenuFollowers /> */}
          <MenuFrinds/>
          <MenuAllNews showAllNews={showAllNews} setShowAllNews={setShowAllNews} />
          <div className="mt-auto border-t pt-4 w-full border-gray-300 dark:border-gray-700">
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
              Sluchit v1.0.0 — © 2025 All rights reserved.<br />
              Built with passion for communities & real connections.
            </p>
            <div className="mt-3 flex justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
              <Link href="/Pages/Privacy" className="hover:underline">{t("Privacy Policy")}</Link>
              <span>•</span>
              <Link href="/Pages/Terms" className="hover:underline">{t("Terms of Service")}</Link>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
          <div className="bg-darkMode-menu p-8 rounded-2xl shadow-xl border border-darkMode-border">
            <h2 className="text-2xl font-semibold text-darkMode-text mb-3">Welcome to Sluchit</h2>
            <p className="text-darkMode-muted text-sm leading-relaxed">
              You`&apos;`re currently not logged in. Please sign in to explore your network,
              receive messages, follow hashtags, and connect with communities that matter to you.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
