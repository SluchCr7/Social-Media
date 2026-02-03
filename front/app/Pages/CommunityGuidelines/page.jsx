'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    HiHeart,
    HiNoSymbol,
    HiChatBubbleLeftRight,
    HiShieldCheck,
    HiUserGroup,
    HiSparkles,
    HiFlag
} from 'react-icons/hi2';

import InfoHero from '@/app/Component/Management/InfoHero';
import ContentSidebar from '@/app/Component/Management/ContentSidebar';
import ManagementCard from '@/app/Component/Management/ManagementCard';

const CommunityGuidelines = () => {
    const { t } = useTranslation();
    const [activeId, setActiveId] = useState('kindness');

    const sections = [
        {
            id: 'kindness',
            label: t('Kindness'),
            title: t('Be Kind and Respectful'),
            icon: <HiHeart className="w-6 h-6" />,
            content: (
                <>
                    <p>We are all in this together to create a welcoming environment. Let is treat everyone with respect. Healthy debates are natural, but kindness is required.</p>
                    <p>Disruptive behavior, personal attacks, and inflammatory language have no place in our community.</p>
                </>
            )
        },
        {
            id: 'safety',
            label: t('Safety'),
            title: t('No Hate Speech or Bullying'),
            icon: <HiNoSymbol className="w-6 h-6" />,
            content: (
                <>
                    <p>Make sure everyone feels safe. Bullying of any kind is not allowed, and degrading comments about things like race, religion, culture, sexual orientation, gender or identity will not be tolerated.</p>
                    <p>We have a zero-tolerance policy for harassment. Reporting such behavior is encouraged and will be handled with high priority.</p>
                </>
            )
        },
        {
            id: 'privacy',
            label: t('Privacy'),
            title: t('Respect Privacy'),
            icon: <HiShieldCheck className="w-6 h-6" />,
            content: (
                <>
                    <p>Being part of this community requires mutual trust. Authentic, expressive discussions make groups great, but may also be sensitive and private. What is shared in the group should stay in the group.</p>
                    <p>Do not share personal information of others (doxing) under any circumstances.</p>
                </>
            )
        },
        {
            id: 'constructive',
            label: t('Constructive'),
            title: t('Be Constructive'),
            icon: <HiChatBubbleLeftRight className="w-6 h-6" />,
            content: (
                <>
                    <p>Feedback is welcome if it is constructive. If you have a problem with something, explain why and offer a solution. Do not just complain.</p>
                    <p>Contribute to the network pulse by sharing high-quality content that adds value to the grid.</p>
                </>
            )
        },
        {
            id: 'reporting',
            label: t('Reporting'),
            title: t('Reporting & Enforcement'),
            icon: <HiFlag className="w-6 h-6" />,
            content: (
                <>
                    <p>If you see content that violates these guidelines, use the reporting tools available on every post and profile. Our moderation team reviews reports 24/7.</p>
                    <p>Repeated violations of these rules may lead to temporary suspension or permanent removal from the network.</p>
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
                title={t('Community Guidelines')}
                subtitle={t('The core principles that govern interaction and resonance within the Sluchitt Network.')}
                icon={HiUserGroup}
                gradient="from-pink-500 to-rose-500"
            />

            <div className="max-w-7xl mx-auto px-6 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    <div className="lg:col-span-1">
                        <padding className="block lg:sticky lg:top-24">
                            <ContentSidebar
                                items={sections.map(s => ({ id: s.id, label: s.label, icon: s.icon }))}
                                activeId={activeId}
                                onItemClick={handleScrollTo}
                            />
                        </padding>
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

export default CommunityGuidelines;
