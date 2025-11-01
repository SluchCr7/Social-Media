'use client';
import React, { useState, useEffect, useMemo, useCallback, useDeferredValue } from 'react';
import { FiX, FiLoader } from 'react-icons/fi';
import {
  FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaGlobe, FaPlus, FaCheckCircle,
} from 'react-icons/fa';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useUser } from '@/app/Context/UserContext';
import { useTranslation } from 'react-i18next';

// --------------------------- إعداد الأنماط العامة ---------------------------
const inputStyle =
  'w-full py-3 px-4 text-sm text-lightMode-fg dark:text-darkMode-fg ' +
  'bg-lightMode-menu/60 dark:bg-gray-800/65 backdrop-blur-sm ' +
  'border border-lightMode-text2/20 dark:border-gray-700/40 rounded-lg ' +
  'placeholder:text-gray-400 focus:outline-none focus:ring-2 ' +
  'focus:ring-lightMode-text dark:focus:ring-darkMode-text transition';

// --------------------------- أيقونات/حقول الشبكات الاجتماعية (ثابتة) ---------------------------
const socialFields = Object.freeze([
  { name: 'github', label: 'GitHub', icon: <FaGithub /> },
  { name: 'linkedin', label: 'LinkedIn', icon: <FaLinkedin className="text-blue-600 dark:text-blue-400" /> },
  { name: 'twitter', label: 'Twitter', icon: <FaTwitter className="text-blue-500" /> },
  { name: 'facebook', label: 'Facebook', icon: <FaFacebook className="text-blue-700 dark:text-blue-600" /> },
  { name: 'website', label: 'Website', icon: <FaGlobe className="text-lightMode-text dark:text-darkMode-text" /> },
]);

