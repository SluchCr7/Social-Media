import PasswordStrength from '@/app/Component/Setting/PasswordStrength';
import React from 'react'
import { motion } from 'framer-motion'
import { FaLock} from 'react-icons/fa'
const Security = ({
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordMessage,
    setPasswordMessage,
    submitPassword
}) => {
  return (
                <motion.section
                  key="security"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                  className="p-6 rounded-2xl bg-white/60 dark:bg-gray-900/60 border shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-red-400 to-pink-500 text-white shadow-lg"><FaLock /></div>
                    <div>
                      <h2 className="text-lg font-semibold">Security</h2>
                      <p className="text-sm text-gray-500">Manage password, two-factor and account safety.</p>
                    </div>
                  </div>

                  <form onSubmit={submitPassword} className="grid gap-4">
                    <input
                      type="password"
                      placeholder="Current password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="p-3 rounded-lg border bg-white/50 dark:bg-gray-800/50"
                      required
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="p-3 rounded-lg border bg-white/50 dark:bg-gray-800/50"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="p-3 rounded-lg border bg-white/50 dark:bg-gray-800/50"
                      required
                    />

                    <PasswordStrength password={newPassword} />

                    <div className="flex gap-3">
                      <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white">Update password</button>
                      <button onClick={() => { setOldPassword(''); setNewPassword(''); setConfirmPassword('') }} type="button" className="px-4 py-2 rounded-lg border">Reset</button>
                    </div>
                    {passwordMessage && <div className="text-sm text-red-500">{passwordMessage}</div>}
                  </form>

                  <div className="mt-6 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Two-factor Authentication</div>
                        <div className="text-sm text-gray-500">Add an extra layer of protection to your account.</div>
                      </div>
                      <div>
                        <button className="px-3 py-2 rounded-lg border">Manage</button>
                      </div>
                    </div>
                  </div>
      </motion.section>
  )
}

export default Security