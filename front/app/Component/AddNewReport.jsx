'use client';
import React, { useState } from 'react';
import { useReport } from '../Context/ReportContext';
import { IoClose } from 'react-icons/io5';

const AddNewReport = ({ postId, onClose, title = "Report Post" }) => {
  const { addReport } = useReport();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const reasons = [
    'Spam',
    'Inappropriate Content',
    'Harassment or Hate Speech',
    'Misinformation',
    'Copyright Violation',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason) {
      setErrorMsg('⚠️ Please select a reason for the report.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await addReport(postId, details, reason);
      setReason('');
      setDetails('');
      onClose?.();
    } catch (err) {
      setErrorMsg('❌ Failed to send report.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 relative transform transition-all scale-95 animate-fade-in">
        {/* زر الإغلاق */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
        >
          <IoClose />
        </button>

        {/* العنوان */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {title}
        </h2>

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* قائمة الأسباب */}
          <select
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="">Select a reason...</option>
            {reasons.map((r, idx) => (
              <option key={idx} value={r}>
                {r}
              </option>
            ))}
          </select>

          {/* التفاصيل */}
          <textarea
            className="w-full h-28 p-4 border border-gray-300 rounded-xl resize-none 
                       focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Add more details (optional)..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2.5 rounded-xl hover:bg-red-700 
                       transition disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              "Report Post"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewReport;
