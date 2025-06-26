import React from 'react';
import MenuFollowers from './MenuFollowers';
import MenuMessagesFromMe from './MenuMessagesFromMe';
import { useAuth } from '../Context/AuthContext';
import News from './News';
import HashtagsMenu from './HashtagsMenu';
import Adahn from './Adahn';
import Communities from './Communities';

const Menu = () => {
  const { user, isLogin } = useAuth();

  return (
    <div className="hidden lg:flex items-center flex-col gap-6 w-[40%] h-[100vh] bg-lightMode-bg dark:bg-darkMode-bg pl-4">
      {isLogin ? (
        <>
          {/* Uncomment if needed */}
          {/* <MenuFollowing /> */}
          <Adahn/>
          {/* <News/> */}
          <Communities/>
          <HashtagsMenu />
          <MenuMessagesFromMe />
          <MenuFollowers />
          <div className="border-t border-gray-500 p-3 w-full">
            <p className="text-sm text-gray-500">Version 1.0.0 . &copy; 2025 Sluchit . All rights reserved</p>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-center px-4">
          <div className="bg-darkMode-secondary p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-darkMode-text mb-2">You're not logged in</h2>
            <p className="text-darkMode-muted mb-4">Please log in to see your followers, messages, and more personalized content.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
