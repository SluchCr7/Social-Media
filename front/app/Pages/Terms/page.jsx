'use client';
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { IoArrowUp } from 'react-icons/io5';

const TermsOfServicePage = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('');
  const sectionsRef = useRef({});

  // ✅ استخدم useMemo لتجنب إعادة إنشاء التواريخ في كل render
  const currentDate = useMemo(() => new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  }), []);

  // ✅ استخدم useMemo لتجنب إعادة إنشاء المصفوفة في كل render
  const sections = useMemo(() => [
    { id: 'summary', title: t('Quick Summary') },
    { id: 'eligibility', title: t('1. Eligibility and Accounts') },
    { id: 'conduct', title: t('2. User Conduct and Restrictions') },
    { id: 'content-ownership', title: t('3. Content Ownership and License') },
    { id: 'ip-rights', title: t('4. Our Intellectual Property Rights') },
    { id: 'termination', title: t('5. Termination and Suspension') },
    { id: 'warranty', title: t('6. Disclaimer of Warranties (As-Is)') },
    { id: 'liability', title: t('7. Limitation of Liability and Indemnity') },
    { id: 'governing-law', title: t('8. Governing Law and Disputes') },
    { id: 'changes', title: t('9. Changes to Terms') },
    { id: 'contact', title: t('10. Contact Us') },
  ], [t]);

  // ✅ اجعل observer ثابت ولا يتغير عبر useEffect مع cleanup واضح
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break; // ✅ نوقف بعد أول تقاطع لتقليل العمليات
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0.1 }
    );

    const refs = Object.values(sectionsRef.current);
    refs.forEach(el => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // ✅ استخدم useCallback لتثبيت الدوال وعدم إعادة إنشائها
  const scrollToSection = useCallback((id) => {
    const element = sectionsRef.current[id];
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ✅ فصل المكون الفرعي memoized لتقليل إعادة التصيير
  const Section = React.memo(({ id, title, children }) => (
    <motion.section
      id={id}
      ref={el => (sectionsRef.current[id] = el)}
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl md:text-2xl font-bold mb-4 border-b border-white/20 pb-1
                     text-lightMode-text2 dark:text-darkMode-text2">
        {title}
      </h2>
      <div className="prose prose-base dark:prose-invert max-w-none">{children}</div>
    </motion.section>
  ));

  return (
    <div className="min-h-screen w-full bg-lightMode-bg dark:bg-darkMode-bg px-4 md:px-12 py-12 text-lightMode-text dark:text-darkMode-text transition-colors duration-300">
      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4
                       text-lightMode-text2 dark:text-darkMode-text2">
          {t("Terms of Service")}
        </h1>
        <p className="text-center text-sm mb-12 text-gray-500 dark:text-gray-400">
          {t("Effective Date:")} <strong>{currentDate}</strong>
        </p>

        {/* Table of Contents */}
        <div className="mb-10 p-4 border-l-4 border-blue-600 bg-blue-50/50 dark:bg-gray-700/50 
                        rounded-lg shadow-inner sticky top-24 z-10">
          <p className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">{t("Quick Navigation")}</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {sections.map(sec => (
              <li key={sec.id}>
                <button
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full text-left px-2 py-1 rounded-lg transition-colors duration-200
                    ${activeSection === sec.id
                      ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(79,70,229,0.4)]'
                      : 'text-lightMode-text dark:text-darkMode-text hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                >
                  {sec.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Terms Content Card */}
        <div className="bg-white/40 dark:bg-darkMode-card/40 backdrop-blur-lg p-8 md:p-12 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700
                        transition-all duration-300">
          
          <p className="mb-8">
            {t("Welcome to our Social Media App. By accessing or using our platform, you agree to be bound by the following comprehensive terms and conditions (the 'Terms'). If you do not agree, do not use the service.")}
          </p>

          <Section id="summary" title={t("Quick Summary")}>
            <p className="mb-4 font-semibold">{t("Here are the essential points you must know:")}</p>
            <ul className='list-disc list-inside space-y-2 ml-4 text-sm'>
              <li>{t("You must be at least **13 years old** to use the platform.")}</li>
              <li>{t("You are responsible for all content posted under your account, and **illegal or hateful content is strictly prohibited**.")}</li>
              <li>{t("You **retain ownership** of your content, but grant us a broad license to operate the service.")}</li>
              <li>{t("We reserve the right to **suspend or terminate** your account for serious violations.")}</li>
              <li>{t("Our liability is **limited** as detailed in Section 7.")}</li>
            </ul>
          </Section>

          <Section id="eligibility" title={t("1. Eligibility and Accounts")}>
            <p>{t("You confirm that you are **at least 13 years old**. If you are under the legal age of majority in your jurisdiction, you must have permission from a parent or legal guardian to use the service.")}</p>
            <p className="font-semibold mt-2">{t("Account Responsibility:")}</p>
            <p className="ml-4">{t("You are solely responsible for maintaining the confidentiality and security of your account credentials. You must **immediately notify us** of any unauthorized use or security breach of your account.")}</p>
          </Section>

          <Section id="conduct" title={t("2. User Conduct and Restrictions")}>
            <p>{t("You agree to use the Service lawfully and ethically. Prohibited activities include:")}</p>
            <ul className='list-disc list-inside space-y-2 ml-4 text-sm'>
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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-blue-600 text-white shadow-lg
                     hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all"
          title="Back to Top"
        >
          <IoArrowUp className="text-xl"/>
        </motion.button>
      </div>
    </div>
  );
};

export default React.memo(TermsOfServicePage);
