'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HiShieldCheck,
} from 'react-icons/hi2';

import InfoHero from '@/app/Component/Management/InfoHero';
import ContentSidebar from '@/app/Component/Management/ContentSidebar';
import ManagementCard from '@/app/Component/Management/ManagementCard';
import { sections } from '@/app/utils/Data';
const PrivacyPage = () => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState('collection');

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
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] w-full">
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
