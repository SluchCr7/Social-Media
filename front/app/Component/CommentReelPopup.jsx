'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import { useAlert } from '../Context/AlertContext';
import axios from 'axios';

const CommentsPopup = ({ reelId, isOpen, onClose }) => {
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  // 🟢 جلب الكومنتس
  const fetchComments = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/post/${reelId}`);
      setComments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // 🟢 إرسال كومنت جديد
  const addComment = async () => {
    if (!newComment.trim()) return;
    if (!user?.token) {
      showAlert("You must be logged in to comment.");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/${reelId}`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setComments(prev => [res.data.comment, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error(err);
      showAlert("Failed to add comment.");
    }
  };

  // عند الفتح
  useEffect(() => {
    if (isOpen) fetchComments();
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Popup box */}
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[70vh] flex flex-col overflow-hidden"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">Comments</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-black">
                <FaTimes size={20} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {comments.length > 0 ? (
                comments.map((c) => (
                  <div key={c._id} className="flex gap-3 items-start border-b pb-2">
                    <img
                      src={c.owner?.profilePhoto?.url || '/default-avatar.png'}
                      alt="avatar"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm">{c.owner?.username || 'User'}</p>
                      <p className="text-gray-700 text-sm">{c.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 mt-10">No comments yet 👀</p>
              )}
            </div>

            {/* Input Box */}
            <div className="border-t px-4 py-3 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addComment}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Send
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommentsPopup;
