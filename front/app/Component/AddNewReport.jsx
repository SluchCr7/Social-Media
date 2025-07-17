'use client';
import React, { useState } from 'react';
import { useReport } from '../Context/ReportContext';
import { IoClose } from 'react-icons/io5';

const AddNewReport = ({ postId, onClose }) => {
  const { addReport } = useReport();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setErrorMsg('Please enter a report.');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    try {
      await addReport(postId, text);
      setText('');
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err) {
      setErrorMsg('Error adding report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 relative animate-fade-in">
        {/* زر الإغلاق */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
        >
          <IoClose />
        </button>

        {/* العنوان */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Report Post
        </h2>

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full h-32 p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="what's wrong with this post?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2.5 rounded-xl hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? 'Sending Report...' : 'Report Post ...'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewReport;
