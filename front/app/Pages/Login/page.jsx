// 'use client'
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '@/app/Context/AuthContext';
// import { FiEye, FiEyeOff } from 'react-icons/fi';
// import { generateMeta } from '@/app/utils/MetaDataHelper';


// const Login = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const { login } = useAuth();

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setTimeout(() => {
//       setLoading(false);
//       if (formData.email && formData.password) {
//         login(formData.email, formData.password);
//       } else {
//         setError('Invalid email or password');
//       }
//     }, 1500);
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword((prev) => !prev);
//   };

//   return (
//     <div className="w-full min-h-screen flex items-center justify-center bg-lightMode-bg text-lightMode-text dark:bg-darkMode-bg dark:text-darkMode-text px-4 transition-colors duration-500">
//       <div className="w-full max-w-3xl rounded-3xl shadow-xl border border-lightMode-menu dark:border-darkMode-menu p-10 md:p-16 bg-lightMode-menu dark:bg-darkMode-menu backdrop-blur-md">
//         <h2 className="text-4xl font-bold text-center mb-8 text-lightMode-text dark:text-darkMode-text">
//           Welcome Back
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label htmlFor="email" className="block text-sm mb-1 text-lightMode-text2 dark:text-darkMode-text2">
//               Email Address
//             </label>
//             <input
//               type="email"
//               name="email"
//               id="email"
//               placeholder="you@example.com"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-3 rounded-lg bg-white/80 dark:bg-white/10 text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="relative">
//             <label htmlFor="password" className="block text-sm mb-1 text-lightMode-text2 dark:text-darkMode-text2">
//               Password
//             </label>
//             <input
//               type={showPassword ? 'text' : 'password'}
//               name="password"
//               id="password"
//               placeholder="••••••••"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-3 pr-12 rounded-lg bg-white/80 dark:bg-white/10 text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <div
//               onClick={togglePasswordVisibility}
//               className="absolute right-3 top-10 cursor-pointer text-gray-500 dark:text-gray-300"
//             >
//               {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
//             </div>
//           </div>

          
//           <p className="text-sm text-right text-blue-500 hover:underline cursor-pointer mt-2">
//             <a href="/Pages/Forgot">Forgot your password?</a>
//           </p>


//           {error && <p className="text-red-500 text-sm">{error}</p>}
          
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>

//           <p className="text-sm text-center text-lightMode-text2 dark:text-darkMode-text2">
//             Do not have an account?{' '}
//             <a href="/Pages/Register" className="text-blue-500 hover:underline">Sign up</a>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;


'use client'
import React, { useState } from 'react';
import { useAuth } from '@/app/Context/AuthContext';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      if (formData.email && formData.password) {
        login(formData.email, formData.password);
      } else {
        setError('Invalid email or password');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-6 py-12">
      <div className="grid md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-5xl">
        {/* Illustration Section */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-8">
          <img src="/login.svg" alt="login" className="w-3/4" />
        </div>

        {/* Form Section */}
        <div className="p-10 md:p-16 flex flex-col justify-center">
          {/* Logo / Header */}
          <h2 className="text-4xl font-bold text-center mb-2 text-gray-800">Welcome Back</h2>
          <p className="text-center text-gray-500 mb-8">Login to continue exploring communities 🚀</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="relative">
              <label htmlFor="email" className="block text-sm mb-1 text-gray-600">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm mb-1 text-gray-600">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </div>
              </div>
              <div className="text-sm text-blue-500 hover:underline cursor-pointer mt-2 text-right">
                <a href="/Pages/Forgot">Forgot your password?</a>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-100 text-red-600 p-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
                </svg>
              )}
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Social Login */}
            <button
              type="button"
              className="w-full py-3 border rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50"
            >
              <FcGoogle size={22} /> Continue with Google
            </button>

            {/* Register Link */}
            <p className="text-sm text-center text-gray-600">
              Don’t have an account?{' '}
              <a href="/Pages/Register" className="text-blue-600 hover:underline">Sign up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;