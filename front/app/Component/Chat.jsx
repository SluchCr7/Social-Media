import React, { useEffect } from 'react';
// import MainChat from './MainChat';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import { useAuth } from '../Context/AuthContext';
import { useMessage } from '../Context/MessageContext';
import SenderMessage from './SenderMessage';
import ReceiverMessage from './ReceiverMessage';
import {useRef} from 'react'
import { isToday, isYesterday, format } from 'date-fns';

const Chat = () => {
  const { user } = useAuth();
  const { selectedUser, messages , backgroundStyle } = useMessage();
  const ContainerMessageRef = useRef(null)
  
  // --- Group messages by date ---
  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, message) => {
      if (!message?.createdAt) return groups; // تجاهل الرسائل غير المكتملة
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
  
  useEffect(() => {
    if (ContainerMessageRef.current && messages?.length > 0) {
      ContainerMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className='flex flex-col w-full h-full bg-lightMode-bg dark:bg-darkMode-bg rounded-lg overflow-hidden shadow-md' >

      {/* Chat Header */}
      <div className="border-b border-gray-700 px-4 py-3">
        <ChatHeader />
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 bg-lightMode-bg dark:bg-darkMode-bg shadow-lg py-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800" style={backgroundStyle}>
        {sortedDates.map((dateKey) => (
          <div key={dateKey}>
            {/* Date separator */}
            <div className="flex justify-center my-4">
              <div className=" text-xs text-lightMode-fg dark:text-darkMode-fg px-4 py-1 rounded-full backdrop-blur-sm shadow-sm">
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
      <div className="border-t border-gray-700 p-4">
        <ChatInput />
      </div>
    </div>
  );
};

export default Chat;
