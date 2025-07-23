
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
        <div className="">
          <Image
            src={user?.profilePhoto?.url}
            alt="Receiver"
            width={40}
            height={40}
            className="rounded-full w-full h-10"
          />
        </div>

        {/* محتوى الرسالة */}
        <div className="flex flex-col items-start text-left">
          <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm">
            {/* صور الرسالة */}
            {Array.isArray(message.Photos) && message.Photos.length > 0 && (
              <div
                className={`${
                  message.Photos.length > 2
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-2 w-full mb-2'
                    : 'flex flex-wrap gap-2 mb-2'
                }`}
              >
                {message?.Photos.map((img, index) => (
                  <Image
                    key={index}
                    src={img?.url}
                    alt={`image_message_${index}`}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                ))}
              </div>
            )}

            {/* نص الرسالة */}
            {message.text && <p className="text-sm">{message.text}</p>}
          </div>

          {/* الوقت */}
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
