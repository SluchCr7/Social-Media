'use client';
import React, { useState, useEffect } from 'react';
import { FiX, FiLoader } from 'react-icons/fi';
import {
  FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaGlobe, FaPlus, FaCheckCircle
} from 'react-icons/fa';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useUser } from '@/app/Context/UserContext';
import { useTranslation } from 'react-i18next';

// --------------------------- إعدادات الأنماط العامة (باستخدام المتغيرات المخصصة) ---------------------------
const inputStyle =
  "w-full py-3 px-4 text-sm \
  text-lightMode-fg dark:text-darkMode-fg \
  bg-lightMode-menu dark:bg-gray-800 \
  border border-lightMode-text2 dark:border-gray-700 \
  rounded-xl placeholder:text-gray-400 \
  focus:outline-none \
  focus:ring-2 focus:ring-lightMode-text dark:focus:ring-darkMode-text transition";

const socialFields = [
  { name: 'github', label: 'GitHub', icon: <FaGithub /> },
  { name: 'linkedin', label: 'LinkedIn', icon: <FaLinkedin className="text-blue-600 dark:text-blue-400" /> },
  { name: 'twitter', label: 'Twitter', icon: <FaTwitter className="text-blue-500" /> },
  { name: 'facebook', label: 'Facebook', icon: <FaFacebook className="text-blue-700 dark:text-blue-600" /> },
  { name: 'website', label: 'Website', icon: <FaGlobe className="text-lightMode-text dark:text-darkMode-text" /> },
];

