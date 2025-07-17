'use client';
import { generateMeta } from '@/app/utils/MetaDataHelper';
import React from 'react';



const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen w-full bg-lightMode-bg dark:bg-darkMode-bg px-4 md:px-8 py-12 text-lightMode-text dark:text-darkMode-text">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-lightMode-text2 dark:text-darkMode-text2">
          Privacy Policy
        </h1>

        <div className="space-y-8 bg-white dark:bg-darkMode-card p-6 md:p-10 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-base leading-7">
            Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our Social Media App.
          </p>

          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-lightMode-text2 dark:text-darkMode-text2">
              1. Information We Collect
            </h2>
            <p>
              We may collect information you provide directly such as name, email, profile picture, posts, messages, and other content. We may also collect IP address, device info, browser type, and usage data automatically.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-lightMode-text2 dark:text-darkMode-text2">
              2. How We Use Your Information
            </h2>
            <p>
              We use your information to operate and improve our platform, personalize your experience, respond to inquiries, and provide customer support. Notifications and updates may also be sent.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-lightMode-text2 dark:text-darkMode-text2">
              3. Sharing of Information
            </h2>
            <p>
              We do not sell your personal information. We may share it with trusted service providers, legal authorities if required, or in case of a business transfer.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-lightMode-text2 dark:text-darkMode-text2">
              4. Data Security
            </h2>
            <p>
              We implement reasonable security measures to protect your data. However, no method of transmission over the internet is completely secure.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-lightMode-text2 dark:text-darkMode-text2">
              5. Your Choices
            </h2>
            <p>
              You may update your profile, delete your account, or request data removal at any time. Contact us for assistance.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-lightMode-text2 dark:text-darkMode-text2">
              6. Changes to This Policy
            </h2>
            <p>
              We may update this policy occasionally. Continued use of the platform means you agree to the updated terms.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-lightMode-text2 dark:text-darkMode-text2">
              7. Contact
            </h2>
            <p>
              If you have any questions regarding our Privacy Policy, please contact us at:{' '}
              <a
                href="mailto:privacy@socialmediaapp.com"
                className="text-blue-600 dark:text-blue-400 underline hover:opacity-90 transition"
              >
                privacy@socialmediaapp.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
