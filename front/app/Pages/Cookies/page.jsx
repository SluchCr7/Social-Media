'use client';
import React from 'react';

const CookiesPolicyPage = () => {
  return (
    <div className="min-h-screen bg-lightMode-bg dark:bg-darkMode-bg p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white dark:bg-darkMode-card rounded-2xl shadow-md p-8 md:p-12">
        <h1 className="text-4xl font-bold mb-6 text-lightMode-text2 dark:text-darkMode-text2">
          Cookies Policy
        </h1>

        <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          We use cookies to improve your experience on our website. This policy explains what cookies are, how we use them, and your choices regarding them.
        </p>

        {/* Section: What are Cookies */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-lightMode-text2 dark:text-darkMode-text2">
            What are Cookies?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Cookies are small text files that are stored on your device when you visit a website. They help us recognize your device, remember your preferences, and provide a personalized experience.
          </p>
        </section>

        {/* Section: How We Use Cookies */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-lightMode-text2 dark:text-darkMode-text2">
            How We Use Cookies
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
            <li>To remember your login details and preferences.</li>
            <li>To improve website performance and usability.</li>
            <li>To analyze website traffic and understand user behavior.</li>
            <li>To deliver personalized content and ads.</li>
          </ul>
        </section>

        {/* Section: Types of Cookies */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-lightMode-text2 dark:text-darkMode-text2">
            Types of Cookies We Use
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
            <li><strong>Essential Cookies:</strong> Required for the website to function properly.</li>
            <li><strong>Performance Cookies:</strong> Help us analyze traffic and improve performance.</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences and settings.</li>
            <li><strong>Advertising Cookies:</strong> Deliver relevant ads based on your interests.</li>
          </ul>
        </section>

        {/* Section: Your Choices */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-lightMode-text2 dark:text-darkMode-text2">
            Your Choices
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
            You can choose to accept or decline cookies. Most browsers automatically accept cookies, but you can modify your browser settings to decline them if you prefer.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Please note that some parts of the website may not function properly if you disable cookies.
          </p>
        </section>

        {/* Section: Contact */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-lightMode-text2 dark:text-darkMode-text2">
            Contact Us
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            If you have any questions about our cookie policy, please contact us at <a href="mailto:support@example.com" className="text-blue-600 dark:text-blue-400 underline">support@example.com</a>.
          </p>
        </section>

        {/* Footer: CTA */}
        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-500 transition font-semibold">
            Accept All Cookies
          </button>
          <button className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold">
            Manage Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookiesPolicyPage;
