'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useReport } from '../../Context/ReportContext';
import { X, AlertTriangle, Send, ShieldAlert, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { reasons } from '@/app/utils/Data';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

const AddNewReport = React.memo(function AddNewReport({
  targetId,
  reportedOnType = "post",
  onClose,
  title
}) {
  const { addReport } = useReport();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { t } = useTranslation();

  const reasonOptions = useMemo(
    () => reasons.map((r, idx) => (
      <option key={idx} value={r.value} className="bg-white dark:bg-black">
        {t(r.label)}
      </option>
    )),
    [t]
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
        className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose?.()}
      >
        <motion.div
          initial={{ scale: 0.98, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.98, opacity: 0, y: 10 }}
          className="relative w-full max-w-lg bg-white dark:bg-black border border-gray-100 dark:border-threads-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/5 flex items-center justify-center text-red-500">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  {title || t("Report Item")}
                </h2>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest opacity-60">
                  {t("Safety First")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-all"
            >
              <X size={22} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Reason Select */}
            <div className="space-y-4">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">
                {t("Violation Type")}
              </label>
              <div className="relative group">
                <select
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-threads-border rounded-2xl p-4 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all appearance-none cursor-pointer outline-none"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="" className="bg-white dark:bg-black">{t("Select a reason...")}</option>
                  {reasonOptions}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors">
                  <AlertTriangle size={18} />
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">
                {t("Additional Details")} <span className="opacity-50 lowercase font-normal italic">({t("Optional")})</span>
              </label>
              <textarea
                className="w-full h-32 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-threads-border rounded-2xl p-4 text-[15px] font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all outline-none resize-none"
                placeholder={t("Provide more context to help us understand...")}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs font-bold flex items-center gap-3 bg-red-50 dark:bg-red-500/5 p-4 rounded-2xl border border-red-100 dark:border-red-500/10"
              >
                <AlertTriangle size={16} />
                {errorMsg}
              </motion.div>
            )}

            {/* Actions */}
            <div className="pt-2 flex gap-4">
               <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white font-semibold text-sm transition-colors"
              >
                {t("Cancel")}
              </button>
              <Button
                type="submit"
                isLoading={loading}
                className="flex-1 rounded-full py-4 text-sm font-bold tracking-tight bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20"
              >
                <Send size={18} className="mr-2" />
                {t("Submit Report")}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

AddNewReport.displayName = 'AddNewReport';
export default AddNewReport;
