'use client';

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useAuth } from "./AuthContext";
import { useNotify } from "./NotifyContext";
import { useAlert } from "./AlertContext";

export const MessageContext = createContext();

export const MessageContextProvider = ({ children }) => {
    const { user } = useAuth();
    const { addNotify } = useNotify();
    const { showAlert } = useAlert();

    const [users, setUsers] = useState([]);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isMessagesLoading, setIsMessagesLoading] = useState(true);

    const [messagesByUser, setMessagesByUser] = useState([]);
    const [backgroundType, setBackgroundType] = useState('color');
    const [backgroundValue, setBackgroundValue] = useState('#f0f0f0');
    const [unReadedMessage, setUnReadedMessage] = useState(0);
    const [unreadCountPerUser, setUnreadCountPerUser] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/message/users`, {
                    headers: { Authorization: `Bearer ${user?.token}` },
                });
                setUsers(res.data);
            } catch (err) {
                console.error('Failed to fetch users:', err);
            } finally {
                setIsUserLoading(false);
            }
        };

        if (user?.token) {
            fetchUsers();
        }
    }, [user]);

    useEffect(() => {
        const getMessagesBetweenUsers = async () => {
            if (!selectedUser || !user?.token) return;
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACK_URL}/api/message/messages/${selectedUser._id}`,
                    { headers: { authorization: `Bearer ${user.token}` } }
                );
                setMessages(res.data);
            } catch (err) {
                console.error('Error fetching messages:', err);
            } finally {
                setIsMessagesLoading(false);
            }
        };

        getMessagesBetweenUsers();
    }, [selectedUser, user]);

    const AddNewMessage = async (message, images) => {
        if (!selectedUser || !user?.token) return;

        const formData = new FormData();
        if (images.length > 0) {
            images.forEach(img => formData.append('image', img));
        }
        formData.append('text', message);

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACK_URL}/api/message/send/${selectedUser._id}`,
                formData,
                { headers: { authorization: `Bearer ${user.token}` } }
            );

            showAlert(res.data.message || "Message Sent");

            const newMessage = res.data.message || res.data;
            setMessages(prev => [...prev, newMessage]);

            await fetchMessagesByUser();

            await addNotify({
                content: `${user.username} sent you a message`,
                type: "message",
                receiverId: selectedUser._id,
                actionRef: newMessage._id,
                actionModel: "Message"
            });

        } catch (err) {
            console.error('Error sending message:', err);
            showAlert("Failed to send message.");
        }
    };

    const fetchMessagesByUser = async () => {
        if (!user || !user._id || !user.token) return;

        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/message/user/${user._id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            setMessagesByUser(res.data);

            const unreadTotal = res.data.filter(msg => !msg.isRead && msg.receiver === user._id).length;
            setUnReadedMessage(unreadTotal);

            const unreadBySender = {};
            res.data.forEach(msg => {
                if (!msg.isRead && msg.receiver === user._id) {
                    unreadBySender[msg.sender] = (unreadBySender[msg.sender] || 0) + 1;
                }
            });
            setUnreadCountPerUser(unreadBySender);

        } catch (err) {
            console.error('Error fetching messages by user:', err);
        }
    };

    useEffect(() => {
        fetchMessagesByUser();
    }, [user]);

    const markAllAsReadBetweenUsers = async (otherUserId) => {
        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/message/read/${otherUserId}`, {}, {
                headers: { authorization: `Bearer ${user.token}` }
            });

            await fetchMessagesByUser();
        } catch (err) {
            console.error('Error marking messages as read:', err);
        }
    };

    useEffect(() => {
        const savedType = localStorage.getItem('chatBackgroundType');
        const savedValue = localStorage.getItem('chatBackgroundValue');
        if (savedType && savedValue) {
            setBackgroundType(savedType);
            setBackgroundValue(savedValue);
        }
    }, []);

    const handleBackgroundChange = (type, value) => {
        setBackgroundType(type);
        setBackgroundValue(value);
        localStorage.setItem('chatBackgroundType', type);
        localStorage.setItem('chatBackgroundValue', value);
    };

    const backgroundStyle = backgroundType === 'color'
        ? { color: backgroundValue }
        : {
            backgroundImage: `url(${backgroundValue})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        };

    return (
        <MessageContext.Provider
            value={{
                users,
                isUserLoading,
                selectedUser,
                setSelectedUser,
                messages,
                isMessagesLoading,
                AddNewMessage,
                messagesByUser,
                markAllAsReadBetweenUsers,
                backgroundStyle,
                handleBackgroundChange,
                backgroundValue,
                unReadedMessage,
                unreadCountPerUser
            }}
        >
            {children}
        </MessageContext.Provider>
    );
};

export const useMessage = () => useContext(MessageContext);
