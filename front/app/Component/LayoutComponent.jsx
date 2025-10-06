'use client';

import React, { useEffect, useState } from 'react';
import Aside from './Aside/Aside';
import Menu from './Menus/Menu';
import { usePathname } from 'next/navigation';
import { useAuth } from '../Context/AuthContext';
import Alert from './Alert';
import { usePost } from '../Context/PostContext';
import EditPostModal from './EditPostModel';
import { useReport } from '../Context/ReportContext';
import AddNewReport from './AddNewReport';
import ViewImage from './ViewImage';
import Loader from './Loader';
import { IoIosMusicalNotes } from "react-icons/io";
import MenuAllSuggestedFriends from './Menus/MenuAllSuggestedFreinds';
import { FiPlus } from 'react-icons/fi';
import Link from 'next/link';
import ReelUploadModal from './MenuUploadReel';
import { useMusicPlayer } from '../Context/MusicPlayerContext';
import SongPlayer from './MusicPage/SongPlayer';
import ExpandedWindow from './MusicPage/ExpandedWindow';
const LayoutComponent = ({ children }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessanger, setShowMessanger] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNewSluchit, setShowNewSluchit] = useState(false);
  const [loading, setLoading] = useState(true); // للتحكم في الـ Loader

  const {
    showPostModelEdit,
    setShowPostModelEdit,
    postIsEdit,
    setPostIsEdit,
    imageView,
    setImageView
  } = usePost();

  const { isLogin, isAuthChecked } = useAuth();
  const { showMenuReport, setShowMenuReport, isPostId, isTargetId, reportedOnType } = useReport();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false)
  const {expanded, setExpanded,viewMusicPlayer, setViewMusicPlayer} = useMusicPlayer()
  // الصفحات التي لا يظهر فيها Aside أو Menu
  const hideLayout = [
    '/Pages/Login',
    '/Pages/Register',
    '/Pages/Messanger',
    '/Pages/Forgot',
    '/Pages/Setting',
    '/Pages/Privacy',
    '/Pages/ResetPassword',
    '/Pages/Reels',
    '/Pages/Music',
    '/Pages/Privacy',
    '/Pages/Cookies',
    '/Pages/Analytics',
    '/Pages/ResetPassword/[id]/[token]',
    '/Pages/UserVerify/[id]/verify/[token]',
  ].includes(pathname);

  // تشغيل الـ Loader فقط في أول مرة يدخل فيها المستخدم الموقع
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (hasVisited) {
      setLoading(false);
    } else {
      sessionStorage.setItem("hasVisited", "true");
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000); // مدة التحميل
      return () => clearTimeout(timer);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-white dark:bg-black">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <div className={`flex items-start gap-3 w-full`}>
        {!hideLayout && isLogin && (
          <Aside
            isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}
          />
        )}

        <div
          className={`flex items-start transition-all duration-300 ${
            hideLayout
              ? `w-full `
              : isLogin
              ? `w-full ${isCollapsed ? 'md:ml-[85px]' : 'md:ml-[260px]'}`
              : 'w-[90%] md:w-[80%] mx-auto'
          }`}
        >
          <Alert />

          {children}

          {isLogin && !hideLayout && (
            <Menu
              showNotifications={showNotifications}
              setShowNotifications={setShowNotifications}
              showMessanger={showMessanger}
              setShowMessanger={setShowMessanger}
            />
          )}

          {showPostModelEdit && (
            <EditPostModal
              post={postIsEdit}
              onClose={() => {
                setPostIsEdit(null);
                setShowPostModelEdit(false);
              }}
            />
          )}

          {showMenuReport && (
            <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
              <AddNewReport
                targetId={isTargetId}               // ✅ الـ id
                reportedOnType={reportedOnType}     // ✅ النوع
                onClose={() => setShowMenuReport(false)}
              />
            </div>
          )}

          {imageView && (
            <ViewImage imageView={imageView} setImageView={setImageView} />
          )}
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3">
            <button
              className="bg-gradient-to-r from-purple-500 to-indigo-500 
                        text-white rounded-full w-14 h-14 flex items-center justify-center 
                        shadow-lg hover:scale-110 transition duration-300"
            >
              <Link href="/Pages/NewPost">
                <FiPlus className="text-2xl" />
              </Link>
            </button>
            <button onClick={() => setViewMusicPlayer(true)} className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:scale-110 transition duration-300">
              <IoIosMusicalNotes/>
            </button>
          </div>
          <MenuAllSuggestedFriends />
          <ReelUploadModal />
          {
            viewMusicPlayer && (
              <SongPlayer/>
            )
          }
          <ExpandedWindow/>
        </div>
      </div>
    </div>
  );
};

export default LayoutComponent;
