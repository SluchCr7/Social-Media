'use client'
import Image from "next/image";

const UserCard = ({ user, isOnline, onSelect }) => {
    return (
        <div 
            onClick={onSelect} 
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-fg/10 cursor-pointer transition-all"
        >
            <div className="relative">
                <Image
                    src={user?.profilePhoto?.url || '/default.jpg'} 
                    alt="User Profile" 
                    width={40} 
                    height={40} 
                    className="rounded-full w-10 h-10 object-cover"
                />
                {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-darkMode-bg rounded-full"></span>
                )}
            </div>
            <div className="hidden flex-col md:flex">
                <span className="text-dark dark:text-white font-medium text-sm">{user.username}</span>
                <span className="text-gray-800 dark:text-gray-400 text-xs">{user.profileName}</span>
            </div>
        </div>
    );
};

export default UserCard;