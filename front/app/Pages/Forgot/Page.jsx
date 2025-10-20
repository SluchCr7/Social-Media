'use client'
import React, { useState, useEffect } from 'react';
import { useVerify } from '@/app/Context/VerifyContext';


const Login = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { ForgetEmail } = useVerify();


  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      if (email) {
        ForgetEmail(email)
      } else {
        setError('Invalid email');
      }
    }, 1500);
  };

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
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/80 dark:bg-white/10 text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>


          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Go ... ' : 'Forget Password'}
          </button>

          <p className="text-sm text-center text-lightMode-text2 dark:text-darkMode-text2">
            Return To Login{' '}
            <a href="/Pages/Login" className="text-blue-500 hover:underline">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
