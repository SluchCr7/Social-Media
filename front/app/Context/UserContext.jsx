// 'use client';
// import { createContext, useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';
// import { useAlert } from './AlertContext';
// import { useSocket } from './SocketContext';

// const UserContext = createContext();
// export const useUser = () => useContext(UserContext);

// export const UserContextProvider = ({ children }) => {
//     const { user, setUser, setUsers } = useAuth();
//     const [loading, setLoading] = useState(false);
//     const {showAlert} = useAlert()
//     const [suggestedUsers, setSuggestedUsers] = useState([]);
//     const [updateProfileLoading , setUpdateProfileLoading] = useState(false)
//     const { socket } = useSocket(); // ✅ نأخذ الـ socket من السياق
//     const [onlineUsers, setOnlineUsers] = useState([]); // ✅ حالة للمستخدمين الأونلاين

//     const followUser = async (id) => {
//       setLoading(true);
//       try {
//         const res = await axios.put(
//           `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/follow/${id}`,
//           {},
//           { headers: { Authorization: `Bearer ${user.token}` } }
//         );

//         const message = res.data.message;
//         const userId = res.data.userId;

//         showAlert(message);

//         // 🔄 تحديث المستخدم المستهدف في قائمة المستخدمين
//         setUsers((prev) =>
//           prev.map((u) =>
//             u._id === userId
//               ? {
//                   ...u,
//                   followers:
//                     message === "Followed successfully"
//                       ? [...u.followers, { _id: user._id }]
//                       : u.followers.filter((f) => f._id !== user._id),
//                 }
//               : u
//           )
//         );

//         // 🔄 تحديث قائمة following الخاصة بالمستخدم الحالي
//         const updatedUser =
//           message === "Followed successfully"
//             ? {
//                 ...user,
//                 following: [...user.following, { _id: userId }],
//               }
//             : {
//                 ...user,
//                 following: user.following.filter((f) => f._id !== userId),
//               };

//         setUser(updatedUser);
//         localStorage.setItem("user", JSON.stringify(updatedUser));
//       } catch (err) {
//         console.error(err);
//         showAlert("حدث خطأ أثناء العملية");
//       } finally {
//         setLoading(false);
//       }
//     };


//   const updatePhoto = async (photo) => {
//     const formData = new FormData();
//     formData.append('image', photo);

//     try {
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/photo`,
//         formData,
//         {
//           headers: {
//             authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       showAlert('Photo Updated Successfully');

//       const updatedUser = {
//         ...user,
//         profilePhoto: res.data?.profilePhoto || res.data,
//       };

//       localStorage.setItem('user', JSON.stringify(updatedUser));
//       setUser(updatedUser);
//     } catch (err) {
//       console.error(err);

//       const message =
//         err?.response?.data?.message ||
//         err?.message ||
//         'Failed to update profile photo. Please try again.';

//       showAlert(message);
//     }
//   };

//   const updateProfile = async (fields) => {
//     // ⚙️ تجهيز Payload نظيف يحتوي فقط على القيم التي تغيّرت فعلاً
//     const payload = {};

//     // قائمة الحقول النصية العادية
//     const normalFields = [
//       "username",
//       "profileName",
//       "description",
//       "country",
//       "city",
//       "phone",
//       "gender",
//       "preferedLanguage",
//       "relationshipStatus",
//     ];

//     for (const key of normalFields) {
//       const newValue = fields[key]?.trim?.() || fields[key];
//       if (newValue && newValue !== user[key]) {
//         payload[key] = newValue;
//       }
//     }

//     // 🎂 تاريخ الميلاد
//     if (fields.dateOfBirth && fields.dateOfBirth !== user.dateOfBirth) {
//       payload.dateOfBirth = fields.dateOfBirth;
//     }

//     // 💞 الشريك (partner)
//     if (fields.partner !== undefined && fields.partner !== user.partner) {
//       payload.partner = fields.partner || null;
//     }

//     // 🎯 الاهتمامات
//     if (
//       Array.isArray(fields.interests) &&
//       JSON.stringify(fields.interests) !== JSON.stringify(user.interests)
//     ) {
//       payload.interests = fields.interests;
//     }

//     // 🌐 الروابط الاجتماعية
//     if (fields.socialLinks) {
//       const socialPayload = {};
//       const socialKeys = ["github", "twitter", "linkedin", "facebook", "website"];

//       for (const key of socialKeys) {
//         const newVal = fields.socialLinks[key]?.trim?.() || "";
//         const oldVal = user.socialLinks?.[key] || "";
//         if (newVal && newVal !== oldVal) {
//           socialPayload[key] = newVal;
//         }
//       }

//       if (Object.keys(socialPayload).length > 0) {
//         payload.socialLinks = socialPayload;
//       }
//     }

//     // 🧾 لو مفيش أي تغييرات
//     if (Object.keys(payload).length === 0) {
//       showAlert("No changes detected to update.", "warning");
//       return;
//     }

//     setUpdateProfileLoading(true);
//     try {
//       const res = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/update`,
//         payload,
//         { headers: { authorization: `Bearer ${user.token}` } }
//       );

