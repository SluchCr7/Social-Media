'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCircleCheck } from 'react-icons/fa6';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { useVerify } from '@/app/Context/VerifyContext';

const Page = ({ params }) => {
  const { id, token } = params;
  const { verifyStatus, verifyAccount } = useVerify();

  useEffect(() => {
    if (!verifyStatus) verifyAccount(id, token);
  }, [id, token, verifyStatus , verifyAccount]);

  const isVerify = verifyStatus;

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-3xl p-10 max-w-md w-full text-center border border-gray-200 dark:border-gray-800"
      >
        {isVerify ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="text-green-500 text-7xl mb-4"
            >
              <FaCircleCheck />
            </motion.div>

            <h2 className="text-3xl font-extrabold text-green-700 dark:text-green-400 mb-3">
              Email Verified!
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Your email has been successfully verified.  
              You can now explore all features of our platform.
            </p>

            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2.5 px-8 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Go to Homepage
            </Link>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="text-red-500 text-7xl mb-4"
            >
              <IoIosCloseCircleOutline />
            </motion.div>

            <h2 className="text-3xl font-extrabold text-red-700 dark:text-red-400 mb-3">
              Verification Failed
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-8">
              We couldn’t verify your email. Please try again or contact our support team.
            </p>

            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-gray-500 to-gray-700 text-white font-semibold py-2.5 px-8 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Back to Homepage
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Page;
