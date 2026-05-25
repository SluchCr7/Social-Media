'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LifeBuoy, MessageSquare, ShieldAlert, FileText, ChevronRight, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SettingsSection } from '@/app/Component/Setting/SettingsComponents';

const HelpTab = React.memo(() => {
  const { t } = useTranslation();

  const helpLinks = [
    {
      id: 'support',
      title: t('Help Center'),
      desc: t('Get help with using our features and tools.'),
      icon: LifeBuoy,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      id: 'report',
      title: t('Report a Problem'),
      desc: t('Something not working? Let us know.'),
      icon: MessageSquare,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    {
      id: 'safety',
      title: t('Safety Center'),
      desc: t('Learn how we keep our community safe.'),
      icon: ShieldAlert,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      id: 'terms',
      title: t('Legal & Terms'),
      desc: t('Review our Terms of Service and Privacy Policy.'),
      icon: FileText,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
  ];

  return (
    <SettingsSection
      title="Support Core"
      description="Resources & assistance channels"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none">
        
        {/* Links Grid */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <HelpCircle size={18} className="text-indigo-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{t('Directory')}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {helpLinks.map((link) => (
              <motion.button
                key={link.id}
                whileHover={{ y: -2 }}
                className="flex flex-col items-start p-5 rounded-xl bg-slate-50/50 dark:bg-slate-900/10 border border-slate-200/60 dark:border-slate-800/80 shadow-sm group hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all text-left relative overflow-hidden cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl ${link.bg} ${link.color} flex items-center justify-center mb-5 transition-transform group-hover:scale-105`}>
                  <link.icon size={18} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wide text-slate-800 dark:text-slate-250 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-450 transition-colors">
                  {link.title}
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed max-w-[180px]">
                  {link.desc}
                </p>
                <div className="absolute top-5 right-5 w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500 transition-all">
                  <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* FAQ Promo */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="p-6 rounded-2xl bg-indigo-600 dark:bg-indigo-950 text-white shadow-sm relative overflow-hidden flex flex-col justify-between h-full min-h-[260px]">
            <div className="absolute -top-6 -right-6 p-4 opacity-10 text-white select-none pointer-events-none">
              <HelpCircle size={100} className="-rotate-12" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white/15 dark:bg-white/10 flex items-center justify-center text-white">
                <MessageSquare size={20} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-wider">
                {t('Quick Resolution')}
              </h4>
              <p className="text-xs font-semibold leading-relaxed opacity-85">
                {t('Consult our comprehensive database of frequently asked questions for immediate answers.')}
              </p>
            </div>
            <button className="relative z-10 w-full h-11 bg-white hover:bg-slate-50 text-indigo-600 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center">
              {t('Access FAQ')}
            </button>
          </div>

          <div className="text-center pb-2 select-none">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Threads V2 • Core 2.4.0
            </p>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
});

HelpTab.displayName = 'HelpTab';
export default HelpTab;