// ============================================================================
// مكون تحديث الملف الشخصي (محسن للأداء بدون حذف أي شيء)
// ============================================================================
const UpdateProfile = ({ user }) => {
  const { updateProfile, updateProfileLoading } = useUser();
  const { t } = useTranslation();

  // --------------------------- الحالة ---------------------------
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

  // لتقليل الـ re-render أثناء الكتابة الطويلة (مثل bio)
  const deferredDescription = useDeferredValue(formData.description);

  // --------------------------- تحميل بيانات المستخدم ---------------------------
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

  // --------------------------- الدوال المحفوظة بالأداء ---------------------------
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

      // مقارنة الحقول النصية
      fieldsToCompare.forEach((f) => {
        const newValue = formData[f]?.trim?.() || formData[f];
        if (isValueChanged(f, newValue)) payload[f] = newValue;
      });

      // الشريك
      const partnerId = formData.partner;
      const originalPartnerId = user?.partner?._id || user?.partner || '';
      if (partnerId !== originalPartnerId) payload.partner = partnerId;
      else if (formData.relationshipStatus && !partnerId && ['In a Relationship', 'Married'].includes(user?.relationshipStatus))
        payload.partner = null;

      // الاهتمامات
      const currentInterests = formData.interests.filter((i) => i.trim() !== '');
      if (JSON.stringify(currentInterests.sort()) !== JSON.stringify((user?.interests || []).sort())) {
        payload.interests = currentInterests;
      }

      // الروابط الاجتماعية
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

  // --------------------------- مشتقات محسوبة بـ useMemo ---------------------------
  const socialLinkEntries = useMemo(() => Object.entries(formData.socialLinks || {}), [formData.socialLinks]);
  const followingList = useMemo(() => user?.following || [], [user]);

  // ========================================================================
  // واجهة المستخدم
  // ========================================================================
  return (
    <div className="w-full">
      <div className="relative w-full">
        <div
          className="relative flex flex-col md:flex-row w-full bg-lightMode-menu/60 dark:bg-black/50 
                     border border-lightMode-text2/10 dark:border-gray-700/40 backdrop-blur-md 
                     rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 5px 20px rgba(2,6,23,0.15)' }}
        >
          {/* -------------------- Left Form -------------------- */}
          <div className="w-full md:w-2/3 overflow-y-visible p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-lightMode-text dark:text-darkMode-text">
                  {t('Edit Profile Information')}
                </h2>
                <p className="mt-1 text-sm text-lightMode-text2 dark:text-gray-400">
                  {t('Update your public profile and personal details. Fields with no changes will be ignored.')}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ==================== Basic Info ==================== */}
              <fieldset className="bg-lightMode-menu/40 dark:bg-gray-900/40 border border-lightMode-text2/10 dark:border-gray-700/40 rounded-2xl p-5 space-y-4">
                <legend className="px-2 text-lg font-semibold text-lightMode-fg dark:text-darkMode-fg">{t('Basic Info')}</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: t('Username'), name: 'username', placeholder: t('Enter username') },
                    { label: t('Profile Name'), name: 'profileName', placeholder: t('Display name') },
                    { label: t('Country'), name: 'country', placeholder: t('Your country') },
                    { label: t('City'), name: 'city', placeholder: t('Your city') },
                    { label: t('Phone'), name: 'phone', placeholder: '+20 10xxx' },
                    { label: t('Preferred Language'), name: 'preferedLanguage', placeholder: t('e.g., Arabic, English') },
                  ].map(({ label, name, placeholder }) => (
                    <div key={name} className="flex flex-col">
                      <label htmlFor={name} className="text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2">
                        {label}
                      </label>
                      <input
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className={inputStyle}
                        placeholder={placeholder}
                      />
                    </div>
                  ))}

                  {/* Bio */}
                  <div className="sm:col-span-2 flex flex-col">
                    <label htmlFor="description" className="text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2">
                      {t('Bio')}
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={deferredDescription}
                      onChange={handleChange}
                      className={`${inputStyle} h-24 resize-none`}
                      placeholder={t('Short bio about yourself (max 150 characters)')}
                      maxLength={150}
                    />
                    <div className="text-xs mt-1 text-lightMode-text2 dark:text-gray-500">
                      {formData.description.length}/150
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* ==================== Personal Details ==================== */}
              <fieldset className="bg-lightMode-menu/40 dark:bg-gray-900/40 border border-lightMode-text2/10 dark:border-gray-700/40 rounded-2xl p-5 space-y-4">
                <legend className="px-2 text-lg font-semibold text-lightMode-fg dark:text-darkMode-fg">{t('Personal Details')}</legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="dateOfBirth" className="text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2">
                      {t('Date of Birth')}
                    </label>
                    <input id="dateOfBirth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputStyle} />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="gender" className="text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2">
                      {t('Gender')}
                    </label>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className={inputStyle}>
                      <option value="">{t('Select')}</option>
                      <option>{t('Male')}</option>
                      <option>{t('Female')}</option>
                      <option>{t('Other')}</option>
                    </select>
                  </div>
                </div>

                {/* Relationship */}
                <div className="mt-2">
                  <label htmlFor="relationshipStatus" className="text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2 block">
                    {t('Relationship Status')}
                  </label>
                  <select id="relationshipStatus" name="relationshipStatus" value={formData.relationshipStatus} onChange={handleChange} className={inputStyle}>
                    <option value="">{t('Select')}</option>
                    <option>{t('Single')}</option>
                    <option>{t('In a Relationship')}</option>
                    <option>{t('Married')}</option>
                    <option>{t('Divorced')}</option>
                  </select>
                </div>

                {(formData.relationshipStatus === t('In a Relationship') || formData.relationshipStatus === t('Married')) && (
                  <div className="mt-2">
                    <label className="text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2 block">{t('Choose Partner (Must be a follower)')}</label>
                    <div className="max-h-44 overflow-y-auto border border-lightMode-text2/10 dark:border-gray-700/40 rounded-lg p-1">
                      {followingList.length ? (
                        followingList.map((f) => (
                          <div
                            key={f._id}
                            onClick={() => setFormData((prev) => ({ ...prev, partner: f._id }))}
                            className={`flex items-center gap-3 p-2 cursor-pointer rounded-md transition ${
                              formData.partner === f._id
                                ? 'bg-lightMode-text/10 dark:bg-darkMode-text/20'
                                : 'hover:bg-lightMode-menu/40 dark:hover:bg-gray-800/60'
                            }`}
                          >
                            {formData.partner === f._id ? <FaCheckCircle className="text-lightMode-text dark:text-darkMode-text" /> : <div className="w-5" />}
                            <Image
                              width={40}
                              height={40}
                              src={f?.profilePhoto?.url || '/default-avatar.png'}
                              alt={f?.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-lightMode-text dark:text-white">{f?.profileName || f?.username}</div>
                              <div className="text-xs text-lightMode-text2 dark:text-gray-400">{f?.username}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-center text-lightMode-text2 dark:text-gray-500 p-3">{t('You must follow someone to choose a partner.')}</p>
                      )}
                    </div>

                    {formData.partner && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, partner: '' }))}
                        className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-500 transition flex items-center gap-2"
                      >
                        <FiX className="inline" /> {t('Clear Selection')}
                      </button>
                    )}
                  </div>
                )}
              </fieldset>

              {/* ==================== Interests ==================== */}
              <fieldset className="bg-lightMode-menu/40 dark:bg-gray-900/40 border border-lightMode-text2/10 dark:border-gray-700/40 rounded-2xl p-5 space-y-3">
                <legend className="px-2 text-lg font-semibold text-lightMode-fg dark:text-darkMode-fg">{t('Interests and Hobbies')}</legend>

                <div>
                  <label className="block text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2">{t('Current Interests')}</label>
                  <div className="flex flex-wrap gap-2 mb-3 min-h-[48px] p-2 rounded-lg border border-lightMode-text2/10 dark:border-gray-700/40">
                    {formData.interests.length > 0 ? (
                      formData.interests.map((interest, i) => (
                        <span key={i} className="flex items-center gap-2 px-3 py-1 bg-lightMode-text/8 dark:bg-gray-700 rounded-full text-sm text-lightMode-text dark:text-gray-100">
                          <span>{interest}</span>
                          <FiX className="cursor-pointer text-red-600 dark:text-red-400 hover:text-red-500" onClick={() => handleRemoveInterest(interest)} />
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-lightMode-text2 dark:text-gray-500 italic">{t('No interests added yet.')}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="newInterest"
                      placeholder={t('Add a new interest')}
                      value={formData.newInterest}
                      onChange={handleChange}
                      className={`${inputStyle} flex-1`}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                    />
                    <button
                      type="button"
                      onClick={handleAddInterest}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
                                 bg-lightMode-text text-white dark:bg-darkMode-text dark:text-darkMode-bg 
                                 hover:opacity-90 active:scale-95 transition"
                    >
                      <FaPlus className="text-sm" />
                      {t('Add')}
                    </button>
                  </div>
                </div>
              </fieldset>

              {/* ==================== Social Links ==================== */}
              <fieldset className="bg-lightMode-menu/40 dark:bg-gray-900/40 border border-lightMode-text2/10 dark:border-gray-700/40 rounded-2xl p-5 space-y-3">
                <legend className="px-2 text-lg font-semibold text-lightMode-fg dark:text-darkMode-fg">{t('Social Links')}</legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {socialFields.map(({ name, label, icon }) => (
                    <div key={name} className="flex flex-col">
                      <label
                        htmlFor={name}
                        className="text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2 flex items-center gap-2"
                      >
                        {icon} {label}
                      </label>
                      <input
                        id={name}
                        name={name}
                        value={formData.socialLinks[name] || ''}
                        onChange={handleChange}
                        placeholder={t(`Enter your ${label} link`)}
                        className={inputStyle}
                      />
                    </div>
                  ))}
                </div>
              </fieldset>

              {/* ==================== حفظ التغييرات ==================== */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={updateProfileLoading}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition
                              ${updateProfileLoading
                                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                                : 'bg-lightMode-text dark:bg-darkMode-text hover:opacity-90 active:scale-95'}
                            `}
                >
                  {updateProfileLoading ? (
                    <>
                      <FiLoader className="animate-spin" />
                      {t('Saving...')}
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="text-base" />
                      {t('Save Changes')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* -------------------- Right Sidebar (ملخص أو صورة المستخدم) -------------------- */}
          <div className="hidden md:flex flex-col justify-center items-center w-full md:w-1/3 bg-gradient-to-b 
                          from-lightMode-bg/40 to-lightMode-menu/40 dark:from-gray-900/50 dark:to-black/60 
                          border-l border-lightMode-text2/10 dark:border-gray-700/40 p-8">
            <div className="flex flex-col items-center space-y-3">
              <div className="relative w-28 h-28">
                <Image
                  src={user?.profilePhoto?.url || '/default-avatar.png'}
                  alt={user?.username || 'User'}
                  fill
                  className="rounded-full object-cover border-4 border-lightMode-text/10 dark:border-gray-700/60"
                />
              </div>
              <h3 className="text-lg font-semibold text-lightMode-fg dark:text-darkMode-fg">
                {user?.profileName || user?.username}
              </h3>
              <p className="text-sm text-center text-lightMode-text2 dark:text-gray-400 max-w-[200px] line-clamp-3">
                {user?.description || t('No bio available.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UpdateProfile);
