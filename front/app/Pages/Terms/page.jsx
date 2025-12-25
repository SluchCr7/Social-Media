'use client';
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { IoArrowUp } from 'react-icons/io5';
import { FileText, Shield, AlertCircle, Scale } from 'lucide-react';

const TermsOfServicePage = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('');
  const sectionsRef = useRef({});

  const currentDate = useMemo(() => new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  }), []);

  const sections = useMemo(() => [
    { id: 'summary', title: t('Quick Summary'), icon: <AlertCircle className="w-5 h-5" /> },
    { id: 'eligibility', title: t('1. Eligibility and Accounts'), icon: <Shield className="w-5 h-5" /> },
    { id: 'conduct', title: t('2. User Conduct and Restrictions'), icon: <Scale className="w-5 h-5" /> },
    { id: 'content-ownership', title: t('3. Content Ownership and License'), icon: <FileText className="w-5 h-5" /> },
    { id: 'ip-rights', title: t('4. Our Intellectual Property Rights'), icon: <Shield className="w-5 h-5" /> },
    { id: 'termination', title: t('5. Termination and Suspension'), icon: <AlertCircle className="w-5 h-5" /> },
    { id: 'warranty', title: t('6. Disclaimer of Warranties (As-Is)'), icon: <Shield className="w-5 h-5" /> },
    { id: 'liability', title: t('7. Limitation of Liability and Indemnity'), icon: <Scale className="w-5 h-5" /> },
    { id: 'governing-law', title: t('8. Governing Law and Disputes'), icon: <Scale className="w-5 h-5" /> },
    { id: 'changes', title: t('9. Changes to Terms'), icon: <FileText className="w-5 h-5" /> },
    { id: 'contact', title: t('10. Contact Us'), icon: <AlertCircle className="w-5 h-5" /> },
  ], [t]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0.1 }
    );

    const refs = Object.values(sectionsRef.current);
    refs.forEach(el => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((id) => {
    const element = sectionsRef.current[id];
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const Section = React.memo(({ id, title, children, icon }) => (
    <motion.section
      id={id}
      ref={el => (sectionsRef.current[id] = el)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group mb-8 relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex items-start gap-4 mb-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10">
          {icon}
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex-1">
          {title}
        </h2>
      </div>
      <div className="relative prose prose-base dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </motion.section>
  ));
  Section.displayName = 'Section';

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 md:px-12 py-16 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 shadow-2xl shadow-blue-500/30 mb-6"
          >
            <FileText className="text-white text-4xl" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t("Terms of Service")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("Effective Date:")} <strong>{currentDate}</strong>
          </p>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-xl sticky top-24 z-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t("Quick Navigation")}
            </p>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {sections.map(sec => (
              <motion.li key={sec.id} whileHover={{ x: 5 }}>
                <button
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${activeSection === sec.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-blue-500/10 dark:hover:bg-blue-500/20'
                    }`}
                >
                  {sec.icon}
                  <span className="font-medium">{sec.title}</span>
                </button>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Content */}
        <div className="space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base text-gray-700 dark:text-gray-300 leading-relaxed bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 shadow-lg"
          >
            {t("Welcome to our Social Media App. By accessing or using our platform, you agree to be bound by the following comprehensive terms and conditions (the 'Terms'). If you do not agree, do not use the service.")}
          </motion.p>

          <Section id="summary" title={t("Quick Summary")} icon={<AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />}>
            <p className="mb-4 font-semibold">{t("Here are the essential points you must know:")}</p>
            <ul className='list-disc list-inside space-y-2 ml-4'>
              <li>{t("You must be at least **13 years old** to use the platform.")}</li>
              <li>{t("You are responsible for all content posted under your account, and **illegal or hateful content is strictly prohibited**.")}</li>
              <li>{t("You **retain ownership** of your content, but grant us a broad license to operate the service.")}</li>
              <li>{t("We reserve the right to **suspend or terminate** your account for serious violations.")}</li>
              <li>{t("Our liability is **limited** as detailed in Section 7.")}</li>
            </ul>
          </Section>

          <Section id="eligibility" title={t("1. Eligibility and Accounts")} icon={<Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />}>
            <p>{t("You confirm that you are **at least 13 years old**. If you are under the legal age of majority in your jurisdiction, you must have permission from a parent or legal guardian to use the service.")}</p>
            <p className="font-semibold mt-4">{t("Account Responsibility:")}</p>
            <p className="ml-4">{t("You are solely responsible for maintaining the confidentiality and security of your account credentials. You must **immediately notify us** of any unauthorized use or security breach of your account.")}</p>
          </Section>

          <Section id="conduct" title={t("2. User Conduct and Restrictions")} icon={<Scale className="w-5 h-5 text-blue-600 dark:text-blue-400" />}>
            <p>{t("You agree to use the Service lawfully and ethically. Prohibited activities include:")}</p>
            <ul className='list-disc list-inside space-y-2 ml-4 mt-4'>
              <li>{t("**Hateful or Illegal Content**: Posting or promoting content that is violent, abusive, harassing, defamatory, or hateful towards any group.")}</li>
              <li>{t("**Harmful Activities**: Distributing malware, spam, or engaging in phishing or impersonation of others.")}</li>
              <li>{t("**Data Mining**: Scraping or collecting data from the Service without express written permission.")}</li>
              <li>{t("**Minors Safety**: Posting any content that exploits or harms children.")}</li>
            </ul>
          </Section>
        </div>

        {/* Back to Top Button */}
        <motion.button
          onClick={scrollTop}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all z-50"
          title="Back to Top"
        >
          <IoArrowUp className="text-2xl" />
        </motion.button>
      </div>
    </div>
  );
};

export default React.memo(TermsOfServicePage);
