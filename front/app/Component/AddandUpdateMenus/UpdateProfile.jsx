'use client';
import React, { useState, useEffect, useMemo, useCallback, useDeferredValue } from 'react';
import { FiX, FiLoader, FiUser, FiCalendar, FiMapPin, FiHeart, FiGlobe, FiPhone } from 'react-icons/fi';
import {
  FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaGlobe, FaPlus, FaCheckCircle,
} from 'react-icons/fa';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useUser } from '@/app/Context/UserContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

// --------------------------- Premium Input Styles ---------------------------
const inputWrapperStyle = "relative group";
const inputIconStyle = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors z-10";
const inputStyle =
  'w-full py-4 pl-12 pr-4 text-sm text-gray-100 placeholder-gray-500 ' +
  'bg-white/5 border border-white/10 rounded-xl ' +
  'focus:outline-none focus:bg-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium';
const labelStyle = "text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2 block";

// --------------------------- Social Icons ---------------------------
const socialFields = Object.freeze([
  { name: 'github', label: 'GitHub', icon: <FaGithub /> },
  { name: 'linkedin', label: 'LinkedIn', icon: <FaLinkedin className="text-blue-400" /> },
  { name: 'twitter', label: 'Twitter', icon: <FaTwitter className="text-blue-500" /> },
  { name: 'facebook', label: 'Facebook', icon: <FaFacebook className="text-blue-600" /> },
  { name: 'website', label: 'Website', icon: <FaGlobe className="text-indigo-400" /> },
]);

