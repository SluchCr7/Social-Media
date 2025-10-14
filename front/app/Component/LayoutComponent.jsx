'use client';
import React, { useEffect, useState } from 'react';
import Aside from './Aside/Aside';
import Menu from './Menus/Menu';
import { usePathname } from 'next/navigation';
import { useAuth } from '../Context/AuthContext';
import Alert from './Alert';
import { usePost } from '../Context/PostContext';
import EditPostModal from './AddandUpdateMenus/EditPostModel';
import { useReport } from '../Context/ReportContext';
import AddNewReport from './AddandUpdateMenus/AddNewReport';
import ViewImage from './ViewImage';
import Loader from './Loader';
import MenuAllSuggestedFriends from './Menus/MenuAllSuggestedFreinds';
import Link from 'next/link';
import ReelUploadModal from './AddandUpdateMenus/MenuUploadReel';
import { useMusicPlayer } from '../Context/MusicPlayerContext';
import SongPlayer from './MusicPage/SongPlayer';
import ExpandedWindow from './MusicPage/ExpandedWindow';
const LayoutComponent = ({ children }) => {
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
  const {viewMusicPlayer, setViewMusicPlayer} = useMusicPlayer()
  // الصفحات التي لا يظهر فيها Aside أو Menu
  const hideLayout = [
    '/Admin',
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