// ============================================================================
// مكون تحديث الملف الشخصي
// ============================================================================
const UpdateProfile = ({ update, setUpdate, user }) => {
  const { updateProfile, updateProfileLoading } = useUser();
  const { t } = useTranslation();

  // --------------------------- الحالة (State) ---------------------------
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

  // --------------------------- تحميل بيانات المستخدم الأصلية (للمقارنة) ---------------------------
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


  // --------------------------- التعامل مع تغييرات الإدخال ---------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.socialLinks) {
      setFormData(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [name]: value },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // --------------------------- الاهتمامات (Interests) ---------------------------
  const handleAddInterest = () => {
    const interest = formData.newInterest.trim();
    if (interest.length < 2) {
      return toast.error(t("Interest must be at least 2 characters long."));
    }
    if (interest && !formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest],
        newInterest: '',
      }));
    } else if (formData.interests.includes(interest)) {
      toast.warn(t("This interest is already added."));
    }
  };

  const handleRemoveInterest = (interest) =>
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest),
    }));
  
  // --------------------------- منطق المقارنة والإرسال ---------------------------
  const isValueChanged = (key, newValue) => {
    const originalValue = user ? (user[key] ?? '') : '';
    const currentNewValue = newValue ?? '';
    return String(originalValue).trim() !== String(currentNewValue).trim();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (updateProfileLoading) return;

    const payload = {};
    const fieldsToCompare = [
      'username', 'profileName', 'description', 'country', 'phone', 'city',
      'dateOfBirth', 'gender', 'relationshipStatus', 'preferedLanguage',
    ];
    
    // 1. مقارنة الحقول النصية والتاريخ
    fieldsToCompare.forEach(f => {
      const newValue = formData[f]?.trim?.() || formData[f];
      if (isValueChanged(f, newValue)) {
        payload[f] = newValue;
      }
    });
    
    // 2. مقارنة الشريك 
    const partnerId = formData.partner;
    const originalPartnerId = user?.partner?._id || user?.partner || '';
    if (partnerId !== originalPartnerId) {
      payload.partner = partnerId;
    } else if (formData.relationshipStatus && !partnerId && (user?.relationshipStatus === "In a Relationship" || user?.relationshipStatus === "Married")) {
      payload.partner = null; 
    }
    
    // 3. مقارنة الاهتمامات
    const currentInterests = formData.interests.filter(i => i.trim() !== '');
    if (JSON.stringify(currentInterests.sort()) !== JSON.stringify((user?.interests || []).sort())) {
      payload.interests = currentInterests;
    }
    
    // 4. مقارنة الروابط الاجتماعية
    const currentLinks = Object.fromEntries(
      Object.entries(formData.socialLinks).filter(([_, v]) => v.trim() !== '')
    );
    const originalLinks = user?.socialLinks || {};

    if (JSON.stringify(currentLinks) !== JSON.stringify(originalLinks)) {
      payload.socialLinks = currentLinks;
    }
    
    if (Object.keys(payload).length === 0)
      return toast.error(t("Please change at least one field before saving."));

    updateProfile(payload);
    setUpdate(false);
  };


  // ========================================================================
  // واجهة المستخدم
  // ========================================================================
  return (
    <div className={`${update ? 'fixed inset-0 bg-black/70 z-50 flex items-center justify-center' : 'hidden'}`}>
      <div className="relative \
        bg-lightMode-menu dark:bg-darkMode-menu \
        text-lightMode-fg dark:text-darkMode-fg \
        w-[95%] max-w-2xl rounded-2xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100">

        {/* زر الإغلاق */}
        <button onClick={() => setUpdate(false)} className="absolute top-4 right-4 text-lightMode-text2 dark:text-gray-400 hover:text-lightMode-text dark:hover:text-darkMode-text text-xl transition z-50">
          <FiX />
        </button>

        <h2 className="text-3xl font-extrabold text-center border-b pb-3 border-lightMode-text2 dark:border-gray-700 text-lightMode-text dark:text-darkMode-text">{t("Edit Profile Information")}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* -------------------- قسم المعلومات الأساسية -------------------- */}
          <fieldset className="space-y-4 border border-lightMode-text2 dark:border-gray-700 p-4 rounded-xl">
            <legend className="px-2 text-xl font-semibold text-lightMode-fg dark:text-darkMode-fg">{t("Basic Info")}</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: t('Username'), name: 'username', placeholder: t('Enter username') },
                { label: t('Profile Name'), name: 'profileName', placeholder: t('Display name') },
                { label: t('Country'), name: 'country', placeholder: t('Your country') },
                { label: t('City'), name: 'city', placeholder: t('Your city') },
                { label: t('Phone'), name: 'phone', placeholder: '+20 10xxx' },
                { label: t('Preferred Language'), name: 'preferedLanguage', placeholder: t('e.g., Arabic, English') },
              ].map(({ label, name, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-1">{label}</label>
                  <input
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={inputStyle}
                    placeholder={placeholder}
                  />
                </div>
              ))}

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-1">{t('Bio')}</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`${inputStyle} h-20`}
                  placeholder={t('Short bio about yourself (max 150 characters)')}
                  maxLength={150}
                />
              </div>
            </div>
          </fieldset>

          {/* -------------------- قسم التفاصيل الشخصية -------------------- */}
          <fieldset className="space-y-4 border border-lightMode-text2 dark:border-gray-700 p-4 rounded-xl">
            <legend className="px-2 text-xl font-semibold text-lightMode-fg dark:text-darkMode-fg">{t("Personal Details")}</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* تاريخ الميلاد */}
              <div>
                <label className="block text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-1">{t("Date of Birth")}</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputStyle} />
              </div>

              {/* النوع */}
              <div>
                <label className="block text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-1">{t("Gender")}</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className={inputStyle}>
                  <option value="">{t("Select")}</option>
                  <option>{t("Male")}</option>
                  <option>{t("Female")}</option>
                  <option>{t("Other")}</option>
                </select>
              </div>
            </div>

            {/* الحالة الاجتماعية */}
            <div>
              <label className="block text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-1">{t("Relationship Status")}</label>
              <select name="relationshipStatus" value={formData.relationshipStatus} onChange={handleChange} className={inputStyle}>
                <option value="">{t("Select")}</option>
                <option>{t("Single")}</option>
                <option>{t("In a Relationship")}</option>
                <option>{t("Married")}</option>
                <option>{t("Divorced")}</option>
              </select>
            </div>

            {/* اختيار الشريك */}
            {(formData.relationshipStatus === t("In a Relationship") || formData.relationshipStatus === t("Married")) && (
              <div>
                <label className="block text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-1">{t("Choose Partner (Must be a follower)")}</label>
                <div className="max-h-48 overflow-y-auto border border-lightMode-text2 dark:border-gray-700 rounded-xl">
                  {user?.following?.length ? (
                    user.following.map(f => (
                      <div
                        key={f._id}
                        onClick={() => setFormData(prev => ({ ...prev, partner: f._id }))}
                        className={`flex items-center gap-3 p-2 cursor-pointer transition ${formData.partner === f._id 
                          ? "bg-lightMode-text/20 dark:bg-darkMode-text/20 hover:bg-lightMode-text/30 dark:hover:bg-darkMode-text/30" 
                          : "hover:bg-lightMode-menu dark:hover:bg-gray-700"}`}
                      >
                        {formData.partner === f._id ? <FaCheckCircle className="text-lightMode-text dark:text-darkMode-text" /> : null}
                        <Image
                          width={40}
                          height={40}
                          src={f?.profilePhoto?.url || "/default-avatar.png"}
                          alt={f?.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span>{f?.profileName || f?.username}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-lightMode-text2 dark:text-gray-500 p-3">{t("You must follow someone to choose a partner.")}</p>
                  )}
                </div>
                {formData.partner && (
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, partner: '' }))} className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-500 transition">
                    <FiX className="inline mr-1" /> {t("Clear Selection")}
                  </button>
                )}
              </div>
            )}
          </fieldset>

          {/* -------------------- قسم الاهتمامات -------------------- */}
          <fieldset className="space-y-4 border border-lightMode-text2 dark:border-gray-700 p-4 rounded-xl">
            <legend className="px-2 text-xl font-semibold text-lightMode-fg dark:text-darkMode-fg">{t("Interests and Hobbies")}</legend>
            <div>
              <label className="block text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2">{t("Current Interests")}</label>
              <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-1 border border-lightMode-text2/50 dark:border-gray-800 rounded-xl">
                {formData.interests.length > 0 ? (
                  formData.interests.map((interest, i) => (
                    <span key={i} className="flex items-center gap-1 px-3 py-1 bg-lightMode-text/10 dark:bg-gray-700 hover:bg-lightMode-text/20 dark:hover:bg-gray-600 rounded-full text-sm transition text-lightMode-text dark:text-gray-100">
                      {interest}
                      <FiX className="cursor-pointer text-red-600 dark:text-red-400 hover:text-red-500 ml-1" onClick={() => handleRemoveInterest(interest)} />
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-lightMode-text2 dark:text-gray-500 italic">{t("No interests added yet.")}</p>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  name="newInterest"
                  placeholder={t("Add a new interest")}
                  value={formData.newInterest}
                  onChange={handleChange}
                  className={`${inputStyle} flex-1`}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                />
                <button 
                  type="button" 
                  onClick={handleAddInterest} 
                  className="p-3 bg-lightMode-text dark:bg-darkMode-text hover:bg-lightMode-text/90 dark:hover:bg-darkMode-text2 rounded-xl transition \
                    text-lightMode-fg dark:text-black font-semibold flex items-center justify-center"
                >
                  <FaPlus />
                </button>
              </div>
              <p className="text-xs text-lightMode-text2 dark:text-gray-500 mt-1">{t("Type an interest and press Enter or click the plus icon.")}</p>
            </div>
          </fieldset>


          {/* -------------------- قسم الروابط الاجتماعية -------------------- */}
          <fieldset className="space-y-4 border border-lightMode-text2 dark:border-gray-700 p-4 rounded-xl">
            <legend className="px-2 text-xl font-semibold text-lightMode-fg dark:text-darkMode-fg">{t("Social Links")}</legend>
            <div className="space-y-4">
              {socialFields.map(({ name, label, icon }) => (
                <div key={name} className="flex items-center gap-3">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-lightMode-menu dark:bg-gray-700 rounded-lg text-lg text-lightMode-text dark:text-gray-100">
                    {icon}
                  </div>
                  <input
                    name={name}
                    value={formData.socialLinks[name] || ''}
                    onChange={handleChange}
                    placeholder={`${label} URL (Optional)`}
                    className={inputStyle}
                  />
                </div>
              ))}
            </div>
          </fieldset>


          {/* -------------------- زر الحفظ (مع مؤشر تحميل مدمج) -------------------- */}
          <button
            type="submit"
            disabled={updateProfileLoading}
            className={`w-full mt-6 py-3 px-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center transition ${
              updateProfileLoading
                ? 'bg-lightMode-text2/50 dark:bg-gray-600 cursor-not-allowed text-gray-400'
                : 'bg-lightMode-text dark:bg-darkMode-text hover:bg-lightMode-text/90 dark:hover:bg-darkMode-text2 text-white dark:text-black'
            }`}
          >
            {updateProfileLoading ? (
              <>
                <FiLoader className="animate-spin text-black mr-2" />
                {t('Saving...')}
              </>
            ) : (
              t('Save Changes')
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;