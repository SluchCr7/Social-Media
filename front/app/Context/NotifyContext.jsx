'use client'
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "./AuthContext";

export const NotifyContext = createContext();

export const NotifyContextProvider = ({ children }) => {
  const [notificationsByUser, setNotificationsByUser] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const tokenHeader = {
    headers: { Authorization: `Bearer ${user?.token}` },
  };

  // ✅ إرسال إشعار
  const addNotify = async ({ content, type = 'custom', receiverId, actionRef, actionModel }) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/${receiverId}`,
        { content, type, actionRef, actionModel },
        tokenHeader
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ حذف إشعار
  const deleteNotify = async (id) => {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/${id}`, tokenHeader);
      toast.success(res.data.message);
      fetchUserNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ تعليم إشعار كمقروء
  const markAsRead = async (id) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/${id}/read`, {}, tokenHeader);
      fetchUserNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/read-all`, {}, tokenHeader);
  
      // تحديث فوري للعداد
      setUnreadCount(0);
  
      // تحديث الإشعارات لتصبح كلها isRead = true محلياً
      setNotificationsByUser(prev =>
        prev.map(n => ({
          ...n,
          isRead: true
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };
  

  // ✅ جلب إشعارات المستخدم
  const fetchUserNotifications = async () => {
    if (!user?.token || !user?._id) return;
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/user`, tokenHeader);
      setNotificationsByUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ جلب عدد الإشعارات غير المقروءة
  const fetchUnreadCount = async () => {
    if (!user?.token) return;
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/user/unread-count`, tokenHeader);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchUserNotifications();
      fetchUnreadCount();
    }
  }, [user]);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="custom-toast-container"
        toastClassName="custom-toast"
      />
      <NotifyContext.Provider
        value={{
          notificationsByUser,
          setNotificationsByUser,
          unreadCount,
          setUnreadCount,
          addNotify,
          deleteNotify,
          markAsRead,
          markAllAsRead,
          fetchUserNotifications,
        }}
      >
        {children}
      </NotifyContext.Provider>
    </>
  );
};

export const useNotify = () => {
  return useContext(NotifyContext);
};
