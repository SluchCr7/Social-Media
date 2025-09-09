// 'use client'
// import axios from "axios";
// import { createContext, useContext, useEffect, useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import { useAuth } from "./AuthContext";

// export const NotifyContext = createContext();

// export const NotifyContextProvider = ({ children }) => {
//   const [notificationsByUser, setNotificationsByUser] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const { user } = useAuth();

//   const tokenHeader = {
//     headers: { Authorization: `Bearer ${user?.token}` },
//   };

//   // ✅ إرسال إشعار
//   const addNotify = async ({ content, type = 'custom', receiverId, actionRef, actionModel }) => {
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/${receiverId}`,
//         { content, type, actionRef, actionModel },
//         tokenHeader
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ✅ حذف إشعار
//   const deleteNotify = async (id) => {
//     try {
//       const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/${id}`, tokenHeader);
//       toast.success(res.data.message);
//       fetchUserNotifications();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ✅ تعليم إشعار كمقروء
//   const markAsRead = async (id) => {
//     try {
//       await axios.patch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/${id}/read`, {}, tokenHeader);
//       fetchUserNotifications();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const markAllAsRead = async () => {
//     try {
//       await axios.patch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/read-all`, {}, tokenHeader);
  
//       // تحديث فوري للعداد
//       setUnreadCount(0);
  
//       // تحديث الإشعارات لتصبح كلها isRead = true محلياً
//       setNotificationsByUser(prev =>
//         prev.map(n => ({
//           ...n,
//           isRead: true
//         }))
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };
  

//   // ✅ جلب إشعارات المستخدم
//   const fetchUserNotifications = async () => {
//     if (!user?.token || !user?._id) return;
//     try {
//       const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/user`, tokenHeader);
//       setNotificationsByUser(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ✅ جلب عدد الإشعارات غير المقروءة
//   const fetchUnreadCount = async () => {
//     if (!user?.token) return;
//     try {
//       const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/user/unread-count`, tokenHeader);
//       setUnreadCount(res.data.unreadCount);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     if (user?.token) {
//       fetchUserNotifications();
//       fetchUnreadCount();
//     }
//   }, [user]);

//   return (
//     <>
//       <ToastContainer
//         position="top-center"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="dark"
//         className="custom-toast-container"
//         toastClassName="custom-toast"
//       />
//       <NotifyContext.Provider
//         value={{
//           notificationsByUser,
//           setNotificationsByUser,
//           unreadCount,
//           setUnreadCount,
//           addNotify,
//           deleteNotify,
//           markAsRead,
//           markAllAsRead,
//           fetchUserNotifications,
//         }}
//       >
//         {children}
//       </NotifyContext.Provider>
//     </>
//   );
// };

// export const useNotify = () => {
//   return useContext(NotifyContext);
// };
'use client';
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "./AuthContext";
import { useSocket } from "./SocketContext";

export const NotifyContext = createContext();

export const NotifyContextProvider = ({ children }) => {
  const [notificationsByUser, setNotificationsByUser] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { socket } = useSocket();

  const tokenHeader = {
    headers: { Authorization: `Bearer ${user?.token}` },
  };

  // ✅ إضافة إشعار (مع منع إشعار لنفس الشخص)
  const addNotify = async ({ content, type = 'custom', receiverId, actionRef, actionModel }) => {
    if (!receiverId || receiverId === user?._id) return;
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

  // ✅ حذف إشعار واحد
  const deleteNotify = async (id) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/${id}`,
        tokenHeader
      );
      toast.success(res.data.message);
      setNotificationsByUser(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ حذف كل الإشعارات
  const clearAllNotifications = async () => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/notification`,
        tokenHeader
      );
      toast.success(res.data.message);
      setNotificationsByUser([]);
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ تعليم إشعار كمقروء
  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/${id}/read`,
        {},
        tokenHeader
      );
      setNotificationsByUser(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(prev - 1, 0));
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ تعليم الكل كمقروء
  const markAllAsRead = async () => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/read-all`,
        {},
        tokenHeader
      );
      setUnreadCount(0);
      setNotificationsByUser(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ جلب إشعارات المستخدم
  const fetchUserNotifications = async () => {
    if (!user?.token || !user?._id) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/user`,
        tokenHeader
      );
      setNotificationsByUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ جلب عدد الإشعارات غير المقروءة
  const fetchUnreadCount = async () => {
    if (!user?.token) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/user/unread-count`,
        tokenHeader
      );
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ استقبال إشعارات لحظية من السيرفر عبر socket
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notify) => {
      setNotificationsByUser(prev => {
        if (prev.find(n => n._id === notify._id)) return prev; // منع التكرار
        return [notify, ...prev];
      });
      setUnreadCount(prev => prev + 1);
      toast.info(notify.content || "🔔 New notification");
    };

    socket.on("notification", handleNotification);
    return () => socket.off("notification", handleNotification);
  }, [socket]);

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
          clearAllNotifications,
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

export const useNotify = () => useContext(NotifyContext);
