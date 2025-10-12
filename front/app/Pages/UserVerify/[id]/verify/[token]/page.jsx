'use client';
import { useAuth } from '@/app/Context/AuthContext';
import { useUser } from '@/app/Context/UserContext';
import { useVerify } from '@/app/Context/VerifyContext';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { FaCircleCheck } from 'react-icons/fa6';
import { IoIosCloseCircleOutline } from 'react-icons/io';

const Page = ({ params }) => {
  const { id, token } = params;
  const { verifyStatus, verifyAccount } = useVerify();

  useEffect(() => {
    if (!verifyStatus) {
      verifyAccount(id, token);
    }
  }, [id, token, verifyStatus]);

  const isVerify = verifyStatus;

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-lightMode-bg dark:bg-darkMode-bg px-4">
      <div className="bg-white dark:bg-darkMode-bg shadow-xl rounded-2xl p-10 max-w-md w-full text-center border dark:border-gray-700">
        {isVerify ? (
          <div className="flex items-center flex-col justify-center">
            <div className="text-green-500 text-6xl mb-4 text-center">
              <FaCircleCheck />
            </div>
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
              Email Verified
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your email has been successfully verified. You can now use all features.
            </p>
            <Link
              href="/"
              className="inline-block bg-primary text-white font-semibold py-2 px-6 rounded-full hover:bg-primary/90 transition"
            >
              Go to Homepage
            </Link>
          </div>
        ) : (
          <div className="flex items-center flex-col justify-center">
            <div className="text-red-500 text-6xl mb-4">
              <IoIosCloseCircleOutline />
            </div>
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              There was an issue verifying your email. Please try again or contact support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
