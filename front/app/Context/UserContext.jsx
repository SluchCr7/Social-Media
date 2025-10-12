'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useAlert } from './AlertContext';
import { useSocket } from './SocketContext';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserContextProvider = ({ children }) => {
    const { user, setUser, setUsers } = useAuth();
    const [loading, setLoading] = useState(false);
    const {showAlert} = useAlert()
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [updateProfileLoading , setUpdateProfileLoading] = useState(false)
    const { socket } = useSocket(); // ✅ نأخذ الـ socket من السياق
    const [onlineUsers, setOnlineUsers] = useState([]); // ✅ حالة للمستخدمين الأونلاين

  const followUser = async (id) => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/follow/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      showAlert(res.data.message);

      setUsers((prev) =>
        prev.map((u) => {
          if (u._id === id) {
            return {
              ...u,
              followers:
                res.data.message === "Followed"
                  ? [...u.followers, { _id: user._id }]
                  : u.followers.filter((f) => f._id !== user._id),
            };
          }
          return u;
        })
      );

      // ✅ تحديث الـ user إذا كان هو نفس الشخص الذي فعل التغيير
      if (user._id === id) {
        const updatedUser = {
          ...user,
          followers:
            res.data.message === "Followed"
              ? [...user.followers, { _id: user._id }]
              : user.followers.filter((f) => f._id !== user._id),
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updatePhoto = async (photo) => {
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

      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update profile photo. Please try again.';

      showAlert(message);
    }
  };

  const updateProfile = async (fields) => {
    const payload = {
      username: fields.username ?? user.username,
      description: fields.description ?? user.description,
      profileName: fields.profileName ?? user.profileName,
      country: fields.country ?? user.country,
      city: fields.city ?? user.city,
      phone: fields.phone ?? user.phone,
      dateOfBirth: fields.dateOfBirth ?? user.dateOfBirth,
      gender: fields.gender ?? user.gender,
      interests: fields.interests ?? user.interests ?? [],
      relationshipStatus: fields.relationshipStatus ?? user.relationshipStatus,
      partner: fields.partner ?? user.partner ?? null,
      preferedLanguage: fields.preferedLanguage ?? user.preferedLanguage,
      socialLinks: {
        github: fields.socialLinks?.github ?? user.socialLinks?.github ?? '',
        twitter: fields.socialLinks?.twitter ?? user.socialLinks?.twitter ?? '',
        linkedin: fields.socialLinks?.linkedin ?? user.socialLinks?.linkedin ?? '',
        facebook: fields.socialLinks?.facebook ?? user.socialLinks?.facebook ?? '',
        website: fields.socialLinks?.website ?? user.socialLinks?.website ?? '',
      }
    };
    setUpdateProfileLoading(true)
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/update`,
        payload,
        { headers: { authorization: `Bearer ${user.token}` } }
      );

      const newUserData = res.data.user || res.data;

      const updatedUser = {
        ...user,
        ...newUserData,
        token: user.token,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      showAlert('Profile Updated Successfully.');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdateProfileLoading(false)
    }
  };


  const updatePassword = async (password) => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/update/pass`, { password }, {
        headers: { authorization: `Bearer ${user.token}` }
      });
      showAlert(res.data.message);
      
    } catch (err) {
      console.error(err);
    }
  };

  const pinPost = async (id) => {
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
  };  


const togglePrivateAccount = async () => {
  if (!user?.token) return showAlert('You must be logged in');

  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/account/private`,
      {},
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    // تحديث حالة الحساب المحليًا
    setUser((prev) => ({ ...prev, isPrivate: !prev.isPrivate }));

    showAlert(res.data.message);
  } catch (err) {
    console.error(err);
    showAlert(err.response?.data?.message || 'Failed to update privacy');
  }
};


  const getUserById = async (id) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/${id}`);
      return res.data; // بيرجع بيانات اليوزر
    } catch (err) {
      console.error("Error fetching user by ID:", err);
      return null;
    }
  };

  const saveMusicInPlayList = async (musicId) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/save/music/${musicId}`,
        {},
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      showAlert(res.data.message || 'Music saved successfully');
      return res.data;
    } catch (err) {
      console.error("Error saving music in playlist:", err);
      return null;
    }
  };

  // =====================================

  useEffect(() => {
    const getSuggestedUsers = async () => {
      if (!user?.token) return;

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/suggested`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setSuggestedUsers(res.data);
      } catch (err) {
        console.error("Error fetching suggested users:", err.response?.data || err.message);
      }
    };
    getSuggestedUsers();
  }, [user?.token]);


  useEffect(() => {
    if (!socket) return;

    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
      console.log("👥 Online users updated:", users);
    });

    // تنظيف عند الخروج
    return () => socket.off("getOnlineUsers");
  }, [socket]);


  return (
    <UserContext.Provider
        value={{
            suggestedUsers,
            saveMusicInPlayList,
            togglePrivateAccount,
            updatePassword
            ,getUserById,followUser,
            updatePhoto,
            updateProfile,
            pinPost,
            onlineUsers,updateProfileLoading,loading
        }}
    >
      {children}
    </UserContext.Provider>
  );
};
