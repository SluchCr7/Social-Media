'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useReport } from '../../Context/ReportContext';
import { HiXMark, HiExclamationTriangle, HiPaperAirplane } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { reasons } from '@/app/utils/Data';
import { useTranslation } from 'react-i18next';

const AddNewReport = React.memo(function AddNewReport({
  targetId,
  reportedOnType = "post",
  onClose,
  title = "Report Item"
}) {
  const { addReport } = useReport();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { t } = useTranslation();

  const reasonOptions = useMemo(
    () => reasons.map((r, idx) => (
      <option key={idx} value={r.value} className="bg-white dark:bg-[#0A0A0A]">
        {r.label}
      </option>
    )),
    []
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!reason) {
        setErrorMsg(t('Please select a reason for the report.'));
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
        setErrorMsg(err?.response?.data?.message || t('Failed to send report.'));
      } finally {
        setLoading(false);
      }
    },
    [reason, details, addReport, reportedOnType, targetId, onClose, t]
  );

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose?.()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white/95 dark:bg-[#0A0A0A]/98 backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-[3rem] shadow-2xl max-w-lg w-full p-10 relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50" />

          {/* Close Button */}
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            onClick={onClose}
          >
            <HiXMark className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center">
              <HiExclamationTriangle className="w-7 h-7 text-rose-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
                {title}
              </h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">
                {t("Flag Content")}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Reason Select */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">
                {t("Violation Type")}
              </label>
              <select
                className="w-full p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all appearance-none cursor-pointer"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="" className="bg-white dark:bg-[#0A0A0A]">{t("Select a reason...")}</option>
                {reasonOptions}
              </select>
            </div>

            {/* Details */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">
                {t("Additional Details")} ({t("Optional")})
              </label>
              <textarea
                className="w-full h-32 p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all font-medium"
                placeholder={t("Provide more context...")}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            {errorMsg && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-rose-500 text-sm font-bold flex items-center gap-2 bg-rose-500/10 p-3 rounded-xl"
              >
                <HiExclamationTriangle className="w-4 h-4" />
                {errorMsg}
              </motion.p>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-rose-500/30"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("Submitting")}...
                </>
              ) : (
                <>
                  <HiPaperAirplane className="w-5 h-5" />
                  {t("Submit Report")}
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

AddNewReport.displayName = 'AddNewReport';
export default AddNewReport;
