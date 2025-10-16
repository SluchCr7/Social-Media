'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Info, Lock, Share2, ShieldCheck, RefreshCw, Mail, UserCheck,
} from 'lucide-react';

import PrivacyPolicyPresentation from './PrivactPresentation';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  const sectionsData = [
    {
      id: 'info',
      title: t('1. Information We Collect'),
      icon: <Info className="w-5 h-5 text-indigo-500" />,
      content: t('We may collect information you provide such as name, email, profile picture, etc.'),
    },
    {
      id: 'use',
      title: t('2. How We Use Your Information'),
      icon: <UserCheck className="w-5 h-5 text-green-500" />,
      content: t('We use your info to operate, personalize, and improve your experience.'),
    },
    {
      id: 'share',
      title: t('3. Sharing of Information'),
      icon: <Share2 className="w-5 h-5 text-purple-500" />,
      content: t('We don’t sell personal info; only share with trusted partners when needed.'),
    },
    {
      id: 'security',
      title: t('4. Data Security'),
      icon: <Lock className="w-5 h-5 text-red-500" />,
      content: t('We use reasonable security measures, but no system is 100% secure.'),
    },
    {
      id: 'choices',
      title: t('5. Your Choices'),
      icon: <ShieldCheck className="w-5 h-5 text-blue-500" />,
      content: t('You can update, delete, or request data removal anytime.'),
    },
    {
      id: 'changes',
      title: t('6. Changes to This Policy'),
      icon: <RefreshCw className="w-5 h-5 text-orange-500" />,
      content: t('We may update this policy periodically; continued use means acceptance.'),
    },
    {
      id: 'contact',
      title: t('7. Contact'),
      icon: <Mail className="w-5 h-5 text-teal-500" />,
      content: (
        <>
          {t('For inquiries, contact us at:')}{' '}
          <a href="mailto:privacy@socialmediaapp.com" className="text-indigo-600 dark:text-indigo-300 underline">
            privacy@socialmediaapp.com
          </a>
        </>
      ),
    },
  ];

  const [openIds, setOpenIds] = useState(sectionsData.map((s) => s.id));
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const sectionRefs = useRef({});
  const [activeId, setActiveId] = useState(sectionsData[0].id);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-35% 0px -45% 0px' }
    );

    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleSection = (id) =>
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const goTo = (id) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileTocOpen(false);
    }
  };

  return (
    <PrivacyPolicyPresentation
      t={t}
      sectionsData={sectionsData}
      openIds={openIds}
      toggleSection={toggleSection}
      goTo={goTo}
      mobileTocOpen={mobileTocOpen}
      setMobileTocOpen={setMobileTocOpen}
      sectionRefs={sectionRefs}
      activeId={activeId}
      scaleX={scaleX}
    />
  );
}
