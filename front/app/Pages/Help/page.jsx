'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { TOPICS, FAQ } from '@/app/utils/Data';
import HelpPresentationPage from './HelpPresentationPage';
import ContactModal from '@/app/Component/ContactForm';

// =================================================================
// HelpCenter Component — Improved for readability & performance
// =================================================================

export default function HelpCenter() {
  // -------------------- State --------------------
  const [query, setQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [contactData, setContactData] = useState({ email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  // -------------------- Derived Data --------------------
  const filteredTopics = useMemo(() => 
    TOPICS.filter(
      (t) =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.desc.toLowerCase().includes(query.toLowerCase())
    ),
  [query]);

  const finalFaq = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    return FAQ.filter((f) => {
      const topicMatch = !selectedTopic || f.topicKey === selectedTopic;
      const queryMatch =
        f.q.toLowerCase().includes(lowerQuery) ||
        f.a.toLowerCase().includes(lowerQuery);
      return query ? queryMatch : topicMatch;
    }).slice(0, 10);
  }, [query, selectedTopic]);

  // -------------------- Handlers --------------------
  const handleContactSubmit = useCallback((e) => {
    e.preventDefault();
    setTimeout(() => setSent(true), 700);
  }, []);

  const handleChange = useCallback((field, value) => {
    setContactData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // -------------------- Render --------------------
  return (
    <>
      <HelpPresentationPage
        finalFaq={finalFaq}
        filteredTopics={filteredTopics}
        showContact={showContact}
        setShowContact={setShowContact}
        openFaq={openFaq}
        setOpenFaq={setOpenFaq}
        setQuery={setQuery}
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
        query={query}
        contactData={contactData}
        handleChange={handleChange}
        handleContactSubmit={handleContactSubmit}
        sent={sent}
      />
      <ContactModal show={showContact} setShow={setShowContact} sent={sent} setSent={setSent} />
    </>
  );
}
