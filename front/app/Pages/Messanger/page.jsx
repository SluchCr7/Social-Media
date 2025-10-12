'use client';
import React, { useEffect, useState } from 'react';
import { useMessage } from '@/app/Context/MessageContext';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/Context/AuthContext';
import MessangerPresentation from './MessangerPresentation';
import { useUser } from '@/app/Context/UserContext';

const MessangerSluchit = () => {
  const { selectedUser, setSelectedUser } = useMessage();
  const searchParams = useSearchParams();
  const [showSidebar, setShowSidebar] = useState(true);
  const { getUserById } = useUser();

  useEffect(() => {
    const userId = searchParams.get('userId');
    if (!userId) return;

    // ✅ لو المستخدم الحالي هو نفسه اللي في الـ state
    if (selectedUser?._id === userId) return;

    // ✅ لو جاي من Link بـ history.state
    if (history.state?.user) {
      setSelectedUser(history.state.user);
      setShowSidebar(false);
      return;
    }

    // ✅ لو مفيش بيانات، نجيبها من API
    getUserById(userId)
      .then((res) => {
        setSelectedUser(res.data);
        setShowSidebar(false);
      })
      .catch((err) => console.error('Failed to fetch user for chat:', err));
  }, [searchParams, selectedUser, getUserById]);

  return (
    <MessangerPresentation
      selectedUser={selectedUser}
      setShowSidebar={setShowSidebar}
      showSidebar={showSidebar}
    />
  );
};

export default MessangerSluchit;
