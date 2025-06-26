'use client'
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
export const NotifyContext = createContext();
import { toast , ToastContainer } from "react-toastify";
import {useMessage } from "./MessageContext";
import { useAuth } from "./AuthContext";
export const NotifyContextProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([])
    const [notificationsByUser , setNotificationsByUser] = useState([])
    const {user} = useAuth()
    const AddNotify = async (content , id) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/add/${id}`, { content },
                {
                    headers:
                        { Authorization: `Bearer ${user.token}` }
                })
        } catch (err) { 
            console.log(err)
        }
    }
    const deleteNotify = async (id) => {
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/${id}` , {headers : {authorization : `Bearer ${user.token}`}})
            toast.success(res.data.message);
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(()=>{
        const getNotificationsByUser = async() => {
            if (!user || !user._id || !user.token) return; // wait until user is ready
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/user`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    }
                );
                setNotificationsByUser(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getNotificationsByUser();
    },[user])
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
        <NotifyContext.Provider value={{
            notifications,
            setNotifications,
            AddNotify,
            deleteNotify,
            notificationsByUser,
            setNotificationsByUser
        }}>
        {children}
        </NotifyContext.Provider>
        </>
    );
};

export const useNotify = () => {
    return useContext(NotifyContext)
}