'use client';
import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useAlert } from './AlertContext';

const VerifyContext = createContext();
export const useVerify = () => useContext(VerifyContext);

export const VerifyContextProvider = ({ children }) => {
    const { user } = useAuth();
    const {showAlert} = useAlert()
    const [verifyStatus, setVerifyStatus] = useState(false);

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


    const verifyAccount = async (id, token) => {
    try {
        await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/${id}/verify/${token}`);
        setVerifyStatus(true);
        showAlert('Account Verified');
    } catch (err) {
        console.error(err);
    }
    };
    


  return (
    <VerifyContext.Provider
          value={{
            verifyAccount,
            ResetPassword,
            ForgetEmail,verifyStatus,setVerifyStatus
      }}
    >
      {children}
    </VerifyContext.Provider>
  );
};
