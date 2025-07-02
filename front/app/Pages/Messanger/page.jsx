'use client'
import React from 'react';
import ChatSlider from './../../Component/ChatSlider';
import Chat from './../../Component/Chat';
import { useMessage } from '@/app/Context/MessageContext';
import NoChat from './../../Component/NoChat';

const MessangerSluchit = () => {
    const { selectedUser , backgroundStyle } = useMessage();
    return (
        <div className={`z-[999] transition-all w-full duration-500`}>
            <div className={`transform transition-all duration-700 ease-in-out w-full mx-auto min-h-[60vh] shadow-2xl rounded-xl relative`}>
                {/* Content Area */}
                <div className='flex flex-col md:flex-row items-start h-[100vh]'>
                    <div className='w-[20%] md:w-[25%] h-full'>
                        <ChatSlider />
                    </div>
                    <div className='flex-1 h-full overflow-auto'>
                        {selectedUser ? <Chat /> : <NoChat />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessangerSluchit;
