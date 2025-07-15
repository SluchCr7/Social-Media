'use client'
import React, { useState } from 'react'
import Aside from './Aside'
import Menu from './Menu'
import { usePathname } from 'next/navigation'
import { useAuth } from '../Context/AuthContext'
import Alert from './Alert'
import { usePost } from '../Context/PostContext'
import EditPostModal from './EditPostModel'
import { useReport } from '../Context/ReportContext'
import AddNewReport from './AddNewReport'

const LayoutComponent = ({ children }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMessanger, setShowMessanger] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showNewSluchit, setShowNewSluchit] = useState(false)
  const {showPostModelEdit,setShowPostModelEdit , postIsEdit , setPostIsEdit} = usePost()
  const { isLogin, isAuthChecked } = useAuth()
  const pathname = usePathname()
  const {showMenu, setShowMenu , isPostId} = useReport()
  const hideLayout =
    pathname === '/Pages/Login' ||
    pathname === '/Pages/Register' ||
    pathname === '/Pages/Messanger'

  // ✅ لا تعرض المحتوى حتى يتم التأكد من حالة المستخدم
  if (!isAuthChecked) return null

  return (
    <div>
      <div className={`flex items-start gap-3 w-full ${hideLayout ? '' : 'py-5'}`}>
        {!hideLayout && (
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
        <div className={`w-full flex items-start ${hideLayout ? '' : 'pl-[15%]'}`}>
          <Alert/>
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
          {
            showMenu && (
              <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
                <AddNewReport postId={isPostId} onClose={() => setShowMenu(false)}/>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default LayoutComponent
