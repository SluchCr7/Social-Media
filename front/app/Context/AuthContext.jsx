'use client';

import axios from 'axios';
import swal from 'sweetalert';
import getData from '../utils/getData';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAlert } from './AlertContext';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [verifyStatus, setVerifyStatus] = useState(false);
  const { showAlert } = useAlert();
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [showAllSuggestedUsers , setShowAllSuggestedUsers] = useState(false)
  // ------------------- AUTH ACTIONS -------------------

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/login`, {
        email,
        password,
      });

      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('loginState', 'true');

      showAlert(res.data.message || 'Login successful');

      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';

      if (err.response?.status === 401 && err.response?.data?.emailSent) {
        showAlert(message);
      } else {
        showAlert(message);
      }
    }
  };

  const Logout = () => {
    swal({
      title: "Are you sure you want to logout?",
      text: "You will be logged out from your account and need to login again to access your data.",
      icon: "warning",
      buttons: {
        cancel: {
          text: "Cancel",
          value: null,
          visible: true,
          className: "swal-btn-cancel",
          closeModal: true,
        },
        confirm: {
          text: "Logout",
          value: true,
          visible: true,
          className: "swal-btn-confirm",
          closeModal: true,
        },
      },
      dangerMode: true,
      closeOnClickOutside: false,
      closeOnEsc: false,
    }).then((willLogout) => {
      if (willLogout) {
        setUser(null);
        setIsLogin(false);
        localStorage.removeItem("user");
        localStorage.removeItem("loginState");
        window.location.href = "/Pages/Login";
      }
    });
  };


  const registerNewUser = async (username, email, password) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/register`, { username, email, password });
      showAlert(res.data.message);
      setTimeout(() => window.location.href = '/Pages/Login', 2000);
    } catch (err) {
      swal('Oops!', err.response?.data?.message || 'Registration failed', 'error');
    }
  };

  const followUser = async (id) => {
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

      // تحديث الـ posts في الـ state
      setPosts((prev) =>
        prev.map((post) =>
          post._id === id
            ? { ...post, isPinned: res.data.message === "Post Pin" } // ضيف فلاغ isPinned
            : post
        )
      );
    } catch (err) {
      console.error(err);
    }
  };  

  const ResetPassword = async (id, token, password) => {
    if (!password) return showAlert('All fields are required');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/password/reset-password/${id}/${token}`, { password }, {
        headers: { authorization: `Bearer ${user.token}` }
      });
      showAlert(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  const ForgetEmail = async (email) => {
    if (!email) return showAlert('Email field is required');
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/password/reset`, { email }, {
        headers: { authorization: `Bearer ${user.token}` }
      });
      showAlert(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const makeUserAdmin = async (userId) => {
    if (!user?.token) return showAlert('You must be logged in as an admin');

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/admin/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      // تحديث حالة المستخدم محليًا
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isAdmin: true } : u
        )
      );

      showAlert(res.data.message || 'User is now an Admin');
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || 'Failed to make user Admin');
    }
  };


const blockOrUnblockUser = async (id) => {
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/block/${id}`,
      {},
      { headers: { authorization: `Bearer ${user.token}` } }
    );

    // تحديث الـ user المحلي
    setUser((prevUser) => {
      const isBlocked = prevUser.blockedUsers.includes(id);
      const updatedUser = {
        ...prevUser,
        blockedUsers: isBlocked
          ? prevUser.blockedUsers.filter((blockedId) => blockedId !== id)
          : [...prevUser.blockedUsers, id],
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });

    showAlert(res.data.message);

    return res.data.updatedTargetUser;
  } catch (err) {
    console.error(err);
  }
};

  const verifyAccount = async (id, token) => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/${id}/verify/${token}`);
      setVerifyStatus(true);
      showAlert('Account Verified');
    } catch (err) {
      console.error(err);
    }
  };


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

  const deleteUser = async () => {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/delete`, {
        headers: { authorization: `Bearer ${user.token}` }
      });
      showAlert(res.data.message);
      localStorage.removeItem('user');
      localStorage.removeItem('loginState');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  }

  // داخل AuthContextProvider
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

const makeAccountPremiumVerify = async () => {
  if (!user?.token) return showAlert('You must be logged in');
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/verify`,
      {},
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    // تحديث حالة الحساب المحليًا
    setUser((prev) => ({ ...prev, isAccountWithPremiumVerify: true }));

    showAlert(res.data.message || 'Account verified successfully');
  } catch (err) {
    console.error(err);
    showAlert(err.response?.data?.message || 'Failed to verify account');
  }
};


// ------------------- NEW FUNCTION: Update Account Status -------------------
  const updateAccountStatus = async (userId, status, days = 7) => {
    if (!user?.token) return showAlert('You must be logged in as an admin');

    try {
      const body = { accountStatus: status };
      if (status === "suspended" && days) {
        body.days = days; // نضيف مدة التعليق لو فيه
      }

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/status/${userId}`,
        body,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      // تحديث الـ users في الـ state لو عندك لستة users
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, accountStatus: status } : u
        )
      );

      // لو بتعدل نفسك كـ user (حالة خاصة)
      if (user._id === userId) {
        const updatedUser = { ...user, accountStatus: status };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      showAlert(res.data.message || `Account status updated to ${status}`);
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || 'Failed to update account status');
    }
  };

  // ------------------- NEW FUNCTIONS: Relationship -------------------
  const getRelationship = async (userId) => {
    if (!user?.token) return showAlert('You must be logged in');

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/relationship/${userId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      return res.data; // ترجع العلاقة الحالية (مثلاً: "following", "requested", "none")
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || 'Failed to fetch relationship');
      return null;
    }
  };

  const updateRelationship = async (userId) => {
    if (!user?.token) return showAlert('You must be logged in');

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/relationship/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      showAlert(res.data.message); // مثال: "Followed", "Unfollowed", "Request Sent"

      // تحديث الـ users المحليين لو عندك state للـ users
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? {
                ...u,
                followers:
                  res.data.message === 'Followed'
                    ? [...u.followers, { _id: user._id }]
                    : u.followers.filter((f) => f._id !== user._id),
              }
            : u
        )
      );

      return res.data.message;
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || 'Failed to update relationship');
      return null;
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
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      return res.data;
    } catch (err) {
      console.error("Error saving music in playlist:", err);
      return null;
    }
  };

  // ------------------- INIT -------------------
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const loginState = localStorage.getItem('loginState');

    if (storedUser && loginState === 'true') {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }

    setIsAuthChecked(true);
  }, []);

  useEffect(() => {
    getData('auth', setUsers);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        Logout,
        registerNewUser,
        followUser,
        updatePhoto,
        updateProfile,
        updatePassword,
        pinPost,
        ResetPassword,
        ForgetEmail,
        verifyAccount,
        verifyStatus,
        setVerifyStatus,
        isLogin,
        isAuthChecked,
        user,
        users,
        userToken,
        onlineUsers,
        blockOrUnblockUser,
        suggestedUsers,
        deleteUser, showAllSuggestedUsers, setShowAllSuggestedUsers
        ,togglePrivateAccount,makeAccountPremiumVerify, makeUserAdmin,updateAccountStatus
        ,getRelationship,
        updateRelationship,getUserById
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
