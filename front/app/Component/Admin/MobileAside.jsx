// components/MobileSidebar.tsx

'use client';

import { FiX } from 'react-icons/fi';
import AdminSidebar from './AdminAside';

const MobileSidebar = ({ isOpen, onClose , activeTab, setActiveTab }) => {
  return (
    <div
      className={`fixed inset-0 z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:hidden`}
    >
      {/* خلفية سوداء نصف شفافة */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* محتوى القائمة الجانبية */}
      <div className="relative w-64 h-full bg-white dark:bg-gray-800 shadow-lg p-6 z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Admin</h2>
          <button onClick={onClose} className="text-2xl">
            <FiX />
          </button>
        </div>
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default MobileSidebar;
