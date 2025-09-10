'use client';
import React from 'react';
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
  return (
    <div className="min-h-screen bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text px-6 md:px-12 py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Sidebar */}
        <aside className="md:col-span-1 space-y-4 sticky top-20 self-start hidden md:block">
          <h3 className="text-lg font-semibold mb-4 text-lightMode-text2 dark:text-darkMode-text2">
            Table of Contents
          </h3>
          <ul className="space-y-3 text-sm">
            {sections.map((sec) => (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  {sec.title}
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
          
          {sections.map((sec) => (
            <section
              id={sec.id}
              key={sec.id}
              className="bg-white dark:bg-darkMode-card rounded-2xl p-6 md:p-8 shadow-md border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-3">
                {sec.icon}
                <h2 className="text-xl font-semibold text-lightMode-text2 dark:text-darkMode-text2">
                  {sec.title}
                </h2>
              </div>
              <p className="leading-7 text-base">{sec.content}</p>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
