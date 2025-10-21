'use client';
import React, { useState, useMemo } from 'react';
import { TOPICS, FAQ } from '@/app/utils/Data';
import HelpPresentationPage from './HelpPresentationPage';
// =================================================================
// 2. HelpCenter Component
// =================================================================

export default function HelpCenter() {
  
  const [query, setQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [contactData, setContactData] = useState({ email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const filteredTopics = TOPICS.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.desc.toLowerCase().includes(query.toLowerCase())
  );

  const finalFaq = useMemo(() => {
    return FAQ.filter((f) => {
      const topicMatch = !selectedTopic || f.topicKey === selectedTopic;
      const queryMatch =
        f.q.toLowerCase().includes(query.toLowerCase()) ||
        f.a.toLowerCase().includes(query.toLowerCase());
      if (query) return queryMatch;
      return topicMatch;
    }).slice(0, 10);
  }, [query, selectedTopic]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setSent(true);
    }, 700);
  };

  return (
    <HelpPresentationPage
      finalFaq={finalFaq} filteredTopics={filteredTopics}showContact={showContact}
      setShowContact={setShowContact} openFaq={openFaq} setOpenFaq={setOpenFaq} setQuery={setQuery} selectedTopic={selectedTopic}
      setSelectedTopic={setSelectedTopic} query={query}
    />
  );
}
