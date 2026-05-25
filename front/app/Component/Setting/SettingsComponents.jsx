'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Search, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

// ==========================================
// 1. SettingsLayout
// ==========================================
export const SettingsLayout = React.memo(function SettingsLayout({
  sidebar,
  children,
  isMobileSubpageActive,
  onMobileBack,
  activeTabLabel,
}) {
  return (
    <div className="flex h-screen w-full bg-[#f8fafc] dark:bg-[#030712] text-slate-900 dark:text-slate-100 overflow-hidden font-cairo transition-colors duration-300">
      {/* Sidebar - Visible on desktop, hidden on mobile subpage */}
      <aside
        className={clsx(
          "w-full md:w-80 flex flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#090d16] h-full shrink-0 transition-all duration-300",
          isMobileSubpageActive ? "hidden md:flex" : "flex"
        )}
      >
        {sidebar}
      </aside>

      {/* Main Content Area */}
      <main
        className={clsx(
          "flex-1 flex flex-col h-full overflow-hidden relative",
          !isMobileSubpageActive ? "hidden md:flex" : "flex"
        )}
      >
        {/* Mobile Subpage Header */}
        {isMobileSubpageActive && (
          <header className="flex md:hidden items-center justify-between px-4 h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#090d16]/80 backdrop-blur-md z-40 shrink-0">
            <button
              onClick={onMobileBack}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
            <h1 className="text-sm font-black tracking-tight uppercase select-none">{activeTabLabel}</h1>
            <div className="w-12 h-6" /> {/* Spacer to align title */}
          </header>
        )}

        {/* Dynamic Content Frame with slide-in animation on mobile */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative bg-[#f8fafc] dark:bg-[#030712]">
          <div className="max-w-4xl mx-auto p-4 sm:p-8 lg:p-12 pb-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={isMobileSubpageActive ? 'subpage' : 'main'}
                initial={{ opacity: 0, x: isMobileSubpageActive ? 20 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
});

// ==========================================
// 2. SettingsSidebar
// ==========================================
export const SettingsSidebar = React.memo(function SettingsSidebar({
  sections = [],
  activeTab,
  onTabSelect,
  searchQuery,
  setSearchQuery,
  user,
  darkMode,
  toggleTheme,
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full select-none">
      {/* Console Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h1.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-1.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.936 6.936 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest">{t('Control Center')}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">threads v2.4.0</p>
          </div>
        </div>

        {/* Live Search */}
        <div className="relative mb-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={15} />
          <input
            type="text"
            placeholder={t('Search settings...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl pl-9 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Nav List grouped dynamically */}
      <nav className="flex-1 px-3 space-y-5 overflow-y-auto no-scrollbar pb-6">
        {sections.map((section, idx) => {
          const visibleTabs = section.tabs.filter((tab) =>
            t(tab.label).toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (visibleTabs.length === 0) return null;

          return (
            <div key={idx} className="space-y-1">
              <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 select-none">
                {t(section.title)}
              </p>
              {visibleTabs.map((tab) => {
                const Icon = tab.lucideIcon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabSelect(tab.id)}
                    className={clsx(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group text-left",
                      isActive
                        ? "bg-slate-100 dark:bg-slate-800/70 text-indigo-600 dark:text-indigo-400 font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/30 hover:text-slate-900 dark:hover:text-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={clsx(
                          "p-1.5 rounded-lg transition-colors duration-200",
                          isActive
                            ? "bg-indigo-50/80 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                            : "bg-transparent text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400"
                        )}
                      >
                        {Icon ? <Icon size={18} /> : null}
                      </div>
                      <span className="text-xs font-bold truncate tracking-wide">
                        {t(tab.label)}
                      </span>
                    </div>
                    <ChevronRight
                      size={14}
                      className={clsx(
                        "opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all",
                        isActive && "opacity-100 text-indigo-600 dark:text-indigo-400 translate-x-0.5"
                      )}
                    />
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer Profile Toggle */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/10">
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-[#0c1220] shadow-sm">
          {user?.profilePhoto?.url ? (
            <img
              src={user.profilePhoto.url}
              alt="Avatar"
              className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-800/80"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white text-xs font-bold ring-1 ring-slate-200 dark:ring-slate-800/80">
              {user?.username?.slice(0, 2).toUpperCase() || 'US'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black truncate text-slate-800 dark:text-slate-200 leading-tight">
              {user?.username || 'Username'}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold truncate mt-0.5">
              @{user?.profileName || 'user'}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="w-7 h-7 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Toggle Theme"
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

// ==========================================
// 3. SettingsSection
// ==========================================
export function SettingsSection({ title, description, children }) {
  const { t } = useTranslation();

  return (
    <section className="space-y-6">
      {/* Title & Desc Header */}
      <div className="pb-5 border-b border-slate-200/80 dark:border-slate-800/80">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 uppercase">{t(title)}</h2>
        {description && (
          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1.5">
            {t(description)}
          </p>
        )}
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

// ==========================================
// 4. SettingsCard
// ==========================================
export function SettingsCard({ title, description, icon: Icon, children, className, onClick }) {
  const { t } = useTranslation();

  const isClickable = !!onClick;
  const CardWrapper = isClickable ? 'button' : 'div';

  return (
    <CardWrapper
      onClick={onClick}
      className={clsx(
        "w-full text-left rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden group select-none",
        isClickable && "hover:border-indigo-500 dark:hover:border-indigo-400/50 hover:shadow-md transition-all active:scale-[0.99] cursor-pointer",
        className
      )}
    >
      <div className="flex gap-4 items-start min-w-0">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 group-hover:scale-105 transition-transform duration-300">
            <Icon size={18} />
          </div>
        )}
        <div className="space-y-1 min-w-0">
          {title && (
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide leading-tight">
              {t(title)}
            </h3>
          )}
          {description && (
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">
              {t(description)}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center shrink-0 w-full md:w-auto md:justify-end">{children}</div>
    </CardWrapper>
  );
}

// ==========================================
// 5. ToggleSwitch
// ==========================================
export const ToggleSwitch = React.memo(function ToggleSwitch({ checked, onChange, onColor = 'bg-indigo-600' }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none shrink-0 cursor-pointer shadow-inner",
        checked ? onColor : 'bg-slate-200 dark:bg-slate-800'
      )}
    >
      <motion.div
        animate={{ x: checked ? 22 : 2 }}
        initial={false}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        className="absolute top-1 left-0 w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center pointer-events-none"
      />
    </button>
  );
});

// ==========================================
// 6. InputField
// ==========================================
export const InputField = React.memo(function InputField({
  label,
  description,
  error,
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  className,
}) {
  const { t } = useTranslation();

  return (
    <div className={clsx("space-y-2 w-full select-none", className)}>
      {label && (
        <div className="flex flex-col">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {t(label)} {required && <span className="text-rose-500">*</span>}
          </span>
          {description && (
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
              {t(description)}
            </span>
          )}
        </div>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors duration-200 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400">
            <Icon size={16} />
          </div>
        )}
        <input
          type={type}
          placeholder={t(placeholder)}
          value={value}
          onChange={onChange}
          required={required}
          className={clsx(
            "w-full h-11 bg-white dark:bg-slate-900 border text-xs font-semibold outline-none rounded-xl transition-all duration-200",
            Icon ? "pl-10 pr-4" : "px-4",
            error
              ? "border-rose-400 dark:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 focus:border-rose-500 text-rose-600 dark:text-rose-400"
              : "border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-800 dark:text-slate-200"
          )}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] text-rose-500 font-bold uppercase tracking-wider pl-1.5"
        >
          {t(error)}
        </motion.p>
      )}
    </div>
  );
});

// ==========================================
// 7. SelectDropdown
// ==========================================
export const SelectDropdown = React.memo(function SelectDropdown({
  label,
  description,
  options = [],
  value,
  onChange,
}) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2 w-full select-none">
      {label && (
        <div className="flex flex-col">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {t(label)}
          </span>
          {description && (
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
              {t(description)}
            </span>
          )}
        </div>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none rounded-xl focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-800 dark:text-slate-200 transition-all cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#090d16]">
            {t(opt.label || opt.name)}
          </option>
        ))}
      </select>
    </div>
  );
});

// ==========================================
// 8. Buttons
// ==========================================
export function PrimaryButton({ children, onClick, type = 'button', disabled = false, className }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "px-6 h-11 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer active:scale-98 select-none flex items-center justify-center gap-2",
        className
      )}
    >
      {children}
    </button>
  );
}

export function DangerButton({ children, onClick, type = 'button', disabled = false, className }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "px-6 h-11 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-rose-600/10 cursor-pointer active:scale-98 select-none flex items-center justify-center gap-2",
        className
      )}
    >
      {children}
    </button>
  );
}

// ==========================================
// 9. ConfirmationModal
// ==========================================
export const ConfirmationModal = React.memo(function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
}) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm"
        />

        {/* Modal body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", duration: 0.35 }}
          className="relative w-full max-w-md bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 overflow-hidden space-y-6 z-10"
        >
          {/* Top Banner Alert */}
          <div className="flex gap-4">
            <div
              className={clsx(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                type === 'danger'
                  ? "bg-rose-50 dark:bg-rose-500/10 text-rose-500"
                  : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500"
              )}
            >
              <AlertTriangle size={20} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-black uppercase text-slate-800 dark:text-slate-100 tracking-wide leading-tight">
                {t(title)}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {t(message)}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-5 h-10 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
            >
              {t(cancelText)}
            </button>
            {type === 'danger' ? (
              <DangerButton onClick={onConfirm} className="h-10 px-5">
                {t(confirmText)}
              </DangerButton>
            ) : (
              <PrimaryButton onClick={onConfirm} className="h-10 px-5">
                {t(confirmText)}
              </PrimaryButton>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});
