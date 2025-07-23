'use client';

import axios from 'axios';
import io from 'socket.io-client';
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
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [verifyStatus, setVerifyStatus] = useState(false);
  const { showAlert } = useAlert();
  const [suggestedUsers , setSuggestedUsers] = useState([])
  // ------------------- AUTH ACTIONS -------------------

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/login`, {
        email,
        password,
      });
  
      // لو نجح الدخول
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
        showAlert(message); // مثال: "Your email is not verified. A verification email has been sent."
      } else {
        showAlert(message); // أي خطأ آخر
      }
    }
  };
  
  

  const Logout = () => {
    swal({
      title: 'Are you sure?',
      text: 'You are going to logout from your account!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willLogout) => {
      if (willLogout) {
        setUser(null);
        setIsLogin(false);
        localStorage.removeItem('user');
        localStorage.removeItem('loginState');
        disconnectSocket();
        // window.location.href = '/Pages/Login';
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
      profilePhoto: res.data?.profilePhoto || res.data, // دعم الحالتين
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
      socialLinks: {
        github: fields.socialLinks?.github ?? user.socialLinks?.github ?? '',
        twitter: fields.socialLinks?.twitter ?? user.socialLinks?.twitter ?? '',
        linkedin: fields.socialLinks?.linkedin ?? user.socialLinks?.linkedin ?? '',
        facebook: fields.socialLinks?.facebook ?? user.socialLinks?.facebook ?? '',
        website: fields.socialLinks?.website ?? user.socialLinks?.website ?? '',
      }
    };

    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/update`, payload, {
        headers: { authorization: `Bearer ${user.token}` }
      });

      const newUserData = res.data.user || res.data;

      const updatedUser = {
        ...user,
        ...newUserData,
        token: user.token, // تأكد من الحفاظ على التوكن
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      showAlert('Profile Updated Successfully.');
      setTimeout(() => {
        window.location.reload();
      },2000)
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
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/pin/${id}`, {}, {
        headers: { authorization: `Bearer ${user.token}` }
      });
      showAlert(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  const savePost = async (id) => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/save/${id}`, {}, {
        headers: { authorization: `Bearer ${user.token}` }
      });
      showAlert(res.data.message);
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

  const blockOrUnblockUser = async (id) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/block/${id}`,
        {},
        {
          headers: { authorization: `Bearer ${user.token}` }
        }
      );

      // تحديث حالة blockedUsers داخل user
      setUser((prevUser) => {
        const isBlocked = prevUser.blockedUsers.includes(id);

        return {
          ...prevUser,
          blockedUsers: isBlocked
            ? prevUser.blockedUsers.filter((blockedId) => blockedId !== id)
            : [...prevUser.blockedUsers, id]
        };
      });

      showAlert(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  const verifyAccount = async (id, token) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/${id}/verify/${token}`);
      setVerifyStatus(true);
      showAlert('Account Verified');
    } catch (err) {
      console.error(err);
    }
  };

  const socialMediaLinksUpdate = async (data) => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/update/social`, {data}, {
        headers: { authorization: `Bearer ${user.token}` }
      });
      showAlert(res.data.message);
    } catch (err) {
      console.error(err);
    }
  }

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
  }, [user?.token]); // ✅ سيتم التشغيل فقط عند تغير user.token

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
  // ------------------- SOCKET -------------------

  const connectSocket = (user) => {
    if (!user || socket?.connected) return;
    const newSocket = io(`${process.env.NEXT_PUBLIC_BACK_URL}`, {
      query: { userId: user._id },
    });
    newSocket.on('connect', () => console.log('Socket connected'));
    newSocket.on('getOnlineUsers', setOnlineUsers);
    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socket?.connected) socket.disconnect();
  };

  // ------------------- INIT -------------------

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const loginState = localStorage.getItem('loginState');

    if (storedUser && loginState === 'true') {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLogin(true);
      connectSocket(parsedUser);
    } else {
      setIsLogin(false);
    }

    setIsAuthChecked(true);
  }, []);

  useEffect(() => {
    getData('auth', setUsers);
  }, [users]);

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
        savePost,
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
        blockOrUnblockUser
        , suggestedUsers,
        deleteUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};