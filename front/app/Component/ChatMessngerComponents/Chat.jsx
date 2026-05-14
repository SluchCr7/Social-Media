'use client';

import React, { useEffect, useRef, memo, useMemo } from 'react';
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
import { MessageCircle, ShieldCheck, Lock } from 'lucide-react';

const Chat = memo(({ onBack }) => {
  const { user } = useAuth();
  const { selectedUser, messages, isMessagesLoading } = useMessage();
  const ContainerMessageRef = useRef(null);
  const { t } = useTranslation();

  const groupedMessages = useMemo(() => {
    if (!messages) return {};
    return messages.reduce((groups, message) => {
      if (!message?.createdAt) return groups;
      const date = new Date(message.createdAt);
      const dayKey = date.toDateString();
      if (!groups[dayKey]) groups[dayKey] = [];
      groups[dayKey].push(message);
      return groups;
    }, {});
  }, [messages]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedMessages).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
  }, [groupedMessages]);

  const getDisplayDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return t("Today") || 'Today';
    if (isYesterday(date)) return t("Yesterday") || 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };

  useEffect(() => {
    if (ContainerMessageRef.current && messages?.length > 0) {
      ContainerMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden bg-white dark:bg-black">
      {/* Header */}
      <div className="flex-none z-20">
        <ChatHeader onBack={onBack} />
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
        <div className="space-y-12 min-h-full flex flex-col justify-end">
          {isMessagesLoading ? (
            <div className="flex flex-col gap-8 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <MessageSkeleton key={i} />
              ))}
            </div>
          ) : !messages || messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 rounded-[2rem] bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-300 mb-6 border border-gray-100 dark:border-white/5">
                <MessageCircle size={32} />
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-2">{t("Your thread starts here")}</h3>
              <p className="text-sm text-gray-500 font-medium max-w-[280px]">
                {t("Send a message to start a conversation with")} {selectedUser?.username}
              </p>
              
              <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                 <Lock size={12} />
                 <span>{t("End-to-end encrypted")}</span>
              </div>
            </div>
          ) : (
            <>
              {sortedDates.map((dateKey) => (
                <div key={dateKey} className="space-y-8">
                  {/* Date Divider */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gray-100 dark:bg-threads-border" />
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">
                      {getDisplayDate(dateKey)}
                    </span>
                    <div className="flex-1 h-px bg-gray-100 dark:bg-threads-border" />
                  </div>

                  <div className="flex flex-col gap-4">
                    {groupedMessages[dateKey].map((msg, index) => {
                      const senderId = msg.sender?._id || msg.sender;
                      const isMine = senderId === user?._id;
                      return (
                        <motion.div
                          key={msg._id || index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
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
              <div ref={ContainerMessageRef} className="h-4" />
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-none p-6 pt-2 bg-white dark:bg-black border-t border-gray-100 dark:border-threads-border">
        <ChatInput />
      </div>
    </div>
  );
});

Chat.displayName = 'Chat';

export default Chat;
