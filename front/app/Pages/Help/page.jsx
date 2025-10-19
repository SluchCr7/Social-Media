'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiHelpCircle, FiMail, FiMessageCircle, FiPhone, FiChevronDown, FiClock, FiGlobe, FiShield } from 'react-icons/fi'

// HelpCenter.Dark.jsx
// Requirements: TailwindCSS, Framer Motion, react-icons

const TOPICS = [
  { key: 'account', icon: <FiHelpCircle />, title: 'Account & Profile', desc: 'Sign in, account recovery, profile settings, and verification.' },
  { key: 'music', icon: <FiGlobe />, title: 'Music & Playback', desc: 'Playback issues, uploads, playlists, and player controls.' },
  { key: 'reels', icon: <FiMessageCircle />, title: 'Reels & Videos', desc: 'Upload, editing, visibility and sound sync problems.' },
  { key: 'privacy', icon: <FiShield />, title: 'Privacy & Security', desc: 'Reporting, blocking, data and privacy controls.' },
  { key: 'billing', icon: <FiClock />, title: 'Subscriptions & Billing', desc: 'Payments, refunds, and subscription management.' },
  { key: 'community', icon: <FiPhone />, title: 'Community & Moderation', desc: 'Guidelines, reports, moderation, and appeals.' }
]

const FAQ = [
  { q: 'How do I reset my password?', a: 'Go to Settings → Account → Reset password. You will receive an email with further instructions. If you do not receive it, check spam or contact support.' },
  { q: 'Why is my music not playing in background?', a: 'Background playback depends on browser and OS policies. Ensure the tab is allowed to play media, and that battery-saving or focus modes are disabled.' },
  { q: 'How can I report a user or post?', a: 'Open the post or profile, click the three dots menu, and select Report. Provide details and any screenshots to help moderation.' },
  { q: 'How do I request account verification?', a: 'Go to your profile → Verification, and follow the steps. Verification is reviewed manually and may take several days.' },
  { q: 'How do subscriptions & billing work?', a: 'Subscriptions are managed on your billing page. You can cancel anytime; refunds are processed according to our policy.' }
]

