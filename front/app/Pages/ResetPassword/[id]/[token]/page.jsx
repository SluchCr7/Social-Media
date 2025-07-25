'use client'
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/Context/AuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Reset = ({params}) => {
  const {id , token} = params
  const [password , setPassword ] = useState("")
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {ResetPassword} = useAuth(ResetPassword)
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      if (password) {
        ResetPassword(id , token , password)
      } else {
        setError('Invalid email or password');
      }
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-lightMode-bg text-lightMode-text dark:bg-darkMode-bg dark:text-darkMode-text px-4 transition-colors duration-500">
      <div className="w-full max-w-3xl rounded-3xl shadow-xl border border-lightMode-menu dark:border-darkMode-menu p-10 md:p-16 bg-lightMode-menu dark:bg-darkMode-menu backdrop-blur-md">
        <h2 className="text-4xl font-bold text-center mb-8 text-lightMode-text dark:text-darkMode-text">
          Welcome Back To Change Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="relative">
            <label htmlFor="password" className="block text-sm mb-1 text-lightMode-text2 dark:text-darkMode-text2">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 pr-12 rounded-lg bg-white/80 dark:bg-white/10 text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-10 cursor-pointer text-gray-500 dark:text-gray-300"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Reset Now ...' : 'Reset Pass'}
          </button>

          <p className="text-sm text-center text-lightMode-text2 dark:text-darkMode-text2">
            Return To Login Page{' '}
            <a href="/Pages/Login" className="text-blue-500 hover:underline">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Reset;
