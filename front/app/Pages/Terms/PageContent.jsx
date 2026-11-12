'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HiScale,
  HiDocumentText,
  HiUserGroup,
  HiExclamationTriangle,
  HiShieldCheck,
  HiKey,
  HiCloudArrowUp
} from 'react-icons/hi2';

import InfoHero from '@/app/Component/Management/InfoHero';
import ContentSidebar from '@/app/Component/Management/ContentSidebar';
import ManagementCard from '@/app/Component/Management/ManagementCard';

const TermsPage = () => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState('acceptance');

  const sections = [
    {
      id: 'acceptance',
      label: t('Acceptance'),
      title: t('Acceptance of Terms'),
      icon: <HiShieldCheck className="w-6 h-6" />,
      content: (
        <>
          <p>By accessing and using Sluchitt, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
          <p>Any participation in this service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
        </>
      )
    },
    {
      id: 'conduct',
      label: t('Conduct'),
      title: t('User Conduct'),
      icon: <HiUserGroup className="w-6 h-6" />,
      content: (
        <>
          <p>You agree that you will not misuse the services or help anyone else to do so. Generally, we expect you to act with respect and honesty. You are solely responsible for your interactions with other users.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Respect the privacy of others.</li>
            <li>Do not engage in harassment or bullying.</li>
            <li>Do not post illegal or harmful content.</li>
            <li>Respect intellectual property rights.</li>
          </ul>
        </>
      )
    },
    {
      id: 'property',
      label: t('Property'),
      title: t('Intellectual Property'),
      icon: <HiKey className="w-6 h-6" />,
      content: (
        <>
          <p>The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other matters related to the Site are protected under applicable copyrights, trademarks and other proprietary rights.</p>
          <p>The copying, redistribution, use or publication by you of any such matters or any part of the Site is strictly prohibited without our express written permission.</p>
        </>
      )
    },
    {
      id: 'data',
      label: t('Data Usage'),
      title: t('Data & Cloud Storage'),
      icon: <HiCloudArrowUp className="w-6 h-6" />,
      content: (
        <>
          <p>We store your data securely in our cloud infrastructure. By using the service, you grant us the right to process your data to provide the service.</p>
          <p>For more details on how we handle your data, please refer to our Privacy Policy.</p>
        </>
      )
    },
    {
      id: 'termination',
      label: t('Termination'),
      title: t('Termination of Service'),
      icon: <HiExclamationTriangle className="w-6 h-6" />,
      content: (
        <>
          <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
          <p>Upon termination, your right to use the Service will immediately cease.</p>
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
    <div className="min-h-screen w-full bg-[#fafafa] dark:bg-[#050505]">
      <InfoHero
        title={t('Terms of Service')}
        subtitle={t('The rules and regulations for the use of the Sluchitt Network.')}
        icon={HiScale}
      />

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar navigation */}
          <div className="lg:col-span-1">
            <ContentSidebar
              items={sections.map(s => ({ id: s.id, label: s.label, icon: s.icon }))}
              activeId={activeId}
              onItemClick={handleScrollTo}
            />
          </div>

          {/* Content area */}
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

            {/* Footer Info */}
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

export default TermsPage;
