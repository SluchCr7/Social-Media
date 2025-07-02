'use client'
import Image from 'next/image';
import React, { useEffect } from 'react';
import { useMessage } from '../Context/MessageContext';

const SenderMessage = ({ message, user }) => {
  const {backgroundValue , backgroundStyle} = useMessage()
  return (
    <div className="flex justify-end mb-4" style={backgroundStyle}>
      <div className="flex max-w-[100%] gap-2 items-end">
        {/* Message content */}
        <div className="flex flex-col items-end text-right">
          <div className="bg-gray-800 text-white px-4 text-sm  py-2 rounded-lg rounded-br-none">
            {/* If message contains photos */}
            {Array.isArray(message.Photos) && message.Photos.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {message.Photos.map((img, index) => (
                  <Image
                    key={index}
                    src={img.url}
                    alt={`image_message_${index}`}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
            {/* Message text */}
            <p>{message.text}</p>
          </div>
          <span className="text-xs text-lightMode-text dark:text-darkMode-text mt-1">
            {new Date(message.createdAt).toLocaleTimeString()}
          </span>
        </div>

        {/* Sender avatar */}
        <div>
          <Image
            src={user?.profilePhoto?.url}
            alt="Sender"
            width={40}
            height={40}
            className="rounded-full object-cover w-10 h-10"
          />
        </div>
      </div>
    </div>
  );
};

export default SenderMessage;
