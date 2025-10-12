import axios from "axios";
import { checkUserStatus } from "@/app/utils/checkUserLog";

export const useMessageActions = ({ user , showAlert, setMessages }) => {
  const headers = { Authorization: `Bearer ${user?.token}` };

const toggleLikeMessage = async (messageId) => {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/message/like/${messageId}`,
      {},
      { headers }
    );

    const updatedMessage = res.data.data;

    // تحديث الرسائل في الواجهة
    setMessages(prev =>
      prev.map(m => (m._id === updatedMessage._id ? updatedMessage : m))
    );

    // ✅ عرض إشعار بسيط (اختياري)
    showAlert(
      updatedMessage.likes?.some(likeUser => likeUser === user._id)
        ? "You liked the message 💬"
        : "You unliked the message ❌",
      "info"
    );
  } catch (err) {
    console.error("Error toggling like:", err);
    showAlert("Failed to like message.");
  }
};

// ----------------- Delete Message (Permanent) -----------------
const deleteMessage = async (messageId) => {
  try {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/message/delete/${messageId}`,
      { headers }
    );

    setMessages(prev => prev.filter(m => m._id !== messageId));
    showAlert("Message deleted successfully 🗑️", "success");
  } catch (err) {
    console.error("Error deleting message:", err);
    showAlert("Failed to delete message.");
  }
};

// ----------------- Delete Message For Me Only -----------------
const deleteForMe = async (messageId) => {
  try {
    await axios.patch(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/message/deleteFor/${messageId}`,
      {},
      { headers }
    );

    // حذفها محليًا فقط من واجهة المستخدم
    setMessages(prev => prev.filter(m => m._id !== messageId));
    showAlert("Message removed from your chat ✅", "info");
  } catch (err) {
    console.error("Error deleting for me:", err);
    showAlert("Failed to delete message locally.");
  }
};

const copyMessageText = async (messageText) => {
  try {
    if (!messageText) {
      showAlert("No message to copy.", "warning");
      return;
    }

    await navigator.clipboard.writeText(messageText);
    showAlert("Message copied to clipboard 📋", "success");
  } catch (err) {
    console.error("Error copying message:", err);
    showAlert("Failed to copy message.");
  }
};

  return {  
    toggleLikeMessage,
    deleteMessage,
    deleteForMe,
    copyMessageText
  };
};
