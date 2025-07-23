
'use client';
import Image from 'next/image';
import React from 'react';
import { useMessage } from '../Context/MessageContext';
import { BsCheck, BsCheckAll } from 'react-icons/bs';

const SenderMessage = ({ message, user }) => {
  const { backgroundStyle } = useMessage();

  const isRead = message.isRead;

  return (
    <div className="flex justify-end px-4 py-2" style={backgroundStyle}>
      <div className="flex max-w-[80%] gap-2 items-end">
        {/* محتوى الرسالة */}
        <div className="flex flex-col items-end text-right">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-br-sm shadow-md">
            {/* الصور */}
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

            {/* النص */}
            {message.text && <p className="text-sm">{message.text}</p>}
          </div>

          {/* التوقيت + حالة القراءة */}
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
            <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            {isRead ? (
              <BsCheckAll className="text-blue-400" title="Seen" />
            ) : (
              <BsCheck className="text-gray-400" title="Sent" />
            )}
          </div>
        </div>

        {/* صورة البروفايل */}
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
