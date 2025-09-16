'use client';

import React, { useEffect, useState } from 'react';
import Aside from './Aside';
import Menu from './Menu';
import { usePathname } from 'next/navigation';
import { useAuth } from '../Context/AuthContext';
import Alert from './Alert';
import { usePost } from '../Context/PostContext';
import EditPostModal from './EditPostModel';
import { useReport } from '../Context/ReportContext';
import AddNewReport from './AddNewReport';
import ViewImage from './ViewImage';
import Loader from './Loader';
import MenuAllSuggestedFriends from './MenuAllSuggestedFreinds';

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
  const { showMenuReport, setShowMenuReport, isPostId } = useReport();
  const pathname = usePathname();

  // الصفحات التي لا يظهر فيها Aside أو Menu
  const hideLayout = [
    '/Pages/Login',
    '/Pages/Register',
    '/Pages/Messanger',
    '/Pages/Forgot',
    '/Pages/Setting',
    '/Pages/Privacy',
    '/Pages/ResetPassword',
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
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            showMessanger={showMessanger}
            setShowMessanger={setShowMessanger}
            showNewSluchit={showNewSluchit}
            setShowNewSluchit={setShowNewSluchit}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
          />
        )}

        <div
          className={`flex items-start transition-all duration-300 ${
            hideLayout
              ? 'w-full'
              : isLogin
              ? 'w-full '
              : 'w-[80%] mx-auto'
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
              <AddNewReport postId={isPostId} onClose={() => setShowMenuReport(false)} />
            </div>
          )}

          {imageView && (
            <ViewImage imageView={imageView} setImageView={setImageView} />
          )}
          <MenuAllSuggestedFriends/>
        </div>
      </div>
    </div>
  );
};

export default LayoutComponent;
