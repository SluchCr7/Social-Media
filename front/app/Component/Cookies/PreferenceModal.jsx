'use client';
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion , AnimatePresence } from "framer-motion";
import { Settings, X } from "lucide-react";
import Toggle from "./Toggle";

const PreferenceModal = ({ open, onClose, prefs, setPrefs ,COOKIE_PREF_KEY}) => {
  const { t } = useTranslation();
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={modalRef}
            initial={{ y: 20, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 10, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="relative max-w-2xl w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200/30 dark:border-gray-700/40 rounded-2xl shadow-2xl p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Settings className="w-7 h-7 text-indigo-600 dark:text-indigo-300" />
                <div>
                  <h3 className="text-lg font-semibold">{t("Manage Cookie Preferences")}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                    {t("Choose which cookie categories you want to allow. You can always change these later.")}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label={t("Close preferences")}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              <Toggle
                label={t("Essential Cookies")}
                description={t("Required for basic functionality and security (cannot be disabled).")}
                checked={true}
                onChange={() => {}}
              />
              <Toggle
                label={t("Analytics Cookies")}
                description={t("Help us measure and improve the product experience.")}
                checked={prefs.analytics}
                onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
              />
              <Toggle
                label={t("Marketing Cookies")}
                description={t("Used to show relevant content and ads.")}
                checked={prefs.marketing}
                onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
              />

              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => {
                    localStorage.setItem(COOKIE_PREF_KEY, JSON.stringify(prefs));
                    onClose();
                  }}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow"
                >
                  {t("Save Preferences")}
                </button>
                <button
                  onClick={() => {
                    setPrefs({ analytics: false, marketing: false });
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  {t("Reset")}
                </button>
                <button
                  onClick={() => {
                    const all = { analytics: true, marketing: true };
                    setPrefs(all);
                    localStorage.setItem(COOKIE_PREF_KEY, JSON.stringify(all));
                    onClose();
                  }}
                  className="ml-auto text-sm text-gray-500 underline"
                >
                  {t("Accept All")}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                {t("Note: Essential cookies are always active to ensure the site works properly.")}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PreferenceModal;