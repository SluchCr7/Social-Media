'use client';

import Image from 'next/image';
import React from 'react';

const UserCard = ({ user }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        <Image
          src={user?.profilePhoto?.url || '/default.jpg'}
          alt={user?.username}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white">{user?.username}</span>
        <span className="text-[10px] text-white/40 uppercase tracking-wider">User</span>
      </div>
    </div>
  );
};

export default UserCard;
