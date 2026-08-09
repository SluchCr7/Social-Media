'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  User, 
  MapPin, 
  Globe, 
  Phone, 
  Camera, 
  Check, 
  Plus, 
  Calendar,
  Languages,
  Heart
} from 'lucide-react';
import { useUser } from '@/app/Context/UserContext';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4 pt-4 border-t border-slate-200/80 dark:border-white/10 first:border-t-0 first:pt-0">
    <Icon size={16} className="text-slate-400" />
    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</h3>
  </div>
);

const InputGroup = ({ label, name, value, onChange, placeholder, icon: Icon, type = "text" }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">{label}</label>
    <div className="relative">
      {Icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Icon size={16} />
        </span>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl py-2.5 ${Icon ? 'pl-9' : 'pl-3'} pr-3 text-xs sm:text-sm font-medium outline-none transition-all`}
      />
    </div>
  </div>
);

const UpdateProfile = ({ user }) => {
  const { updateProfile, updateProfileLoading, updatePhoto, updateCoverPhoto } = useUser();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    username: '',
    profileName: '',
    description: '',
    country: '',
    phone: '',
    city: '',
    gender: '',
    relationshipStatus: '',
    partner: '',
    dateOfBirth: '',
    interests: [],
    newInterest: '',
    preferedLanguage: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      facebook: '',
      website: '',
    },
  });

  useEffect(() => {
    if (!user) return;
    setFormData({
      username: user.username || '',
      profileName: user.profileName || '',
      description: user.description || '',
      country: user.country || '',
      phone: user.phone || '',
      city: user.city || '',
      gender: user.gender || '',
      relationshipStatus: user.relationshipStatus || '',
      partner: user.partner?._id || user.partner || '',
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      interests: user.interests || [],
      preferedLanguage: user.preferedLanguage || '',
      socialLinks: {
        github: user.socialLinks?.github || '',
        linkedin: user.socialLinks?.linkedin || '',
        twitter: user.socialLinks?.twitter || '',
        facebook: user.socialLinks?.facebook || '',
        website: user.socialLinks?.website || '',
      },
      newInterest: '',
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['github', 'linkedin', 'twitter', 'facebook', 'website'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [name]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    delete payload.newInterest;
    await updateProfile(payload);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Form Area */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('Edit Profile')}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{t('Manage your public profile settings')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Visuals */}
            <section>
              <SectionHeader icon={Camera} title={t('Visuals')} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col items-center gap-3 p-4 bg-slate-50 dark:bg-white/[0.02] rounded-xl border border-slate-200/80 dark:border-white/10 relative group">
                  <Avatar src={user?.profilePhoto?.url} size="xl" className="ring-2 ring-white dark:ring-black" />
                  <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-black/40 rounded-xl">
                    <Plus className="text-white" size={24} />
                    <input type="file" className="hidden" onChange={(e) => updatePhoto(e.target.files[0])} />
                  </label>
                  <div className="text-center">
                    <p className="font-bold text-xs">{t('Profile Photo')}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{t('Click to change')}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 p-4 bg-slate-50 dark:bg-white/[0.02] rounded-xl border border-slate-200/80 dark:border-white/10 relative group">
                  <div className="relative w-full h-24 rounded-lg overflow-hidden bg-slate-200 dark:bg-white/10">
                    {user?.coverPhoto?.url && (
                      <Image src={user.coverPhoto.url} fill className="object-cover" alt="Cover" />
                    )}
                    <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-black/40">
                      <Plus className="text-white" size={24} />
                      <input type="file" className="hidden" onChange={(e) => updateCoverPhoto(e.target.files[0])} />
                    </label>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-xs">{t('Cover Photo')}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{t('Click to change')}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Identity */}
            <section>
              <SectionHeader icon={User} title={t('Identity')} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup 
                  label={t('Username')} 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  icon={User} 
                />
                <InputGroup 
                  label={t('Display Name')} 
                  name="profileName" 
                  value={formData.profileName} 
                  onChange={handleChange} 
                  icon={Check} 
                />
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t('Bio')}</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-3 text-xs sm:text-sm font-medium h-24 resize-none outline-none transition-all"
                    placeholder={t('Tell us about yourself...')}
                  />
                </div>
              </div>
            </section>

            {/* Personal Details */}
            <section>
              <SectionHeader icon={Heart} title={t('Personal')} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup 
                  label={t('Date of Birth')} 
                  name="dateOfBirth" 
                  type="date"
                  value={formData.dateOfBirth} 
                  onChange={handleChange} 
                  icon={Calendar} 
                />
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t('Gender')}</label>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange}
                    className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold outline-none transition-all cursor-pointer"
                  >
                    <option value="">{t('Select')}</option>
                    <option value="Male">{t('Male')}</option>
                    <option value="Female">{t('Female')}</option>
                    <option value="Other">{t('Other')}</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Location & Language */}
            <section>
              <SectionHeader icon={MapPin} title={t('Location & Contact')} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup label={t('Country')} name="country" value={formData.country} onChange={handleChange} icon={Globe} />
                <InputGroup label={t('City')} name="city" value={formData.city} onChange={handleChange} icon={MapPin} />
                <InputGroup label={t('Language')} name="preferedLanguage" value={formData.preferedLanguage} onChange={handleChange} icon={Languages} />
                <InputGroup label={t('Phone')} name="phone" value={formData.phone} onChange={handleChange} icon={Phone} />
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex justify-end pt-4 border-t border-slate-200/80 dark:border-white/10">
              <Button 
                type="submit" 
                isLoading={updateProfileLoading}
                className="rounded-xl px-6 py-2.5 text-xs font-bold"
              >
                {t('Save Changes')}
              </Button>
            </div>
          </form>
        </div>

        {/* Live Preview Sidebar */}
        <div className="lg:w-72 space-y-4">
          <div className="sticky top-6 bg-slate-50/60 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 flex flex-col items-center space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('Live Preview')}</h2>
            <div className="w-full space-y-3 flex flex-col items-center text-center">
              <Avatar src={user?.profilePhoto?.url} size="xl" className="ring-4 ring-white dark:ring-black shadow-md" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{formData.profileName || user?.profileName}</h3>
                <p className="text-xs text-slate-500 font-medium">@{formData.username || user?.username}</p>
              </div>
              <div className="w-full h-px bg-slate-200/80 dark:bg-white/10" />
              <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                &quot;{formData.description || t('No bio provided yet.')}&quot;
              </p>
              
              <div className="grid grid-cols-2 gap-2 w-full pt-2">
                <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-center">
                  <p className="text-[10px] font-bold text-slate-400">{t('Followers')}</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{user?.followers?.length || 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-center">
                  <p className="text-[10px] font-bold text-slate-400">{t('Following')}</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{user?.following?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