//       const newUserData = res.data.user || res.data;
//       const updatedUser = { ...user, ...newUserData, token: user.token };

//       localStorage.setItem("user", JSON.stringify(updatedUser));
//       setUser(updatedUser);

//       showAlert("Profile updated successfully.", "success");

//       // ✅ تحديث فوري بدون refresh ثقيل
//       // يمكنك إلغاء reload لو مش ضروري
//       setTimeout(() => {
//         window.location.reload();
//       }, 1500);
//     } catch (err) {
//       console.error("Update error:", err);
//       showAlert("Failed to update profile.", "error");
//     } finally {
//       setUpdateProfileLoading(false);
//     }
//   };
  
//   const updatePassword = async (password) => {
//     try {
//       const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/update/pass`, { password }, {
//         headers: { authorization: `Bearer ${user.token}` }
//       });
//       showAlert(res.data.message);
      
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const pinPost = async (id) => {
//     try {
//       const res = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/pin/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );

//       showAlert(res.data.message);
//     } catch (err) {
//       console.error(err);
//     }
//   };  


// const togglePrivateAccount = async () => {
//   if (!user?.token) return showAlert('You must be logged in');

//   try {
//     const res = await axios.put(
//       `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/account/private`,
//       {},
//       { headers: { Authorization: `Bearer ${user.token}` } }
//     );

//     // تحديث حالة الحساب المحليًا
//     setUser((prev) => ({ ...prev, isPrivate: !prev.isPrivate }));

//     showAlert(res.data.message);
//   } catch (err) {
//     console.error(err);
//     showAlert(err.response?.data?.message || 'Failed to update privacy');
//   }
// };


//   const getUserById = async (id) => {
//     try {
//       const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/${id}`);
//       return res.data; // بيرجع بيانات اليوزر
//     } catch (err) {
//       console.error("Error fetching user by ID:", err);
//       return null;
//     }
//   };

//   const saveMusicInPlayList = async (musicId) => {
//     try {
//       const res = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/save/music/${musicId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${user?.token}` },
//         }
//       );
//       showAlert(res.data.message || 'Music saved successfully');
//       return res.data;
//     } catch (err) {
//       console.error("Error saving music in playlist:", err);
//       return null;
//     }
//   };
//   const toggleBlockNotification = async (targetUserId) => {
//     if (!user?.token) return showAlert("You must be logged in");

//     try {
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/block/notify/${targetUserId}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         }
//       );

//       // ✅ تحديث بيانات المستخدم المحلي (blocked list)
//       const updatedUser = {
//         ...user,
//         BlockedNotificationFromUsers: res.data.blockedUsers || [],
//       };

//       setUser(updatedUser);
//       localStorage.setItem("user", JSON.stringify(updatedUser));

