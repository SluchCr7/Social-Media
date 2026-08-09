'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useReport } from '../../Context/ReportContext';
import { X, ShieldAlert, AlertCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { reasons } from '@/app/utils/Data';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

const AddNewReport = function AddNewReport({
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

  const handleSubmit = async (e) => {
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
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
        onClick={(e) => e.target === e.currentTarget && onClose?.()}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          className="relative w-full max-w-md bg-white dark:bg-[#0B0F1A] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <ShieldAlert size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {title || t("Report Content")}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {t("Help us keep our platform safe")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Reason Select */}
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                {t("Reason for Report")}
              </label>
              <select
                className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-2.5 text-xs sm:text-sm font-semibold outline-none transition-all cursor-pointer"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="">{t("Select a reason...")}</option>
                {reasons.map((r, idx) => (
                  <option key={idx} value={r.value} className="bg-white dark:bg-[#0B0F1A] text-slate-900 dark:text-white">
                    {t(r.label)}
                  </option>
                ))}
              </select>
            </div>

            {/* Details */}
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                {t("Additional Details")} <span className="text-slate-400 font-normal">({t("Optional")})</span>
              </label>
              <textarea
                className="w-full h-24 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-3 text-xs sm:text-sm font-medium placeholder:text-slate-400 outline-none transition-all resize-none"
                placeholder={t("Provide extra context if needed...")}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            {errorMsg && (
              <div className="text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2 bg-rose-50 dark:bg-rose-500/10 p-3 rounded-xl">
                <AlertCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {t("Cancel")}
              </button>
              <Button
                type="submit"
                isLoading={loading}
                className="rounded-xl px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white border-none"
              >
                <Send size={14} className="mr-1.5" />
                {t("Submit Report")}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddNewReport;
