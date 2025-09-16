'use client';
import React, { useState } from 'react';
import { ShieldCheck, Info, Share2, Lock, UserCheck, RefreshCw, Mail } from 'lucide-react';

const sections = [
  {
    id: 'info',
    title: '1. Information We Collect',
    icon: <Info className="w-5 h-5 text-blue-500" />,
    content:
      'We may collect information you provide directly such as name, email, profile picture, posts, messages, and other content. We may also collect IP address, device info, browser type, and usage data automatically.',
  },
  {
    id: 'use',
    title: '2. How We Use Your Information',
    icon: <UserCheck className="w-5 h-5 text-green-500" />,
    content:
      'We use your information to operate and improve our platform, personalize your experience, respond to inquiries, and provide customer support. Notifications and updates may also be sent.',
  },
  {
    id: 'share',
    title: '3. Sharing of Information',
    icon: <Share2 className="w-5 h-5 text-purple-500" />,
    content:
      'We do not sell your personal information. We may share it with trusted service providers, legal authorities if required, or in case of a business transfer.',
  },
  {
    id: 'security',
    title: '4. Data Security',
    icon: <Lock className="w-5 h-5 text-red-500" />,
    content:
      'We implement reasonable security measures to protect your data. However, no method of transmission over the internet is completely secure.',
  },
  {
    id: 'choices',
    title: '5. Your Choices',
    icon: <ShieldCheck className="w-5 h-5 text-indigo-500" />,
    content:
      'You may update your profile, delete your account, or request data removal at any time. Contact us for assistance.',
  },
  {
    id: 'changes',
    title: '6. Changes to This Policy',
    icon: <RefreshCw className="w-5 h-5 text-orange-500" />,
    content:
      'We may update this policy occasionally. Continued use of the platform means you agree to the updated terms.',
  },
  {
    id: 'contact',
    title: '7. Contact',
    icon: <Mail className="w-5 h-5 text-teal-500" />,
    content: (
      <>
        If you have any questions regarding our Privacy Policy, please contact us at:{' '}
        <a
          href="mailto:privacy@socialmediaapp.com"
          className="text-blue-600 dark:text-blue-400 underline hover:opacity-90 transition"
        >
          privacy@socialmediaapp.com
        </a>
      </>
    ),
  },
];

const PrivacyPolicyPage = () => {
  const [expandedSections, setExpandedSections] = useState(sections.map(s => s.id));

  const toggleSection = (id) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(sec => sec !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text px-6 md:px-12 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Sidebar */}
        <aside className="md:col-span-1 space-y-6 sticky top-20 self-start hidden md:block">
          <h3 className="text-lg font-bold mb-4 text-lightMode-text2 dark:text-darkMode-text2">
            Table of Contents
          </h3>
          <ul className="space-y-2 text-sm">
            {sections.map(sec => (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  {sec.icon}
                  <span>{sec.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-3 space-y-8">
          <h1 className="text-4xl font-bold text-center mb-12 text-lightMode-text2 dark:text-darkMode-text2">
            Privacy Policy
          </h1>
          
          {sections.map(sec => (
            <section
              id={sec.id}
              key={sec.id}
              className="bg-white dark:bg-darkMode-card rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700 transition hover:shadow-2xl"
            >
              <button
                onClick={() => toggleSection(sec.id)}
                className="flex items-center gap-3 w-full text-left focus:outline-none"
              >
                {sec.icon}
                <h2 className="text-xl font-semibold text-lightMode-text2 dark:text-darkMode-text2 flex-1">
                  {sec.title}
                </h2>
                <span className="text-gray-400 dark:text-gray-500">{expandedSections.includes(sec.id) ? '−' : '+'}</span>
              </button>
              {expandedSections.includes(sec.id) && (
                <p className="mt-4 leading-7 text-base">{sec.content}</p>
              )}
            </section>
          ))}

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Secure & Informed</h2>
            <p className="mb-6">Update your settings regularly and stay aware of our policies.</p>
            <a
              href="/Pages/Settings"
              className="inline-block px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Go to Settings
            </a>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Zocial. All rights reserved.
      </footer>
    </div>
  );
};

export default PrivacyPolicyPage;