const UpdateProfile = ({ user }) => {
  const { updateProfile, updateProfileLoading } = useUser();
  const { t } = useTranslation();

  // --------------------------- State ---------------------------
  const [formData, setFormData] = useState({
    username: '',
    profileName: '',
    description: '',
    country: '',
    phone: '',
    interests: [],
    newInterest: '',
    dateOfBirth: '',
    gender: '',
    city: '',
    relationshipStatus: '',
    partner: '',
    preferedLanguage: '',
    socialLinks: {},
  });

  const deferredDescription = useDeferredValue(formData.description);

  // --------------------------- Load User Data ---------------------------
  useEffect(() => {
    if (!user) return;
    const initialPartner = user.partner?._id || user.partner || '';

    setFormData({
      username: user.username || '',
      profileName: user.profileName || '',
      description: user.description || '',
      country: user.country || '',
      phone: user.phone || '',
      city: user.city || '',
      gender: user.gender || '',
      relationshipStatus: user.relationshipStatus || '',
      partner: initialPartner,
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

  // --------------------------- Handlers ---------------------------
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name in prev.socialLinks) {
        if (prev.socialLinks[name] === value) return prev;
        return { ...prev, socialLinks: { ...prev.socialLinks, [name]: value } };
      }
      if (prev[name] === value) return prev;
      return { ...prev, [name]: value };
    });
  }, []);

  const handleAddInterest = useCallback(() => {
    setFormData((prev) => {
      const interest = prev.newInterest.trim();
      if (interest.length < 2) {
        toast.error(t('Interest must be at least 2 characters long.'));
        return prev;
      }
      if (prev.interests.includes(interest)) {
        toast.warn(t('This interest is already added.'));
        return prev;
      }
      return { ...prev, interests: [...prev.interests, interest], newInterest: '' };
    });
  }, [t]);

  const handleRemoveInterest = useCallback((interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  }, []);

  const isValueChanged = useCallback((key, newValue) => {
    const originalValue = user ? (user[key] ?? '') : '';
    const currentNewValue = newValue ?? '';
    return String(originalValue).trim() !== String(currentNewValue).trim();
  }, [user]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (updateProfileLoading) return;

      const payload = {};
      const fieldsToCompare = [
        'username', 'profileName', 'description', 'country', 'phone', 'city',
        'dateOfBirth', 'gender', 'relationshipStatus', 'preferedLanguage',
      ];

      fieldsToCompare.forEach((f) => {
        const newValue = formData[f]?.trim?.() || formData[f];
        if (isValueChanged(f, newValue)) payload[f] = newValue;
      });

      const partnerId = formData.partner;
      const originalPartnerId = user?.partner?._id || user?.partner || '';
      if (partnerId !== originalPartnerId) payload.partner = partnerId;
      else if (formData.relationshipStatus && !partnerId && ['In a Relationship', 'Married'].includes(user?.relationshipStatus))
        payload.partner = null;

      const currentInterests = formData.interests.filter((i) => i.trim() !== '');
      if (JSON.stringify(currentInterests.sort()) !== JSON.stringify((user?.interests || []).sort())) {
        payload.interests = currentInterests;
      }

      const currentLinks = Object.fromEntries(
        Object.entries(formData.socialLinks).filter(([_, v]) => v.trim() !== '')
      );
      const originalLinks = user?.socialLinks || {};
      if (JSON.stringify(currentLinks) !== JSON.stringify(originalLinks)) payload.socialLinks = currentLinks;

      if (Object.keys(payload).length === 0)
        return toast.error(t('Please change at least one field before saving.'));

      updateProfile(payload);
    },
    [formData, isValueChanged, t, updateProfile, updateProfileLoading, user]
  );

  const followingList = useMemo(() => user?.following || [], [user]);

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        {/* -------------------- Left Form -------------------- */}
        <div className="w-full md:w-2/3 p-8 sm:p-10 space-y-8 bg-gradient-to-br from-[#0A0A0A] to-[#111]">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight">
              {t('Edit Profile')}
            </h2>
            <p className="text-sm text-gray-400 font-medium">
              {t('Update your public profile and personal details.')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* ==================== Basic Info ==================== */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400"><FiUser size={20} /></span>
                <h3 className="text-lg font-bold text-white tracking-wide">{t('Basic Info')}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: t('Username'), name: 'username', placeholder: t('Enter username'), icon: <FiUser /> },
                  { label: t('Profile Name'), name: 'profileName', placeholder: t('Display name'), icon: <FiUser /> },
                  { label: t('Country'), name: 'country', placeholder: t('Your country'), icon: <FiGlobe /> },
                  { label: t('City'), name: 'city', placeholder: t('Your city'), icon: <FiMapPin /> },
                  { label: t('Phone'), name: 'phone', placeholder: '+20 10xxx', icon: <FiPhone /> },
                  { label: t('Language'), name: 'preferedLanguage', placeholder: t('e.g., Arabic, English'), icon: <FiGlobe /> },
                ].map(({ label, name, placeholder, icon }) => (
                  <div key={name} className={inputWrapperStyle}>
                    <label htmlFor={name} className={labelStyle}>{label}</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors z-10 text-lg">
                        {icon}
                      </span>
                      <input
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className={inputStyle}
                        placeholder={placeholder}
                      />
                    </div>
                  </div>
                ))}

                {/* Bio */}
                <div className="sm:col-span-2">
                  <label htmlFor="description" className={labelStyle}>{t('Bio')}</label>
                  <textarea
                    id="description"
                    name="description"
                    value={deferredDescription}
                    onChange={handleChange}
                    className={`${inputStyle} h-32 resize-none pt-4`}
                    placeholder={t('Short bio about yourself (max 150 characters)')}
                    maxLength={150}
                  />
                  <div className="text-right text-[10px] uppercase font-bold text-gray-600 mt-2">
                    {formData.description.length}/150
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== Personal Details ==================== */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                <span className="p-2 rounded-lg bg-rose-500/10 text-rose-400"><FiHeart size={20} /></span>
                <h3 className="text-lg font-bold text-white tracking-wide">{t('Personal Details')}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className={inputWrapperStyle}>
                  <label htmlFor="dateOfBirth" className={labelStyle}>{t('Date of Birth')}</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors z-10 text-lg">
                      <FiCalendar />
                    </span>
                    <input id="dateOfBirth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputStyle} />
                  </div>
                </div>

                <div className={inputWrapperStyle}>
                  <label htmlFor="gender" className={labelStyle}>{t('Gender')}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10 text-lg"><FiUser /></span>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className={`${inputStyle} appearance-none cursor-pointer`}>
                      <option value="" className="bg-[#111]">{t('Select')}</option>
                      <option value="Male" className="bg-[#111]">{t('Male')}</option>
                      <option value="Female" className="bg-[#111]">{t('Female')}</option>
                      <option value="Other" className="bg-[#111]">{t('Other')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Relationship */}
              <div className="space-y-3">
                <label htmlFor="relationshipStatus" className={labelStyle}>{t('Relationship Status')}</label>
                <select id="relationshipStatus" name="relationshipStatus" value={formData.relationshipStatus} onChange={handleChange} className={`${inputStyle} appearance-none cursor-pointer pl-4`}>
                  <option value="" className="bg-[#111]">{t('Select Status')}</option>
                  <option className="bg-[#111]">{t('Single')}</option>
                  <option className="bg-[#111]">{t('In a Relationship')}</option>
                  <option className="bg-[#111]">{t('Married')}</option>
                  <option className="bg-[#111]">{t('Divorced')}</option>
                </select>
              </div>

              {(formData.relationshipStatus === t('In a Relationship') || formData.relationshipStatus === t('Married')) && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 animate-fade-in">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">{t('Choose Partner (Must be a follower)')}</label>
                  <div className="max-h-44 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                    {followingList.length ? (
                      followingList.map((f) => (
                        <div
                          key={f._id}
                          onClick={() => setFormData((prev) => ({ ...prev, partner: f._id }))}
                          className={`flex items-center gap-3 p-3 cursor-pointer rounded-xl transition-all border ${formData.partner === f._id
                              ? 'bg-indigo-500/10 border-indigo-500/50'
                              : 'bg-transparent border-transparent hover:bg-white/5'
                            }`}
                        >
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.partner === f._id ? 'border-indigo-500 bg-indigo-500' : 'border-gray-600'}`}>
                            {formData.partner === f._id && <FaCheckCircle className="text-white text-xs" />}
                          </div>
                          <Image
                            width={40}
                            height={40}
                            src={f?.profilePhoto?.url || '/default-avatar.png'}
                            alt={f?.username}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-bold text-white">{f?.profileName || f?.username}</div>
                            <div className="text-xs text-gray-500">@{f?.username}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-center text-gray-500 p-3 italic">{t('You must follow someone to choose a partner.')}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ==================== Interests ==================== */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><FaPlus size={18} /></span>
                <h3 className="text-lg font-bold text-white tracking-wide">{t('Interests')}</h3>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 min-h-[50px]">
                  {formData.interests.length > 0 ? (
                    formData.interests.map((interest, i) => (
                      <span key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-xs font-bold text-white border border-white/10">
                        {interest}
                        <button onClick={() => handleRemoveInterest(interest)} className="hover:text-red-400 transition-colors"><FiX /></button>
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">{t('No interests added yet.')}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    name="newInterest"
                    placeholder={t('Add a new interest')}
                    value={formData.newInterest}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 text-sm font-medium"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition-all"
                  >
                    {t('Add')}
                  </button>
                </div>
              </div>
            </div>

            {/* ==================== Social Links ==================== */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><FaGlobe size={18} /></span>
                <h3 className="text-lg font-bold text-white tracking-wide">{t('Social Links')}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {socialFields.map(({ name, label, icon }) => (
                  <div key={name} className="relative group">
                    <label htmlFor={name} className={labelStyle}>{label}</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg z-10">{icon}</span>
                      <input
                        id={name}
                        name={name}
                        value={formData.socialLinks[name] || ''}
                        onChange={handleChange}
                        placeholder={`https://${name}.com/...`}
                        className={inputStyle}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ==================== Actions ==================== */}
            <div className="pt-6 flex justify-end border-t border-white/5">
              <button
                type="submit"
                disabled={updateProfileLoading}
                className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateProfileLoading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    {t('Saving...')}
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    {t('Save Changes')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* -------------------- Right Sidebar -------------------- */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/3 bg-[#0F0F0F] border-l border-white/5 p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500 animate-pulse-slow" />
              <Image
                src={user?.profilePhoto?.url || '/default-avatar.png'}
                alt={user?.username || 'User'}
                fill
                className="rounded-full object-cover border-4 border-[#0F0F0F]"
              />
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 border-4 border-[#0F0F0F] rounded-full" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">
                {user?.profileName || user?.username}
              </h3>
              <p className="text-indigo-400 text-sm font-bold uppercase tracking-widest mt-1">
                @{user?.username}
              </p>
            </div>

            <div className="w-full h-px bg-white/10" />

            <p className="text-gray-400 text-sm italic leading-relaxed max-w-[250px]">
              &quot;{user?.description || t('No bio available')}&quot;
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default React.memo(UpdateProfile);
