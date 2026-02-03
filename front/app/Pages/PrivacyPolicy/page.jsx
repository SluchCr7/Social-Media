'use client';

import React, { useState, useEffect } from 'react';
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

const PrivacyPolicy = () => {
    const { t } = useTranslation();
    const [activeId, setActiveId] = useState('collection');

    const sections = [
        {
            id: 'collection',
            label: t('Collection'),
            title: t('Data We Collect'),
            icon: <HiEye className="w-6 h-6" />,
            content: (
                <>
                    <p>We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include your name, email address, profile information, and any other information you choose to provide.</p>
                    <p>We also automatically collect certain information when you use our services, including log information, device information, and information collected by cookies and other tracking technologies.</p>
                </>
            )
        },
        {
            id: 'usage',
            label: t('Usage'),
            title: t('How We Use Your Data'),
            icon: <HiServer className="w-6 h-6" />,
            content: (
                <>
                    <p>We use the information we collect to provide, maintain, and improve our services, to develop new features, and to protect Sluchitt and our users.</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Personalize your experience.</li>
                        <li>Send technical notices and updates.</li>
                        <li>Monitor and analyze trends and usage.</li>
                        <li>Detect and prevent fraudulent transactions.</li>
                    </ul>
                </>
            )
        },
        {
            id: 'sharing',
            label: t('Sharing'),
            title: t('Information Sharing'),
            icon: <HiShare className="w-6 h-6" />,
            content: (
                <>
                    <p>We do not share your personal information with third parties except as described in this policy. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</p>
                    <p>We may also share information if we believe disclosure is in accordance with, or required by, any applicable law or legal process.</p>
                </>
            )
        },
        {
            id: 'security',
            label: t('Security'),
            title: t('Data Security'),
            icon: <HiLockClosed className="w-6 h-6" />,
            content: (
                <>
                    <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
                    <p>Your data is encrypted both at rest and in transit. We regularly audit our security protocols to ensure the highest level of protection for our users.</p>
                </>
            )
        },
        {
            id: 'choices',
            label: t('Your Choices'),
            title: t('Data Rights & Choices'),
            icon: <HiCheckBadge className="w-6 h-6" />,
            content: (
                <>
                    <p>You may update, correct or delete information about you at any time by logging into your account. You have the right to request a copy of the data we hold about you or request its deletion.</p>
                    <p>Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject browser cookies.</p>
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
                title={t('Privacy Policy')}
                subtitle={t('Understanding how your data is processed, stored, and protected within our network.')}
                icon={HiShieldCheck}
                gradient="from-purple-600 to-pink-600"
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

export default PrivacyPolicy;
