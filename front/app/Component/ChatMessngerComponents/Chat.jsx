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
import { motion } from 'framer-motion';

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
    <div className="flex flex-col w-full h-full relative overflow-hidden bg-transparent">

      {/* Header */}
      <div className="flex-none p-4 pb-0 z-20">
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-lg">
          <ChatHeader onBack={onBack} />
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="space-y-8 min-h-full flex flex-col justify-end">
          {isMessagesLoading ? (
            <div className="flex flex-col gap-6 p-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <MessageSkeleton key={i} />
              ))}
            </div>
          ) : messages?.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-white/20 select-none pb-20">
              <div className="w-24 h-24 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 rounded-full border border-dashed border-white/10 animate-[spin_10s_linear_infinite]" />
                <span className="text-4xl">👋</span>
              </div>
              <h3 className="text-lg font-medium text-white/40 mb-2">Say Hello</h3>
              <p className="text-xs uppercase tracking-widest font-bold opacity-50">Start encrypted thread</p>
            </div>
          ) : (
            <>
              {sortedDates.map((dateKey) => (
                <div key={dateKey} className="space-y-6">
                  {/* Date Divider */}
                  <div className="flex items-center justify-center">
                    <div className="px-4 py-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        {getDisplayDate(dateKey)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {groupedMessages[dateKey].map((msg, index) => {
                      const senderId = msg.sender?._id || msg.sender;
                      const isMine = senderId === user?._id;
                      return (
                        <motion.div
                          key={msg._id || index}
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'}`}
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
              ))}
              <div ref={ContainerMessageRef} className="h-1" />
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-none p-4 pt-2 z-20">
        <ChatInput />
      </div>
    </div>
  );
};

export default Chat;
