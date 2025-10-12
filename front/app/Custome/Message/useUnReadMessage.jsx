import { useEffect } from "react";
import axios from "axios";
import { checkUserStatus } from "@/app/utils/checkUserLog";

export const useUnReadMessage = ({
  user,
  setUnReadedMessage,
  setUnreadCountPerUser,
  unreadCountPerUser, // ✅ إضافته من الـ props
}) => {
  const headers = { Authorization: `Bearer ${user?.token}` };

  // ----------------- Fetch Unread Messages -----------------
  const fetchUnreadMessages = async () => {
    if (!user || !user._id || !user.token) return;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/message/messages/unread`,
        { headers }
      );

      const unreadMessages = res.data;
      setUnReadedMessage(unreadMessages.length);

      const unreadBySender = {};
      unreadMessages.forEach((msg) => {
        const senderId = msg.sender?._id || msg.sender;
        unreadBySender[senderId] = (unreadBySender[senderId] || 0) + 1;
      });

      setUnreadCountPerUser(unreadBySender);
    } catch (err) {
      console.error("Error fetching unread messages:", err);
    }
  };

  // ✅ تنفيذها عند تغيير المستخدم
  useEffect(() => {
    fetchUnreadMessages();
  }, [user]);

  // ----------------- Mark All Read -----------------
  const markAllAsReadBetweenUsers = async (otherUserId) => {
    if (!otherUserId || !user?.token) return;

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/message/read/${otherUserId}`,
        {},
        { headers }
      );

      const count = unreadCountPerUser?.[otherUserId] || 0;
      setUnReadedMessage((prev) => Math.max(0, prev - count));

      setUnreadCountPerUser((prev) => {
        const updated = { ...prev };
        delete updated[otherUserId];
        return updated;
      });
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  };

  // ----------------- Update Unread Counters Locally -----------------
  const updateUnreadCounters = (message) => {
    if (!message || !message.receiver || !message.sender) return;

    const receiverId = message.receiver?._id || message.receiver;
    const senderId = message.sender?._id || message.sender;

    if (receiverId === user._id && !message.isRead) {
      setUnReadedMessage((prev) => prev + 1);
      setUnreadCountPerUser((prev) => ({
        ...prev,
        [senderId]: (prev[senderId] || 0) + 1,
      }));
    }
  };

  // ✅ إرجاع كل الدوال المهمة
  return {
    fetchUnreadMessages,
    markAllAsReadBetweenUsers,
    updateUnreadCounters,
  };
};
