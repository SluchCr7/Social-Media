'use client';
import { generateMeta } from '@/app/utils/MetaDataHelper';
import React from 'react';



const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen w-full bg-lightMode-bg dark:bg-darkMode-bg px-4 md:px-8 py-12 text-lightMode-text dark:text-darkMode-text">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-lightMode-text2 dark:text-darkMode-text2">
          Terms of Service
        </h1>

        <div className="space-y-8 bg-white dark:bg-darkMode-card p-6 md:p-10 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-base leading-7">
            Welcome to our Social Media App. By accessing or using our platform,
            you agree to be bound by the following terms and conditions.
          </p>

          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-lightMode-text2 dark:text-darkMode-text2">
              1. Eligibility
            </h2>
            <p>You must be at least 13 years old to use this platform.</p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-lightMode-text2 dark:text-darkMode-text2">
              2. User Conduct
            </h2>
            <p>
              You agree not to post any content that is illegal, harmful,
              abusive, hateful, or otherwise inappropriate. Harassment, spam,
              and impersonation are strictly prohibited.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-lightMode-text2 dark:text-darkMode-text2">
              3. Account Responsibility
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities under your account.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-lightMode-text2 dark:text-darkMode-text2">
              4. Content Ownership
            </h2>
            <p>
              You retain ownership of your content but grant us a license to
              use, display, and distribute it within the platform.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-lightMode-text2 dark:text-darkMode-text2">
              5. Termination
            </h2>
            <p>
              We reserve the right to suspend or delete your account if you
              violate these terms or engage in harmful behavior.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-lightMode-text2 dark:text-darkMode-text2">
              6. Changes to Terms
            </h2>
            <p>
              We may update these Terms from time to time. Continued use of the
              platform indicates your acceptance of any changes.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-lightMode-text2 dark:text-darkMode-text2">
              7. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at:{' '}
              <a
                href="mailto:support@socialmediaapp.com"
                className="text-blue-600 dark:text-blue-400 underline hover:opacity-90 transition"
              >
                support@socialmediaapp.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