export default function HelpCenter() {
  const [query, setQuery] = useState('')
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)
  const [showContact, setShowContact] = useState(false)
  const [contactData, setContactData] = useState({ email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const filteredTopics = TOPICS.filter(t => (
    t.title.toLowerCase().includes(query.toLowerCase()) || t.desc.toLowerCase().includes(query.toLowerCase())
  ))

  const handleContactSubmit = (e) => {
    e.preventDefault()
    // replace this with real API call
    setTimeout(() => {
      setSent(true)
      setContactData({ email: '', subject: '', message: '' })
    }, 700)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071027] to-[#0a1624] text-[#e6eef8] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight flex items-center justify-center gap-3">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg">
              <FiHelpCircle className="text-white text-2xl" />
            </span>
            Help Center
          </h1>
          <p className="mt-3 text-gray-300 max-w-2xl mx-auto">Find articles, troubleshooting guides and contact options. We're here to help 24/7.</p>

          <div className="mt-6">
            <motion.div whileFocus={{ scale: 1.01 }} className="mx-auto max-w-3xl">
              <label htmlFor="search" className="relative block">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for help articles, issues or topics..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/6 border border-white/6 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </label>
            </motion.div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Topics */}
          <section className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="grid sm:grid-cols-2 gap-4">
              {filteredTopics.map((t, idx) => (
                <motion.button
                  key={t.key}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedTopic(t.key)}
                  className={`text-left p-5 rounded-2xl bg-white/3 border border-white/6 backdrop-blur-md shadow-md flex gap-4 items-start transition ${selectedTopic === t.key ? 'ring-2 ring-indigo-500/40' : ''}`}
                >
                  <div className="w-12 h-12 rounded-lg bg-white/6 flex items-center justify-center text-xl">
                    {t.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-sm text-gray-300 mt-1">{t.desc}</div>
                  </div>
                  <div className="text-gray-300 text-sm">More</div>
                </motion.button>
              ))}
            </motion.div>

            {/* Selected topic details (mock) */}
            {selectedTopic && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-6 rounded-2xl bg-gradient-to-br from-white/4 to-transparent border border-white/6">
                <h3 className="text-xl font-bold mb-3">{TOPICS.find(x => x.key === selectedTopic)?.title}</h3>
                <p className="text-gray-300 mb-4">Detailed help articles, step-by-step guides and troubleshooting tips for {TOPICS.find(x => x.key === selectedTopic)?.title}.</p>
                <ul className="space-y-3">
                  <li className="p-3 bg-white/6 rounded-lg">
                    <div className="font-medium">Getting started & common fixes</div>
                    <div className="text-sm text-gray-400">Easy steps to resolve the most common issues.</div>
                  </li>
                  <li className="p-3 bg-white/6 rounded-lg">
                    <div className="font-medium">Advanced settings & privacy</div>
                    <div className="text-sm text-gray-400">How to manage settings and data access.</div>
                  </li>
                </ul>
              </motion.div>
            )}

            {/* FAQ Accordion */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 rounded-2xl bg-white/3 border border-white/6 backdrop-blur-md">
              <h3 className="font-bold text-lg mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {FAQ.map((f, i) => (
                  <div key={i} className="rounded-lg overflow-hidden bg-white/6">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                      <div>
                        <div className="font-medium">{f.q}</div>
                        {openFaq === i && <div className="text-sm text-gray-300 mt-2">{f.a}</div>}
                      </div>
                      <FiChevronDown className={`transition transform ${openFaq === i ? 'rotate-180' : 'rotate-0'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Resources / Useful Links */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-white/4 to-transparent border border-white/6">
              <h4 className="font-semibold mb-3">Helpful Resources</h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li><a className="underline" href="#">Community Guidelines</a></li>
                <li><a className="underline" href="#">Privacy Policy</a></li>
                <li><a className="underline" href="#">Terms & Conditions</a></li>
                <li><a className="underline" href="#">Report a bug</a></li>
              </ul>
            </motion.div>
          </section>

          {/* Right column: Contact & Quick Help */}
          <aside className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-black shadow-2xl">
              <h4 className="font-bold text-lg mb-2">Need more help?</h4>
              <p className="text-sm mb-4">Contact our support team or start a live chat. We typically respond within a few hours.</p>
              <div className="grid gap-3">
                <button onClick={() => setShowContact(true)} className="w-full py-3 rounded-xl bg-black/10 font-semibold">Contact Support</button>
                <a href="/support/live-chat" className="w-full inline-block text-center py-3 rounded-xl bg-black/20">Live Chat</a>
                <a href="mailto:support@example.com" className="w-full inline-block text-center py-3 rounded-xl bg-black/10">Email: support@example.com</a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-white/3 border border-white/6 backdrop-blur-md">
              <h5 className="font-semibold mb-3">Support Hours</h5>
              <div className="text-sm text-gray-300">24 / 7 — We strive to respond quickly to all requests.</div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="p-3 rounded-lg bg-white/6">Report Abuse</div>
                <div className="p-3 rounded-lg bg-white/6">System Status</div>
                <div className="p-3 rounded-lg bg-white/6">API Docs</div>
                <div className="p-3 rounded-lg bg-white/6">Developer Center</div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-white/3 border border-white/6 backdrop-blur-md">
              <h5 className="font-semibold mb-3">Report a bug</h5>
              <p className="text-sm text-gray-300 mb-3">Found an issue? Send details to our team and we’ll investigate.</p>
              <a className="inline-block py-2 px-3 bg-indigo-600 rounded-lg font-medium" href="/support/report">Report</a>
            </motion.div>
          </aside>
        </div>

        {/* Contact Modal */}
        {showContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div onClick={() => setShowContact(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 w-full max-w-2xl p-6 rounded-2xl bg-gradient-to-br from-white/4 to-transparent border border-white/6">
              <h3 className="text-xl font-bold mb-2">Contact Support</h3>
              {sent ? (
                <div className="text-green-400">Thanks — your message was sent. Our team will reply soon.</div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <input value={contactData.email} onChange={(e) => setContactData({ ...contactData, email: e.target.value })} placeholder="Your email" className="w-full p-3 rounded-lg bg-white/6 border border-white/6" />
                  <input value={contactData.subject} onChange={(e) => setContactData({ ...contactData, subject: e.target.value })} placeholder="Subject" className="w-full p-3 rounded-lg bg-white/6 border border-white/6" />
                  <textarea value={contactData.message} onChange={(e) => setContactData({ ...contactData, message: e.target.value })} placeholder="How can we help?" rows={5} className="w-full p-3 rounded-lg bg-white/6 border border-white/6" />
                  <div className="flex items-center gap-3">
                    <button type="submit" className="px-6 py-3 rounded-xl bg-indigo-600 font-semibold">Send Message</button>
                    <button type="button" onClick={() => setShowContact(false)} className="px-4 py-2 rounded-xl border">Close</button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}

        {/* Footer quick links */}
        <footer className="mt-12 text-center text-sm text-gray-400">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="/terms" className="underline">Terms</a>
            <a href="/privacy" className="underline">Privacy</a>
            <a href="/cookies" className="underline">Cookies</a>
            <a href="/contact" className="underline">Contact</a>
          </div>
          <div className="mt-4">Last updated: Oct 19, 2025</div>
        </footer>
      </div>
    </div>
  )
}
