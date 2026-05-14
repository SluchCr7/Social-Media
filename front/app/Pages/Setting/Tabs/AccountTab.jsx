import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCircle, 
  Trash2, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  Eye, 
  ExternalLink,
  Shield,
  Fingerprint,
  Zap,
  Download
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PrimaryToggle from '@/app/Component/Setting/PrimaryToggle';
import { useFeedback } from '@/app/Context/FeedbackContext';
import { Avatar } from '@/app/Component/ui/Avatar';

const AccountTab = React.memo(({
  user,
  isVerified,
  setIsVerified,
  onMakePremiumVerify,
  onTogglePrivate,
  onToggleShowOnlineStatus,
  handleDelete
}) => {
  const { t } = useTranslation();
  const { confirmAction } = useFeedback();

  const handleVerifyToggle = useCallback(
    (v) => {
      setIsVerified(v);
      onMakePremiumVerify(v);
    },
    [setIsVerified, onMakePremiumVerify]
  );

  const handleDeleteRequest = async () => {
    const isConfirmed = await confirmAction({
      title: t('Delete Account'),
      text: t('This will permanently delete your user profile and all associated data. This action cannot be undone.'),
      confirmButtonText: t('Delete My Data'),
      cancelButtonText: t('Go Back'),
      type: 'danger'
    });

    if (isConfirmed) {
      handleDelete();
    }
  };

  return (
    <motion.section
      key="account"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-gray-100 dark:border-threads-border">
        <Avatar src={user?.profilePhoto?.url} size="xl" className="ring-8 ring-gray-50 dark:ring-white/5" />
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-3xl font-black tracking-tighter uppercase">{t('Account Governance')}</h2>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-[0.2em]">
            {t('Manage your digital identity & credentials')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Verification Card */}
        <div className="group p-8 rounded-[2rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-threads-border hover:border-amber-500/30 transition-all duration-500">
          <div className="flex items-center justify-between mb-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>
            <div className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest">
              {isVerified ? t('Verified') : t('Standard')}
            </div>
          </div>
          <h3 className="text-lg font-black uppercase mb-3 tracking-tight">{t('Elite Verification')}</h3>
          <p className="text-xs text-gray-400 font-medium leading-relaxed mb-8">
            {t('Gain trust with a verification badge and priority signal rankings across the network.')}
          </p>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-black border border-gray-100 dark:border-threads-border">
            <span className="text-[13px] font-bold">{t('Identity Status')}</span>
            <PrimaryToggle
              checked={isVerified}
              onChange={handleVerifyToggle}
              onColor="bg-amber-500"
            />
          </div>
        </div>

        {/* Privacy Card */}
        <div className="group p-8 rounded-[2rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Shield size={120} />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-8">
              <Lock size={28} />
            </div>
            <h3 className="text-lg font-black uppercase mb-8 tracking-tight">{t('Privacy Control')}</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 backdrop-blur-md">
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold">{t('Private Account')}</span>
                  <span className="text-[10px] opacity-60">{t('Restricts profile access')}</span>
                </div>
                <PrimaryToggle
                  checked={user?.isPrivate || false}
                  onChange={() => onTogglePrivate()}
                  onColor="bg-white/30"
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 backdrop-blur-md">
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold">{t('Signal Pulse')}</span>
                  <span className="text-[10px] opacity-60">{t('Broadcast activity status')}</span>
                </div>
                <PrimaryToggle
                  checked={user?.showOnlineStatus !== false}
                  onChange={() => onToggleShowOnlineStatus()}
                  onColor="bg-white/30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data Export */}
        <div className="md:col-span-2 p-8 rounded-[2rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-threads-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
               <Download size={20} />
             </div>
             <div>
               <h4 className="text-sm font-black uppercase tracking-tight">{t('Account Archive')}</h4>
               <p className="text-xs text-gray-400 font-medium">{t('Download your personal data archive for portability.')}</p>
             </div>
          </div>
          <button className="w-full md:w-auto px-6 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-threads-border text-xs font-black uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            {t('Request Data')}
            <ExternalLink size={14} />
          </button>
        </div>

        {/* Danger Zone */}
        <div className="md:col-span-2">
           <div className="p-10 rounded-[2.5rem] bg-red-500/5 border border-red-500/20 text-center space-y-8">
              <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                <Trash2 size={32} />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-xl font-black text-red-500 uppercase tracking-tighter">{t('Account Termination')}</h3>
                <p className="text-xs text-red-500/60 font-medium leading-relaxed">
                  {t('Deleting your account is permanent. All posts, media, and data will be liquidated instantly.')}
                </p>
              </div>
              <button 
                onClick={handleDeleteRequest}
                className="px-10 py-4 rounded-2xl bg-red-600 text-white text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20"
              >
                {t('Terminate My Presence')}
              </button>
           </div>
        </div>
      </div>
    </motion.section>
  );
});

AccountTab.displayName = 'AccountTab';
export default AccountTab;
