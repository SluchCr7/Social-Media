import React from 'react';
import { motion } from 'framer-motion';
import { 
  LifeBuoy, 
  MessageSquare, 
  ShieldAlert, 
  FileText, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
        <motion.section
            key="help"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="space-y-12"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-gray-100 dark:border-threads-border">
                <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                    <LifeBuoy size={40} />
                </div>
                <div className="text-center md:text-left space-y-2">
                    <h2 className="text-3xl font-black tracking-tighter uppercase">{t('Support Core')}</h2>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-[0.2em]">
                        {t('Resources & assistance channels')}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Links Grid */}
                <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-threads-border space-y-6">
                   <div className="flex items-center gap-3 mb-2">
                     <HelpCircle size={20} className="text-indigo-500" />
                     <h3 className="text-sm font-black uppercase tracking-widest">{t('Directory')}</h3>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {helpLinks.map((link) => (
                           <motion.button
                               key={link.id}
                               whileHover={{ scale: 1.02 }}
                               whileTap={{ scale: 0.98 }}
                               className="flex flex-col items-start p-6 rounded-[2rem] bg-white dark:bg-black border border-gray-100 dark:border-threads-border shadow-sm group hover:border-indigo-500/30 transition-all text-left relative overflow-hidden"
                           >
                               <div className={`w-12 h-12 rounded-2xl ${link.bg} ${link.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                                   <link.icon size={20} />
                               </div>
                               <h3 className="text-[13px] font-black uppercase tracking-widest mb-1 group-hover:text-indigo-500 transition-colors">
                                   {link.title}
                               </h3>
                               <p className="text-[10px] text-gray-400 font-medium leading-relaxed max-w-[200px]">
                                   {link.desc}
                               </p>
                               <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                 <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                               </div>
                           </motion.button>
                       ))}
                   </div>
                </div>

                {/* FAQ Promo */}
                <div className="space-y-6">
                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden flex flex-col h-full justify-between">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <HelpCircle size={120} className="-rotate-12" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                <MessageSquare size={24} />
                            </div>
                            <h4 className="text-lg font-black uppercase tracking-tighter">
                                {t('Quick Resolution')}
                            </h4>
                            <p className="text-xs font-medium leading-relaxed opacity-90 max-w-[200px]">
                                {t('Consult our comprehensive database of frequently asked questions for immediate answers.')}
                            </p>
                        </div>
                        <button className="relative z-10 mt-8 w-full py-4 bg-white text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-xl">
                            {t('Access FAQ')}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                            Threads V2 • Core 2.4.0
                        </p>
                    </div>
                </div>
            </div>
        </motion.section>
    );
});

HelpTab.displayName = 'HelpTab';
export default HelpTab;
