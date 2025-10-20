'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';


const TermsOfServicePage = () => {
  const { t } = useTranslation();

  // قائمة محتويات لإنشاء الروابط السريعة
  const sections = [
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
  ];

  const currentDate = 'October 20, 2025'; // يجب تحديث هذا التاريخ يدويًا عند كل تحديث قانوني

  const SectionHeading = ({ id, children }) => (
    <h2
      id={id}
      className="text-xl md:text-2xl font-bold mb-3 mt-8 pt-2 border-b border-lightMode-text2/20 dark:border-darkMode-text2/20 text-lightMode-text2 dark:text-darkMode-text2"
    >
      {children}
    </h2>
  );

  return (
    <div className="min-h-screen w-full bg-lightMode-bg dark:bg-darkMode-bg px-4 md:px-8 py-12 text-lightMode-text dark:text-darkMode-text">
      <div className="max-w-5xl mx-auto">
        {/* Title and Date */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-lightMode-text2 dark:text-darkMode-text2">
          {t("Terms of Service")}
        </h1>
        <p className="text-center text-sm mb-12 text-gray-500 dark:text-gray-400">
          {t("Effective Date:")} **{currentDate}**
        </p>

        <div className="bg-white dark:bg-darkMode-card p-6 md:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">

          {/* Table of Contents - Quick Navigation */}
          <div className="mb-10 p-4 border-l-4 border-blue-600 bg-blue-50/50 dark:bg-gray-700/50 rounded-lg shadow-inner">
            <p className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">{t("Quick Navigation")}</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {sections.map(section => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-lightMode-text hover:text-blue-600 dark:text-darkMode-text hover:dark:text-blue-400 transition duration-150"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-base leading-7 mb-8">
            {t("Welcome to our Social Media App. By accessing or using our platform, you agree to be bound by the following comprehensive terms and conditions (the 'Terms'). If you do not agree, do not use the service.")}
          </p>
          
          {/* Section: Quick Summary - الملخص التنفيذي */}
          <SectionHeading id="summary">{t("Quick Summary")}</SectionHeading>
          <p className='mb-4 font-semibold'>{t("Here are the essential points you must know:")}</p>
          <ul className='list-disc list-inside space-y-2 ml-4 text-sm'>
            <li>{t("You must be at least **13 years old** to use the platform.")}</li>
            <li>{t("You are responsible for all content posted under your account, and **illegal or hateful content is strictly prohibited**.")}</li>
            <li>{t("You **retain ownership** of your content, but grant us a broad license to operate the service.")}</li>
            <li>{t("We reserve the right to **suspend or terminate** your account for serious violations.")}</li>
            <li>{t("Our liability is **limited** as detailed in Section 7.")}</li>
          </ul>


          {/* Section 1: Eligibility and Accounts - تم دمج 1 و 3 سابقاً */}
          <SectionHeading id="eligibility">{t("1. Eligibility and Accounts")}</SectionHeading>
          <p className="mb-4">
            {t("You confirm that you are **at least 13 years old**. If you are under the legal age of majority in your jurisdiction (usually 18), you must have permission from a parent or legal guardian to use the service.")}
          </p>
          <p className='font-semibold'>
            {t("Account Responsibility:")}
          </p>
          <p className='ml-4'>
            {t("You are solely responsible for maintaining the confidentiality and security of your account credentials. You must **immediately notify us** of any unauthorized use or security breach of your account.")}
          </p>
          
          {/* Section 2: User Conduct and Restrictions - تم تفصيل سلوك المستخدم */}
          <SectionHeading id="conduct">{t("2. User Conduct and Restrictions")}</SectionHeading>
          <p className='mb-4'>
            {t("You agree to use the Service lawfully and ethically. Prohibited activities include:")}
          </p>
          <ul className='list-disc list-inside space-y-2 ml-4 text-sm'>
            <li>{t("**Hateful or Illegal Content**: Posting or promoting content that is violent, abusive, harassing, defamatory, or hateful towards any group.")}</li>
            <li>{t("**Harmful Activities**: Distributing malware, spam, or engaging in phishing or impersonation of others.")}</li>
            <li>{t("**Data Mining**: Scraping or collecting data from the Service without express written permission.")}</li>
            <li>{t("**Minors Safety**: Posting any content that exploits or harms children.")}</li>
          </ul>


          {/* Section 3: Content Ownership and License - ملكية المحتوى */}
          <SectionHeading id="content-ownership">{t("3. Content Ownership and License")}</SectionHeading>
          <p className='mb-4'>
            {t("You retain all ownership rights in the content you post ('Your Content').")}
          </p>
          <p className='font-semibold'>{t("License Grant to Us:")}</p>
          <p className='ml-4'>
            {t("By posting Your Content, you grant us a **worldwide, non-exclusive, royalty-free, sublicensable, and transferable license** to use, display, reproduce, distribute, and modify Your Content in connection with the Service and our business, including for promotion.")}
          </p>

          {/* Section 4: Our Intellectual Property Rights - حقوق الملكية الفكرية للتطبيق (جديد) */}
          <SectionHeading id="ip-rights">{t("4. Our Intellectual Property Rights")}</SectionHeading>
          <p>
            {t("The Service, including its code, design, graphics, trademarks, and all other components (excluding Your Content), are the **exclusive property** of [اسم الشركة/التطبيق]. You may not copy, modify, distribute, or create derivative works of our intellectual property.")}
          </p>

          {/* Section 5: Termination and Suspension - الإنهاء */}
          <SectionHeading id="termination">{t("5. Termination and Suspension")}</SectionHeading>
          <p>
            {t("We reserve the right to **suspend or permanently delete** your account immediately, with or without notice, if we believe you have violated these Terms or engaged in behavior that harms the platform or other users. We are not liable for any loss of data or content upon termination.")}
          </p>

          {/* Section 6: Disclaimer of Warranties (As-Is) - إخلاء المسؤولية (جديد وقانوني حاسم) */}
          <SectionHeading id="warranty">{t("6. Disclaimer of Warranties (As-Is)")}</SectionHeading>
          <p className='p-3 bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500 rounded-md font-medium'>
            {t("THE SERVICE IS PROVIDED ON AN **'AS IS'** AND **'AS AVAILABLE'** BASIS. WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.")}
          </p>

          {/* Section 7: Limitation of Liability and Indemnity - تحديد المسؤولية (جديد وقانوني حاسم) */}
          <SectionHeading id="liability">{t("7. Limitation of Liability and Indemnity")}</SectionHeading>
          <p className='mb-4'>
            {t("TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, [اسم الشركة/التطبيق] SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, ARISING FROM YOUR USE OF THE SERVICE.")}
          </p>
          <p className='font-semibold'>{t("Indemnification:")}</p>
          <p className='ml-4'>
            {t("You agree to **indemnify, defend, and hold harmless** [اسم الشركة/التطبيق] from and against any and all claims, liabilities, damages, losses, and expenses, arising from your breach of these Terms or your violation of any third-party right, including without exclusion any intellectual property or privacy right.")}
          </p>

          {/* Section 8: Governing Law and Disputes - القانون الحاكم (جديد) */}
          <SectionHeading id="governing-law">{t("8. Governing Law and Disputes")}</SectionHeading>
          <p>
            {t("These Terms shall be governed by the laws of **[اسم الدولة/الولاية]**, without regard to its conflict of law provisions. Any dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in **[اسم المدينة/المحكمة]**.")}
          </p>

          {/* Section 9: Changes to Terms - التغييرات */}
          <SectionHeading id="changes">{t("9. Changes to Terms")}</SectionHeading>
          <p>
            {t("We may update these Terms from time to time. We will notify you of any material changes by posting the new Terms on the Service or sending an email, at least **30 days** prior to the effective date. Your continued use of the platform indicates your acceptance of any changes.")}
          </p>

          {/* Section 10: Contact Us - التواصل */}
          <SectionHeading id="contact">{t("10. Contact Us")}</SectionHeading>
          <p>
            {t("If you have any questions about these Terms, please contact us at:")}{" "}
            <a
              href="mailto:support@socialmediaapp.com"
              className="text-blue-600 dark:text-blue-400 font-semibold underline hover:opacity-90 transition"
            >
              support@socialmediaapp.com
            </a>
          </p>
          <p className='mt-2'>
             {t("You can also contact us by mail at:")}
             <br/>
              Zocial
             <br/>
             **[العنوان الفعلي الكامل، مثل: 123 Street Name, City, State, ZIP Code]**
          </p>

        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;