'use client';

import axios from 'axios';
import swal from 'sweetalert';
import getData from '../utils/getData';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAlert } from './AlertContext';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const { showAlert } = useAlert();
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
        isLogin,
        isAuthChecked,
        user,
        users,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
