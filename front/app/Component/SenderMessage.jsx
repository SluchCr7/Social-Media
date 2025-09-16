'use client';
import Image from 'next/image';
import React from 'react';
import { useMessage } from '../Context/MessageContext';
import { BsCheck, BsCheckAll } from 'react-icons/bs';

const SenderMessage = ({ message, user }) => {
  const { backgroundStyle } = useMessage();
  const isRead = message.isRead;

  return (
    <div className="flex justify-end px-4 py-2">
      <div className="flex max-w-[80%] gap-2 items-end">
        {/* محتوى الرسالة */}
        <div className="flex flex-col items-end text-right">
          <div className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-br-sm shadow-md">
            {/* الصور */}
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
                    src={img.url}
                    alt={`image_message_${index}`}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover max-w-[150px] md:max-w-[250px] hover:scale-105 transition"
                  />
                ))}
              </div>
            )}

            {/* النص */}
            {message.text && (
              <p className="text-sm break-words">{message.text}</p>
            )}
          </div>

          {/* التوقيت + حالة القراءة */}
          <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400 opacity-70">
            <span>
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            {isRead ? (
              <BsCheckAll className="text-blue-500" title="Seen" />
            ) : (
              <BsCheck className="text-gray-400" title="Sent" />
            )}
          </div>
        </div>

        {/* صورة البروفايل */}
        <Image
          src={user?.profilePhoto?.url || '/default.jpg'}
          alt="Sender"
          width={32}
          height={32}
          className="rounded-full object-cover w-8 h-8"
        />
      </div>
    </div>
  );
};

export default SenderMessage;
