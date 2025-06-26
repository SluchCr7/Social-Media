import React from 'react';
import Image from 'next/image';
const Loader = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center fixed top-0 left-0 bg-darkMode-bg">
      <div className="flex flex-col items-center space-y-4">
        {/* Logo or text */}
        <Image
            src="/Logo.png"
            alt="logo"
            width={500}
            height={500}
            className="w-32 h-32"
        />
        {/* Spinner
        <div className="w-32 h-32 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div> */}
      </div>
    </div>
  );
};

export default Loader;

      // <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300">