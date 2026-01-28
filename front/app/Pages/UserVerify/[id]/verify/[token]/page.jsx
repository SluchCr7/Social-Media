'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { IoCloseCircle } from 'react-icons/io5';
import { useVerify } from '@/app/Context/VerifyContext';
import { FiHome } from 'react-icons/fi';

const Page = ({ params }) => {
  const { id, token } = params;
  const { verifyStatus, verifyAccount } = useVerify();

  useEffect(() => {
    if (!verifyStatus) verifyAccount(id, token);
  }, [id, token, verifyStatus, verifyAccount]);

  const isVerify = verifyStatus;

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-[#050505] overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px]" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg p-12 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden text-center"
      >
        {isVerify ? (
          <div className="space-y-6">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20"
            >
              <FaCheckCircle className="text-emerald-400 text-5xl" />
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white tracking-tight">
                Verified Successfully!
              </h2>
              <p className="text-emerald-200/70 font-medium text-lg">
                Your account has been fully activated.
              </p>
            </div>

            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              You can now log in and start exploring the full experience without any restrictions.
            </p>

            <div className="pt-6">
              <Link
                href="/Pages/Login"
                className="w-full inline-flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all text-sm uppercase tracking-widest"
              >
                <FiHome size={18} />
                Continue to Login
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20"
            >
              <IoCloseCircle className="text-red-400 text-6xl" />
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white tracking-tight">
                Verification Failed
              </h2>
              <p className="text-red-200/70 font-medium text-lg">
                We couldn&#39;t verify your account.
              </p>
            </div>

            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              The link may be invalid or expired. Please check your email or request a new one.
            </p>

            <div className="pt-6">
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all text-sm uppercase tracking-widest"
              >
                Return Home
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Page;