//       showAlert(res.data.message || "Notification preference updated");
//       return res.data;
//     } catch (err) {
//       console.error("Error toggling notification block:", err);
//       showAlert(
//         err?.response?.data?.message || "Failed to update notification block"
//       );
//     }
//   };
//   const toggleSaveReel = async (reelId) => {
//     try {
//       const res = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/save/reel/${reelId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${user?.token}` },
//         }
//       );
//       showAlert(res.data.message || 'Reel saved successfully');
//       return res.data;
//     } catch (err) {
//       console.error("Error saving music in playlist:", err);
//       return null;
//     }
//   };
//   // =====================================

//   useEffect(() => {
//     const getSuggestedUsers = async () => {
//       if (!user?.token) return;

//       try {
//         const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/suggested`, {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         });
//         setSuggestedUsers(res.data);
//       } catch (err) {
//         console.error("Error fetching suggested users:", err.response?.data || err.message);
//       }
//     };
//     getSuggestedUsers();
//   }, [user?.token]);


//   useEffect(() => {
//     if (!socket) return;

//     socket.on("getOnlineUsers", (users) => {
//       setOnlineUsers(users);
//       console.log("👥 Online users updated:", users);
//     });

//     // تنظيف عند الخروج
//     return () => socket.off("getOnlineUsers");
//   }, [socket]);


