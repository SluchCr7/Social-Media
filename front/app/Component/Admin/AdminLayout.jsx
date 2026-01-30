'use client';

import React from 'react';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#050505] dark:via-[#0A0A0A] dark:to-[#050505]">
      {/* 
        AdminLayout is now a minimal wrapper. 
        Navigation and Chrome are handled by AdminPage.jsx to ensure full control over the sticky header and tabs.
      */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
