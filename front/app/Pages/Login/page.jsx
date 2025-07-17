'use client'
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/Context/AuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { generateMeta } from '@/app/utils/MetaDataHelper';


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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-lightMode-bg text-lightMode-text dark:bg-darkMode-bg dark:text-darkMode-text px-4 transition-colors duration-500">
      <div className="w-full max-w-3xl rounded-3xl shadow-xl border border-lightMode-menu dark:border-darkMode-menu p-10 md:p-16 bg-lightMode-menu dark:bg-darkMode-menu backdrop-blur-md">
        <h2 className="text-4xl font-bold text-center mb-8 text-lightMode-text dark:text-darkMode-text">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm mb-1 text-lightMode-text2 dark:text-darkMode-text2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/80 dark:bg-white/10 text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm mb-1 text-lightMode-text2 dark:text-darkMode-text2">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
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

          
          <p className="text-sm text-right text-blue-500 hover:underline cursor-pointer mt-2">
            <a href="/Pages/Forgot">Forgot your password?</a>
          </p>


          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-sm text-center text-lightMode-text2 dark:text-darkMode-text2">
            Don't have an account?{' '}
            <a href="/Pages/Register" className="text-blue-500 hover:underline">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
