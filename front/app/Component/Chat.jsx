import React from 'react';
// import MainChat from './MainChat';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import { format, isToday, isYesterday } from 'date-fns';
import { useAuth } from '../Context/AuthContext';
import { useMessage } from '../Context/MessageContext';
import SenderMessage from './SenderMessage';
import ReceiverMessage from './ReceiverMessage';

const Chat = () => {
  const { user } = useAuth();
  const { selectedUser, messages } = useMessage();

  // --- Group messages by date ---
  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, message) => {
      const date = new Date(message.createdAt);
      const dayKey = date.toDateString();
      if (!groups[dayKey]) {
        groups[dayKey] = [];
      }
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

  return (
    <div className='flex flex-col w-full h-full bg-lightMode-bg dark:bg-darkMode-bg rounded-lg overflow-hidden shadow-md'>

      {/* Chat Header */}
      <div className="border-b border-gray-700 px-4 py-3">
        <ChatHeader />
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {sortedDates.map((dateKey) => (
          <div key={dateKey}>
            {/* Date separator */}
            <div className="flex justify-center my-4">
              <div className="text-gray-300 text-xs bg-gray-600/30 px-4 py-1 rounded-full backdrop-blur-sm shadow-sm">
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
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-700 p-4">
        <ChatInput />
      </div>
    </div>
  );
};

export default Chat;
