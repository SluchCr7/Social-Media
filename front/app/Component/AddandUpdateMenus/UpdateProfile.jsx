'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  X, 
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
import {
  FaGithub, FaLinkedin, FaTwitter, FaFacebook,
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useUser } from '@/app/Context/UserContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-6 pt-4 border-t border-gray-100 dark:border-white/5 first:border-t-0 first:pt-0">
    <Icon size={18} className="text-gray-400" />
    <h3 className="text-[13px] font-bold uppercase tracking-widest text-gray-400">{title}</h3>
  </div>
);

const InputGroup = ({ label, name, value, onChange, placeholder, icon: Icon, type = "text" }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 ml-1">{label}</label>
    <div className="relative group">
      {Icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
          <Icon size={18} />
        </span>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-threads-border rounded-xl py-3 ${Icon ? 'pl-11' : 'pl-4'} pr-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all outline-none`}
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

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (['github', 'linkedin', 'twitter', 'facebook', 'website'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [name]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleAddInterest = () => {
    const interest = formData.newInterest.trim();
    if (interest && !formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest],
        newInterest: ''
      }));
    }
  };

  const handleRemoveInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    delete payload.newInterest;
    await updateProfile(payload);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-black border border-gray-100 dark:border-threads-border rounded-[2rem] shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          {/* Main Form Area */}
          <div className="flex-1 p-8 md:p-12 space-y-10 border-b md:border-b-0 md:border-r border-gray-100 dark:border-threads-border">
            <header className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">{t('Edit Profile')}</h1>
              <p className="text-gray-500">{t('Customize how you appear on the network.')}</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Media Section */}
              <section>
                <SectionHeader icon={Camera} title={t('Visuals')} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 dark:bg-white/5 rounded-[2rem] group relative">
                    <Avatar src={user?.profilePhoto?.url} size="xl" className="ring-4 ring-white dark:ring-black" />
                    <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-black/40 rounded-[2rem]">
                      <Plus className="text-white" size={32} />
                      <input type="file" className="hidden" onChange={(e) => updatePhoto(e.target.files[0])} />
                    </label>
                    <div className="text-center">
                      <p className="font-bold text-[15px]">{t('Profile Photo')}</p>
                      <p className="text-[12px] text-gray-500 uppercase tracking-widest">{t('Click to change')}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 dark:bg-white/5 rounded-[2rem] group relative">
                    <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-gray-200 dark:bg-threads-border">
                      {user?.coverPhoto?.url && (
                        <img src={user.coverPhoto.url} className="w-full h-full object-cover opacity-80" alt="Cover" />
                      )}
                      <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-black/40">
                        <Plus className="text-white" size={32} />
                        <input type="file" className="hidden" onChange={(e) => updateCoverPhoto(e.target.files[0])} />
                      </label>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-[15px]">{t('Cover Photo')}</p>
                      <p className="text-[12px] text-gray-500 uppercase tracking-widest">{t('Click to change')}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Basic Info */}
              <section>
                <SectionHeader icon={User} title={t('Identity')} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  <div className="sm:col-span-2 flex flex-col gap-2">
                    <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 ml-1">{t('Bio')}</label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-threads-border rounded-2xl p-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 h-32 resize-none transition-all outline-none"
                      placeholder={t('Tell us about yourself...')}
                    />
                  </div>
                </div>
              </section>

              {/* Personal Details */}
              <section>
                <SectionHeader icon={Heart} title={t('Personal')} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputGroup 
                    label={t('Date of Birth')} 
                    name="dateOfBirth" 
                    type="date"
                    value={formData.dateOfBirth} 
                    onChange={handleChange} 
                    icon={Calendar} 
                  />
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 ml-1">{t('Gender')}</label>
                    <select 
                      name="gender" 
                      value={formData.gender} 
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-threads-border rounded-xl py-3 px-4 text-[15px] focus:outline-none transition-all outline-none appearance-none"
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
                <SectionHeader icon={MapPin} title={t('Location & Localization')} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputGroup label={t('Country')} name="country" value={formData.country} onChange={handleChange} icon={Globe} />
                  <InputGroup label={t('City')} name="city" value={formData.city} onChange={handleChange} icon={MapPin} />
                  <InputGroup label={t('Language')} name="preferedLanguage" value={formData.preferedLanguage} onChange={handleChange} icon={Languages} />
                  <InputGroup label={t('Phone')} name="phone" value={formData.phone} onChange={handleChange} icon={Phone} />
                </div>
              </section>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-8">
                <Button 
                  type="submit" 
                  isLoading={updateProfileLoading}
                  className="rounded-full px-12"
                >
                  {t('Save Changes')}
                </Button>
              </div>
            </form>
          </div>

          {/* Preview Sidebar */}
          <div className="md:w-80 bg-gray-50 dark:bg-[#080808] p-8 md:p-12 flex flex-col items-center space-y-8">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.2em] text-gray-400">{t('Live Preview')}</h2>
            <div className="w-full space-y-6 flex flex-col items-center text-center">
              <Avatar src={user?.profilePhoto?.url} size="xl" className="ring-8 ring-white dark:ring-black shadow-2xl" />
              <div className="space-y-1">
                <h3 className="text-2xl font-bold tracking-tight">{formData.profileName || user?.profileName}</h3>
                <p className="text-gray-500 font-medium">@{formData.username || user?.username}</p>
              </div>
              <div className="w-full h-px bg-gray-200 dark:bg-white/5" />
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">
                &quot;{formData.description || t('No bio provided yet.')}&quot;
              </p>
              
              <div className="grid grid-cols-2 gap-4 w-full pt-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-threads-border shadow-sm">
                  <p className="text-[11px] font-bold uppercase text-gray-400 mb-1">{t('Followers')}</p>
                  <p className="text-lg font-bold">{user?.followers?.length || 0}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-threads-border shadow-sm">
                  <p className="text-[11px] font-bold uppercase text-gray-400 mb-1">{t('Following')}</p>
                  <p className="text-lg font-bold">{user?.following?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(UpdateProfile);
