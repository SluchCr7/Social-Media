import React, { useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import { useAuth } from '../Context/AuthContext';
import { useMessage } from '../Context/MessageContext';
import SenderMessage from './SenderMessage';
import ReceiverMessage from './ReceiverMessage';
import { isToday, isYesterday, format } from 'date-fns';

const Chat = ({ onBack }) => {
  const { user } = useAuth();
  const { selectedUser, messages, backgroundStyle } = useMessage();
  const ContainerMessageRef = useRef(null);

  // --- Group messages by date ---
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

  // --- Display friendly date labels ---
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

  // Auto-scroll to bottom
  useEffect(() => {
    if (ContainerMessageRef.current && messages?.length > 0) {
      ContainerMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-full bg-lightMode-bg dark:bg-darkMode-bg rounded-lg overflow-hidden shadow-md">
      
      {/* Chat Header */}
      <div className="sticky top-0 z-20 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-darkMode-menu shadow-sm">
        <ChatHeader onBack={onBack} />
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 space-y-6 
                   bg-lightMode-bg dark:bg-darkMode-bg 
                   scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 
                   scrollbar-track-transparent"
        style={backgroundStyle}
      >
        {sortedDates.map((dateKey) => (
          <div key={dateKey}>
            {/* Date separator */}
            <div className="flex justify-center my-4">
              <div className="text-xs text-gray-600 dark:text-gray-400 
                              bg-gray-200 dark:bg-gray-700 
                              px-3 py-1 rounded-full shadow-sm">
                {getDisplayDate(dateKey)}
              </div>
            </div>

            {/* Messages under this date */}
            {groupedMessages[dateKey].map((msg, index) =>
              msg.sender?._id === user?._id ? (
                <SenderMessage key={msg._id || index} message={msg} user={user} />
              ) : (
                <ReceiverMessage key={msg._id || index} message={msg} user={selectedUser} />
              )
            )}
          </div>
        ))}
        <div ref={ContainerMessageRef}></div>
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-darkMode-menu shadow-sm">
        <ChatInput />
      </div>
    </div>
  );
};

export default Chat;
