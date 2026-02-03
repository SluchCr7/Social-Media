'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HiShieldCheck,
  HiLockClosed,
  HiEye,
  HiServer,
  HiShare,
  HiCheckBadge,
  HiArrowsRightLeft
} from 'react-icons/hi2';

import InfoHero from '@/app/Component/Management/InfoHero';
import ContentSidebar from '@/app/Component/Management/ContentSidebar';
import ManagementCard from '@/app/Component/Management/ManagementCard';

const PrivacyPage = () => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState('collection');

  const sections = [
    {
      id: 'collection',
      label: t('Collection'),
      title: t('1. Information We Collect'),
      icon: <HiEye className="w-6 h-6" />,
      content: (
        <>
          <p>{t('We may collect information you provide such as name, email, profile picture, etc.')}</p>
          <p>{t('We also collect usage data, device information, and diagnostic signals to ensure network stability.')}</p>
        </>
      )
    },
    {
      id: 'usage',
      label: t('Usage'),
      title: t('2. How We Use Your Information'),
      icon: <HiServer className="w-6 h-6" />,
      content: (
        <>
          <p>{t('We use your info to operate, personalize, and improve your experience.')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('Processing social signals and network resonance.')}</li>
            <li>{t('Synchronizing cross-device experiences.')}</li>
            <li>{t('Providing high-priority technical support.')}</li>
          </ul>
        </>
      )
    },
    {
      id: 'sharing',
      label: t('Sharing'),
      title: t('3. Sharing of Information'),
      icon: <HiShare className="w-6 h-6" />,
      content: (
        <>
          <p>{t('We don’t sell personal info; only share with trusted partners when needed.')}</p>
          <p>{t('Data sharing is strictly governed by our privacy protocols and legal mandates.')}</p>
        </>
      )
    },
    {
      id: 'security',
      label: t('Security'),
      title: t('4. Data Security'),
      icon: <HiLockClosed className="w-6 h-6" />,
      content: (
        <>
          <p>{t('We use reasonable security measures, but no system is 100% secure.')}</p>
          <p>{t('Multi-layer encryption and real-time threat monitoring are active across the entire grid.')}</p>
        </>
      )
    },
    {
      id: 'choices',
      label: t('Your Choices'),
      title: t('5. Your Choices'),
      icon: <HiCheckBadge className="w-6 h-6" />,
      content: (
        <>
          <p>{t('You can update, delete, or request data removal anytime.')}</p>
          <p>{t('Privacy controls are integrated directly into your global settings panel.')}</p>
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
        title={t('Privacy Protocols')}
        subtitle={t('Comprehensive documentation on how your digital footprint is analyzed and protected.')}
        icon={HiShieldCheck}
        gradient="from-purple-600 to-indigo-600"
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

export default PrivacyPage;
