'use client';

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNotify } from "./NotifyContext";
import { useAlert } from "./AlertContext";
import { useSocket } from "./SocketContext";
import { useMessageActions } from "../Custome/Message/useMesssageActions";
import { useUnReadMessage } from "../Custome/Message/useUnReadMessage";

export const MessageContext = createContext();

export const MessageContextProvider = ({ children }) => {
  const { user } = useAuth();
  const { addNotify } = useNotify();
  const { showAlert } = useAlert();
  const { socket } = useSocket();

  const [users, setUsers] = useState([]);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(true);
  const [messagesByUser, setMessagesByUser] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [unReadedMessage, setUnReadedMessage] = useState(0);
  const [unreadCountPerUser, setUnreadCountPerUser] = useState({});
  const {toggleLikeMessage , deleteMessage , deleteForMe , copyMessageText} = useMessageActions({ user, showAlert, setMessages });
  const {fetchUnreadMessages,markAllAsReadBetweenUsers,updateUnreadCounters, } = useUnReadMessage({ user, setUnReadedMessage, setUnreadCountPerUser, unreadCountPerUser });
  // ----------------- Fetch Users -----------------

  useEffect(() => {
  setIsUserLoading(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/message/users`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );

      // البيانات الآن تحتوي على: lastMessage, lastMessageAt, unreadCount
      // يمكن ترتيبها أو تنسيقها هنا إذا أردت
      const formattedUsers = res.data.map(u => ({
        ...u,
        lastMessage: u.lastMessage || "",
        lastMessageAt: u.lastMessageAt ? new Date(u.lastMessageAt) : null,
        unreadCount: u.unreadCount || 0
      }));

      setUsers(formattedUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setIsUserLoading(false);
    }
  };

  if (user?.token) fetchUsers();
  }, [user]);
  // ----------------- Fetch Messages Between 2 users -----------------
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

  // ----------------- Add New Message -----------------
  const AddNewMessage = async (text, images, replyTo = null) => {
    if (!selectedUser || !user?.token) return;

    const tempId = Date.now().toString();

    const tempMessage = {
      _id: tempId,
      text,
      Photos: images?.map(img => ({ url: URL.createObjectURL(img) })) || [],
      sender: user._id,
      receiver: selectedUser._id,
      createdAt: new Date().toISOString(),
      isRead: false,
      pending: true,
      ...(replyTo && { replyTo }), // ✅ إضافة الرد مؤقتًا في الواجهة
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
      const formData = new FormData();

      if (images?.length > 0) {
        images.forEach(img => formData.append("image", img));
      }
      if (text) formData.append("text", text);
      if (replyTo) formData.append("replyTo", replyTo._id); // ✅ إرسال ID الرسالة الأصلية

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/message/send/${selectedUser._id}`,
        formData,
        { headers: { authorization: `Bearer ${user.token}` } }
      );

      const newMessage = res.data;

      setMessages(prev =>
        prev.map(m => (m._id === tempId ? { ...newMessage, pending: false } : m))
      );

      await addNotify({
        content: `${user.username} replied to your message`,
        type: "message",
        receiverId: selectedUser._id,
        actionRef: newMessage._id,
        actionModel: "Message"
      });

    } catch (err) {
      console.error("Error sending message:", err);

      setMessages(prev =>
        prev.map(m => (m._id === tempId ? { ...m, pending: false, error: true } : m))
      );

      showAlert("Failed to send message.");
    }
  };


  // ----------------- Fetch All Messages By User -----------------
  const fetchMessagesByUser = async () => {
    if (!user || !user._id || !user.token) return;

    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/message/user/${user._id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMessagesByUser(res.data);
    } catch (err) {
      console.error('Error fetching messages by user:', err);
    }
  };

  
  useEffect(() => {
    fetchMessagesByUser();
  }, [user]);



  // ----------------- Socket -----------------
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      const senderId = message.sender?._id || message.sender;
      if (selectedUser && senderId === selectedUser._id) {
        setMessages(prev => [...prev, message]);
      }
      updateUnreadCounters(message);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser]);

  
  return (
    <MessageContext.Provider
      value={{
        users,
        isUserLoading,
        selectedUser,
        AddNewMessage,
        setSelectedUser,
        messages,
        isMessagesLoading,
        messagesByUser,
        markAllAsReadBetweenUsers,
        unReadedMessage,
        unreadCountPerUser,
        fetchUnreadMessages,
        toggleLikeMessage,
        deleteMessage,
        deleteForMe,
        copyMessageText,
        replyingTo, setReplyingTo
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
