'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { useReport } from '../../Context/ReportContext';
import { IoClose } from 'react-icons/io5';
import { reasons } from '@/app/utils/Data';
import { useTranslation } from 'react-i18next';

const AddNewReport = React.memo(function AddNewReport({
  targetId,
  reportedOnType = "post", // "post", "comment", "user"
  onClose,
  title = "Report Item"
}) {
  const { addReport } = useReport();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { t } = useTranslation();

  const tSelectReason = useMemo(() => t("Select a reason..."), [t]);
  const tSubmitReport = useMemo(() => t("Submit Report"), [t]);

  const reasonOptions = useMemo(
    () =>
      reasons.map((r, idx) => (
        <option key={idx} value={r.value}>
          {r.label}
        </option>
      )),
    []
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!reason) {
        setErrorMsg('⚠️ Please select a reason for the report.');
        return;
      }

      setLoading(true);
      setErrorMsg('');

      try {
        await addReport({
          reportedOnType,
          targetId,
          text: details || reason,
          reason,
        });

        setReason('');
        setDetails('');
        onClose?.();
      } catch (err) {
        setErrorMsg(err?.response?.data?.message || '❌ Failed to send report.');
      } finally {
        setLoading(false);
      }
    },
    [reason, details, addReport, reportedOnType, targetId, onClose]
  );

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose?.();
    },
    [onClose]
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-lightMode-bg dark:bg-darkMode-bg
                   border border-lightMode-menu/20 dark:border-darkMode-menu/20
                   rounded-2xl shadow-xl max-w-lg w-full p-6 relative
                   transform transition-all scale-95 animate-fade-in text-lightMode-fg dark:text-darkMode-fg"
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-lightMode-text2 dark:text-darkMode-text2 hover:text-lightMode-text dark:hover:text-darkMode-text text-xl transition"
          onClick={onClose}
        >
          <IoClose />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-lightMode-text dark:text-darkMode-text mb-4 text-center">
          {title}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reason Select */}
          <select
            className="w-full p-3 border border-lightMode-menu/30 dark:border-darkMode-menu/30
                       rounded-xl bg-lightMode-menu dark:bg-darkMode-menu
                       text-lightMode-fg dark:text-darkMode-fg
                       focus:outline-none focus:ring-2
                       focus:ring-lightMode-text/40 dark:focus:ring-darkMode-text/40
                       focus:border-lightMode-text dark:focus:border-darkMode-text
                       transition"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="">{tSelectReason}</option>
            {reasonOptions}
          </select>

          {/* Details */}
          <textarea
            className="w-full h-28 p-4 border border-lightMode-menu/30 dark:border-darkMode-menu/30
                       rounded-xl bg-lightMode-menu dark:bg-darkMode-menu
                       text-lightMode-fg dark:text-darkMode-fg
                       placeholder-gray-400 resize-none
                       focus:outline-none focus:ring-2
                       focus:ring-lightMode-text/40 dark:focus:ring-darkMode-text/40
                       focus:border-lightMode-text dark:focus:border-darkMode-text
                       transition"
            placeholder="Add more details (optional)..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          {errorMsg && (
            <p className="text-red-500 dark:text-red-400 text-sm">{errorMsg}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lightMode-text dark:bg-darkMode-text
                       text-white py-2.5 rounded-xl hover:opacity-90
                       transition disabled:opacity-50 flex items-center justify-center font-semibold"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              tSubmitReport
            )}
          </button>
        </form>
      </div>
    </div>
  );
});
AddNewReport.displayName = 'AddNewReport'
export default AddNewReport;