//   return (
//     <UserContext.Provider
//         value={{
//             suggestedUsers,
//             saveMusicInPlayList,
//             togglePrivateAccount,
//             updatePassword
//             ,getUserById,followUser,
//             updatePhoto,
//             updateProfile,
//             pinPost,toggleSaveReel,
//             onlineUsers,updateProfileLoading,loading,toggleBlockNotification
//         }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };
'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useAlert } from './AlertContext';
import { useSocket } from './SocketContext';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserContextProvider = ({ children }) => {
  const { user, setUser, setUsers } = useAuth();
  const { showAlert } = useAlert();
  const { socket } = useSocket();

  const [loading, setLoading] = useState(false);
  const [updateProfileLoading, setUpdateProfileLoading] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // ✅ متابعة المستخدم
  const followUser = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/follow/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const message = res.data.message;
      const userId = res.data.userId;
      showAlert(message);

      // تحديث قائمة المستخدمين
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? {
                ...u,
                followers:
                  message === 'Followed successfully'
                    ? [...u.followers, { _id: user._id }]
                    : u.followers.filter((f) => f._id !== user._id),
              }
            : u
        )
      );

      // تحديث بيانات المستخدم الحالي
      const updatedUser =
        message === 'Followed successfully'
          ? { ...user, following: [...user.following, { _id: userId }] }
          : { ...user, following: user.following.filter((f) => f._id !== userId) };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error(err);
      showAlert('حدث خطأ أثناء العملية');
    } finally {
      setLoading(false);
    }
  }, [user, showAlert, setUser, setUsers]);

  // ✅ تحديث الصورة
  const updatePhoto = useCallback(async (photo) => {
    const formData = new FormData();
    formData.append('image', photo);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/photo`,
        formData,
        {
          headers: {
            authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      showAlert('Photo Updated Successfully');

      const updatedUser = {
        ...user,
        profilePhoto: res.data?.profilePhoto || res.data,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      console.error(err);
      showAlert('Failed to update profile photo.');
    }
  }, [user, showAlert, setUser]);

  // ✅ تحديث الملف الشخصي
  const updateProfile = useCallback(async (fields) => {
    const payload = {};
    const normalFields = [
      'username', 'profileName', 'description', 'country',
      'city', 'phone', 'gender', 'preferedLanguage', 'relationshipStatus'
    ];

    for (const key of normalFields) {
      const newValue = fields[key]?.trim?.() || fields[key];
      if (newValue && newValue !== user[key]) payload[key] = newValue;
    }

    if (fields.dateOfBirth && fields.dateOfBirth !== user.dateOfBirth)
      payload.dateOfBirth = fields.dateOfBirth;

    if (fields.partner !== undefined && fields.partner !== user.partner)
      payload.partner = fields.partner || null;

    if (
      Array.isArray(fields.interests) &&
      JSON.stringify(fields.interests) !== JSON.stringify(user.interests)
    ) {
      payload.interests = fields.interests;
    }

    if (fields.socialLinks) {
      const socialPayload = {};
      const socialKeys = ['github', 'twitter', 'linkedin', 'facebook', 'website'];

      for (const key of socialKeys) {
        const newVal = fields.socialLinks[key]?.trim?.() || '';
        const oldVal = user.socialLinks?.[key] || '';
        if (newVal && newVal !== oldVal) socialPayload[key] = newVal;
      }

      if (Object.keys(socialPayload).length > 0)
        payload.socialLinks = socialPayload;
    }

    if (Object.keys(payload).length === 0)
      return showAlert('No changes detected to update.');

    setUpdateProfileLoading(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/update`,
        payload,
        { headers: { authorization: `Bearer ${user.token}` } }
      );

      const newUserData = res.data.user || res.data;
      const updatedUser = { ...user, ...newUserData, token: user.token };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      showAlert('Profile updated successfully.');

      // يمكن إلغاء reload لو التحديث فوري في الواجهة
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error(err);
      showAlert('Failed to update profile.');
    } finally {
      setUpdateProfileLoading(false);
    }
  }, [user, showAlert, setUser]);

  // ✅ تحديث كلمة المرور
  const updatePassword = useCallback(async (password) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/update/pass`,
        { password },
        { headers: { authorization: `Bearer ${user.token}` } }
      );
      showAlert(res.data.message);
    } catch (err) {
      console.error(err);
      showAlert('Failed to update password.');
    }
  }, [user, showAlert]);

  // ✅ تبديل الخصوصية
  const togglePrivateAccount = useCallback(async () => {
    if (!user?.token) return showAlert('You must be logged in');
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/account/private`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setUser((prev) => ({ ...prev, isPrivate: !prev.isPrivate }));
      showAlert(res.data.message);
    } catch (err) {
      console.error(err);
      showAlert('Failed to update privacy');
    }
  }, [user, showAlert, setUser]);

  // ✅ الحصول على مستخدم بالـ ID
  const getUserById = useCallback(async (id) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/${id}`);
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, []);

  // ✅ حفظ موسيقى في Playlist
  const saveMusicInPlayList = useCallback(async (musicId) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/save/music/${musicId}`,
        {},
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      showAlert(res.data.message || 'Music saved successfully');
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, [user, showAlert]);

  // ✅ تفعيل حظر الإشعارات
  const toggleBlockNotification = useCallback(async (targetUserId) => {
    if (!user?.token) return showAlert('You must be logged in');
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/block/notify/${targetUserId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const updatedUser = {
        ...user,
        BlockedNotificationFromUsers: res.data.blockedUsers || [],
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      showAlert(res.data.message || 'Notification preference updated');
      return res.data;
    } catch (err) {
      console.error(err);
      showAlert('Failed to update notification block');
    }
  }, [user, showAlert, setUser]);

  // ✅ حفظ الريل
  const toggleSaveReel = useCallback(async (reelId) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/save/reel/${reelId}`,
        {},
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      showAlert(res.data.message || 'Reel saved successfully');
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, [user, showAlert]);

  // ✅ pin post
  const pinPost = useCallback(async (id) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/pin/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      showAlert(res.data.message);
    } catch (err) {
      console.error(err);
    }
  }, [user, showAlert]);

  // ✅ جلب المستخدمين المقترحين
  useEffect(() => {
    const getSuggestedUsers = async () => {
      if (!user?.token) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/suggested`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setSuggestedUsers(res.data);
      } catch (err) {
        console.error('Error fetching suggested users:', err);
      }
    };
    getSuggestedUsers();
  }, [user?.token]);

  // ✅ مراقبة المستخدمين الأونلاين عبر socket
  useEffect(() => {
    if (!socket) return;
    socket.on('getOnlineUsers', setOnlineUsers);
    return () => socket.off('getOnlineUsers');
  }, [socket]);

  return (
    <UserContext.Provider
      value={{
        followUser,
        updatePhoto,
        updateProfile,
        updatePassword,
        togglePrivateAccount,
        getUserById,
        saveMusicInPlayList,
        toggleBlockNotification,
        toggleSaveReel,
        pinPost,
        suggestedUsers,
        onlineUsers,
        loading,
        updateProfileLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
