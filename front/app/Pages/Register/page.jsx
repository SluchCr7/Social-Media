'use client'
import React, { useState } from 'react'
import { useAuth } from '@/app/Context/AuthContext'
import { FiEye, FiEyeOff, FiMail, FiUser, FiLock } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', username: '' })
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { registerNewUser } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    setTimeout(() => {
      setLoading(false)
      const { email, password, username } = formData

      if (!agreeTerms) {
        setError('You must agree to the Terms and Conditions to register.')
        return
      }

      if (email && password && username) {
        registerNewUser(username, email, password)
      } else {
        setError('Please fill all required fields correctly.')
      }
    }, 1500)
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">
        {/* Left Side (Illustration / Image) */}
        <div className="hidden md:flex items-center justify-center bg-blue-50">
          <img
            src="/register1.svg"
            alt="Register Illustration"
            className="w-3/4 h-auto"
          />
        </div>

        {/* Right Side (Form) */}
        <div className="p-10 md:p-16 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-center mb-3">Create Account 👋</h2>
          <p className="text-center text-gray-500 mb-8">
            Join our community and start your journey today!
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Username */}
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="username"
                placeholder="John Doe"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={() => setAgreeTerms(!agreeTerms)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="/Pages/Terms" className="text-blue-500 hover:underline">
                  Terms and Conditions
                </a>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Social Register */}
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition">
            <FcGoogle size={22} /> Sign up with Google
          </button>

          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{' '}
            <a href="/Pages/Login" className="text-blue-500 hover:underline">Login</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
