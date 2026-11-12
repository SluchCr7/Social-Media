'use client';

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HiShieldCheck,
  HiEye,
  HiAdjustmentsHorizontal,
  HiComputerDesktop,
  HiClock,
  HiSparkles,
  HiFingerPrint,
  HiCloud
} from 'react-icons/hi2';

import InfoHero from '@/app/Component/Management/InfoHero';
import ContentSidebar from '@/app/Component/Management/ContentSidebar';
import ManagementCard from '@/app/Component/Management/ManagementCard';

const CookiesPolicyPage = () => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState('what-are');

  const sections = [
    {
      id: 'what-are',
      label: t('Overview'),
      title: t('What are Cookies?'),
      icon: <HiFingerPrint className="w-6 h-6" />,
      content: (
        <>
          <p>Cookies are small text files stored on your device when you visit a website. They help us recognize your device, remember preferences (like language), and provide a personalized experience.</p>
          <p>Cookies can be first-party (set by this site) or third-party (set by external services we use). We use several types of cookies to deliver the best experience while respecting your privacy.</p>
        </>
      )
    },
    {
      id: 'usage',
      label: t('Usage'),
      title: t('How We Use Them'),
      icon: <HiCloud className="w-6 h-6" />,
      content: (
        <>
          <ul className="list-disc pl-6 space-y-2">
            <li>To remember your login and settings for a smoother experience.</li>
            <li>To analyze traffic and improve the product (analytics cookies).</li>
            <li>To show personalized content and recommended items (marketing cookies).</li>
            <li>To secure the service and detect fraud.</li>
          </ul>
        </>
      )
    },
    {
      id: 'types',
      label: t('Types'),
      title: t('Cookie Categories'),
      icon: <HiSparkles className="w-6 h-6" />,
      content: (
        <div className="grid gap-6 md:grid-cols-2 mt-4">
          {[
            {
              title: t('Essential Cookies'),
              desc: t('Required for core functionality (login, security, accessibility). These are always active.')
            },
            {
              title: t('Performance'),
              desc: t('Help us understand how users interact with the site to improve features and performance.')
            },
            {
              title: t('Functional'),
              desc: t('Remember choices and preferences to provide personalized features.')
            },
            {
              title: t('Analytical'),
              desc: t('Used by third-party partners to display relevant ads and track ad performance.')
            }
          ].map((type) => (
            <div key={type.title} className="p-6 rounded-3xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
              <h4 className="font-extrabold text-gray-900 dark:text-white mb-2">{type.title}</h4>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">{type.desc}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'preferences',
      label: t('Manage'),
      title: t('Your Preferences'),
      icon: <HiAdjustmentsHorizontal className="w-6 h-6" />,
      content: (
        <>
          <p>You can accept all cookies, or manage preferences to enable only the categories you want. Disabling some cookies may reduce functionality or personalization.</p>
          <div className="flex gap-4 mt-8">
            <button className="px-8 py-4 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all">
              {t('Accept All Protocols')}
            </button>
            <button className="px-8 py-4 rounded-2xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest hover:border-indigo-500/30 transition-all">
              {t('Configure Settings')}
            </button>
          </div>
        </>
      )
    },
    {
      id: 'updates',
      label: t('History'),
      title: t('Policy Updates'),
      icon: <HiClock className="w-6 h-6" />,
      content: (
        <>
          <p>We may update this Cookies Policy from time to time to reflect changes in the cookies we use or for other operational, legal, or regulatory reasons.</p>
          <p>Please re-visit this Cookies Policy regularly to stay informed about our use of cookies and related technologies.</p>
        </>
      )
    }
  ];

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveId(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505]">
      <InfoHero
        title={t('Cookies Policy')}
        subtitle={t('Controlling how we utilize digital fingerprints to synchronize your network pulse.')}
        icon={HiShieldCheck}
        gradient="from-emerald-500 to-teal-500"
      />

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <ContentSidebar
              items={sections.map(s => ({ id: s.id, label: s.label, icon: s.icon }))}
              activeId={activeId}
              onItemClick={handleScrollTo}
            />
          </div>

          <div className="lg:col-span-3 space-y-12">
            {sections.map((section, index) => (
              <ManagementCard
                key={section.id}
                id={section.id}
                title={section.title}
                icon={section.icon}
                delay={index * 0.1}
              >
                {section.content}
              </ManagementCard>
            ))}

            <div className="pt-12 border-t border-gray-100 dark:border-white/5 text-center">
              <p className="text-gray-400 text-sm font-black uppercase tracking-widest">
                {t('Last updated')}: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesPolicyPage;
