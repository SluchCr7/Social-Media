'use client'
import React from 'react';
import ChatSlider from './../../Component/ChatSlider';
import Chat from './../../Component/Chat';
import { useMessage } from '@/app/Context/MessageContext';
import NoChat from './../../Component/NoChat';

const MessangerSluchit = () => {
    const { selectedUser } = useMessage();
    return (
        <div className={`z-[999] transition-all w-full duration-500`}>
            <div className={`transform transition-all duration-700 ease-in-out w-full mx-auto min-h-[60vh] shadow-2xl rounded-xl p-6 relative`}>
                {/* Content Area */}
                <div className='flex flex-col md:flex-row items-start gap-6 h-full'>
                    <div className='w-full md:w-[30%] h-full'>
                        <ChatSlider />
                    </div>
                    <div className='flex-1 h-full overflow-hidden rounded-lg p-4 shadow-inner'>
                        {selectedUser ? <Chat /> : <NoChat />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessangerSluchit;
