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
import ViewImage from './ViewImage'

const LayoutComponent = ({ children }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMessanger, setShowMessanger] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showNewSluchit, setShowNewSluchit] = useState(false)

  const { showPostModelEdit, setShowPostModelEdit, postIsEdit, setPostIsEdit, imageView, setImageView } = usePost()
  const { isLogin, isAuthChecked } = useAuth()
  const { showMenuReport, setShowMenuReport, isPostId } = useReport()
  const pathname = usePathname()

  const hideLayout = [
    '/Pages/Login',
    '/Pages/Register',
    '/Pages/Messanger',
    '/Pages/Forgot',
    '/Pages/ResetPassword',
    '/Pages/ResetPassword/[id]/[token]',
    '/Pages/UserVerify/[id]/verify/[token]',
  ].includes(pathname)

  if (!isAuthChecked) return null

  return (
    <div>
      <div className={`flex items-start gap-3 w-full ${hideLayout ? '' : 'py-5'}`}>
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
            hideLayout ? 'w-full' : isLogin ? 'w-full pl-[15%]' : 'w-[70%] mx-auto'
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
                setPostIsEdit(null)
                setShowPostModelEdit(false)
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
        </div>
      </div>
    </div>
  )
}

export default LayoutComponent
