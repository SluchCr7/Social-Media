'use client';

import React, { useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import { useAuth } from '../../Context/AuthContext';
import { useMessage } from '../../Context/MessageContext';
import SenderMessage from './SenderMessage';
import ReceiverMessage from './ReceiverMessage';
import { isToday, isYesterday, format } from 'date-fns';
import MessageSkeleton from '@/app/Skeletons/MessageSkeleton';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = ({ onBack }) => {
  const { user } = useAuth();
  const { selectedUser, messages, isMessagesLoading } = useMessage();
  const ContainerMessageRef = useRef(null);
  const { t } = useTranslation();

  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, message) => {
      if (!message?.createdAt) return groups;
      const date = new Date(message.createdAt);
      const dayKey = date.toDateString();
      if (!groups[dayKey]) groups[dayKey] = [];
      groups[dayKey].push(message);
      return groups;
    }, {});
  };

  const getDisplayDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };

  const groupedMessages = groupMessagesByDate(messages || []);
  const sortedDates = Object.keys(groupedMessages).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  useEffect(() => {
    if (ContainerMessageRef.current && messages?.length > 0) {
      ContainerMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-full bg-[#050505] relative overflow-hidden">
      {/* Decorative Ambient Backgrounds */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full -ml-64 -mb-64 pointer-events-none" />

      {/* High-End Header */}
      <div className="sticky top-0 z-[50] border-b border-white/5 bg-[#050505cc] backdrop-blur-2xl">
        <ChatHeader onBack={onBack} />
      </div>

      {/* Immersive Message Feed */}
      <div
        className="flex-1 overflow-y-auto px-6 py-8 space-y-12 scrollbar-hide relative z-10"
      >
        {isMessagesLoading ? (
          <div className="flex flex-col gap-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <MessageSkeleton key={i} />
            ))}
          </div>
        ) : messages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-20 text-center">
            <div className="w-20 h-20 rounded-[2rem] bg-indigo-500/20 flex items-center justify-center mb-6">
              <span className="text-3xl font-black italic">Z</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">{t("Establish Link with")} {selectedUser?.username}</p>
          </div>
        ) : (
          sortedDates.map((dateKey) => (
            <div key={dateKey} className="space-y-8">
              {/* Pro Date Separator */}
              <div className="flex items-center gap-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/5 to-white/5" />
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 whitespace-nowrap">
                  {getDisplayDate(dateKey)}
                </div>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/5 to-white/5" />
              </div>

              <div className="flex flex-col gap-6">
                {groupedMessages[dateKey].map((msg, index) => {
                  const senderId = msg.sender?._id || msg.sender;
                  const isMine = senderId === user?._id;
                  return (
                    <motion.div
                      key={msg._id || index}
                      initial={{ opacity: 0, x: isMine ? 20 : -20, y: 10 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      {isMine ? (
                        <SenderMessage message={msg} user={user} />
                      ) : (
                        <ReceiverMessage message={msg} user={selectedUser} />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        <div ref={ContainerMessageRef} />
      </div>

      {/* Floating Chat Input Bar */}
      <div className="relative px-6 pb-6 pt-2 z-20">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
        <div className="relative">
          <ChatInput />
        </div>
      </div>
    </div>
  );
};

export default Chat;
