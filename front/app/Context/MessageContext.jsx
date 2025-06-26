'use client'
import { createContext, useContext, useEffect, useState } from "react";
export const MessageContext = createContext();
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { AuthContext, useAuth } from "./AuthContext";
import swal from "sweetalert";
import {useNotify } from "./NotifyContext";
export const MessageContextProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [selectedUser , setSelectedUser] = useState(null)
    const [messages, setMessages] = useState([])
    const [isMessagesLoading, setIsMessagesLoading] = useState(true)   
    const { AddNotify } = useNotify();
    const [messagesByUser , setMessagesByUser] = useState([])
    const { user } = useAuth();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACK_URL}/api/message/users`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );
                setUsers(res.data);
            } catch (err) {
                console.error('Unauthorized or other error:', err);
            } finally {
                setIsUserLoading(false);
            }
        };
    
        if (user?.token) {
            fetchUsers();
        }
    }, [user]);
    useEffect(() => {
        const getMessagesBetweenTwins = async () => {
            try {   
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/message/messages/${selectedUser?._id}` , {
                    headers : {
                        authorization : `Bearer ${user.token}`
                    }
                })
                setMessages(res.data)
            }   
            catch (err){
                console.log(err)
            }
            finally {
                setIsMessagesLoading(false);
            }
        };
        if (selectedUser) {
            getMessagesBetweenTwins()
        }
    },[selectedUser , messages])
    const AddNewMessage = async (message, images) => {
        const formData = new FormData();

        // Append images if any
        if (images.length > 0) {
            images.forEach((img) => {
                formData.append('image', img); // Name this field as your backend expects
            });
        }

        // Append message
        formData.append('text', message);

        try {
            const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACK_URL}/api/message/send/${selectedUser._id}`,
            formData,
            {
                headers: {
                    authorization: `Bearer ${user.token}`,
                },
            }
            );
            toast.success(res.data.message);
            AddNotify(`${selectedUser.username} Sent You A Message` , selectedUser._id);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        const fetchMessagesByUser = async () => {
            if (!user || !user._id) return; // wait until user is ready
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/message/user/${user._id}`);
                setMessagesByUser(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchMessagesByUser();
    }, [user]); // run only when user changes
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
            <MessageContext.Provider
                value={{
                    users, 
                    isUserLoading,
                    setSelectedUser,
                    selectedUser,
                    messages,
                    isMessagesLoading
                    ,AddNewMessage,
                    messagesByUser
                }}
            >
                {children}
            </MessageContext.Provider>
        </>
    );
};    

export const useMessage = () => {
    return useContext(MessageContext)
}