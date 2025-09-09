'use client';
import Image from 'next/image';
import React from 'react';
import { useMessage } from '../Context/MessageContext';

const ReceiverMessage = ({ message, user }) => {
  const { backgroundStyle } = useMessage();

  return (
    <div className="flex justify-start px-4 py-2" style={backgroundStyle}>
      <div className="flex max-w-[80%] gap-2 items-end">
        {/* صورة المستلم */}
        <Image
          src={user?.profilePhoto?.url || '/default.jpg'}
          alt="Receiver"
          width={32}
          height={32}
          className="rounded-full w-8 h-8 object-cover"
        />

        {/* محتوى الرسالة */}
        <div className="flex flex-col items-start text-left">
          <div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm">
            {/* صور الرسالة */}
            {Array.isArray(message.Photos) && message.Photos.length > 0 && (
              <div
                className={`${
                  message.Photos.length > 2
                    ? 'grid grid-cols-2 gap-2 mb-2'
                    : 'flex flex-wrap gap-2 mb-2'
                }`}
              >
                {message.Photos.map((img, index) => (
                  <Image
                    key={index}
                    src={img?.url}
                    alt={`image_message_${index}`}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover max-w-[150px] md:max-w-[250px] hover:scale-105 transition"
                  />
                ))}
              </div>
            )}

            {/* نص الرسالة */}
            {message.text && (
              <p className="text-sm text-black dark:text-white break-words">
                {message.text}
              </p>
            )}
          </div>

          {/* الوقت */}
          <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 ml-1 opacity-70">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReceiverMessage;
