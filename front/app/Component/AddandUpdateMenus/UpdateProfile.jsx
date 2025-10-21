// 'use client';
// import React, { useState, useEffect } from 'react';
// import { FiX, FiLoader } from 'react-icons/fi';
// import {
//   FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaGlobe, FaPlus, FaCheckCircle
// } from 'react-icons/fa';
// import Image from 'next/image';
// import { toast } from 'react-toastify';
// import { useUser } from '@/app/Context/UserContext';
// import { useTranslation } from 'react-i18next';

// // --------------------------- إعدادات الأنماط العامة (باستخدام المتغيرات المخصصة) ---------------------------
// const inputStyle =
//   "w-full py-3 px-4 text-sm " +
//   "text-lightMode-fg dark:text-darkMode-fg " +
//   "bg-lightMode-menu/60 dark:bg-gray-800/65 " +
//   "backdrop-blur-sm border border-lightMode-text2/20 dark:border-gray-700/40 " +
//   "rounded-lg placeholder:text-gray-400 " +
//   "focus:outline-none focus:ring-2 focus:ring-lightMode-text dark:focus:ring-darkMode-text transition";

// // أيقونات/حقول الشبكات الاجتماعية
// const socialFields = [
//   { name: 'github', label: 'GitHub', icon: <FaGithub /> },
//   { name: 'linkedin', label: 'LinkedIn', icon: <FaLinkedin className="text-blue-600 dark:text-blue-400" /> },
//   { name: 'twitter', label: 'Twitter', icon: <FaTwitter className="text-blue-500" /> },
//   { name: 'facebook', label: 'Facebook', icon: <FaFacebook className="text-blue-700 dark:text-blue-600" /> },
//   { name: 'website', label: 'Website', icon: <FaGlobe className="text-lightMode-text dark:text-darkMode-text" /> },
// ];

// // ============================================================================
// // مكون تحديث الملف الشخصي
// // ============================================================================

// const UpdateProfile = ({ update, setUpdate, user }) => {
//   const { updateProfile, updateProfileLoading } = useUser();
//   const { t } = useTranslation();

//   // --------------------------- الحالة (State) ---------------------------
//   const [formData, setFormData] = useState({
//     username: '',
//     profileName: '',
//     description: '',
//     country: '',
//     phone: '',
//     interests: [],
//     newInterest: '',
//     dateOfBirth: '',
//     gender: '',
//     city: '',
//     relationshipStatus: '',
//     partner: '',
//     preferedLanguage: '',
//     socialLinks: {},
//   });

//   // --------------------------- تحميل بيانات المستخدم الأصلية (للمقارنة) ---------------------------
//   useEffect(() => {
//     if (!user) return;

//     const initialPartner = user.partner?._id || user.partner || '';

//     setFormData({
//       username: user.username || '',
//       profileName: user.profileName || '',
//       description: user.description || '',
//       country: user.country || '',
//       phone: user.phone || '',
//       city: user.city || '',
//       gender: user.gender || '',
//       relationshipStatus: user.relationshipStatus || '',
//       partner: initialPartner,
//       dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
//       interests: user.interests || [],
//       preferedLanguage: user.preferedLanguage || '',
//       socialLinks: {
//         github: user.socialLinks?.github || '',
//         linkedin: user.socialLinks?.linkedin || '',
//         twitter: user.socialLinks?.twitter || '',
//         facebook: user.socialLinks?.facebook || '',
//         website: user.socialLinks?.website || '',
//       },
//       newInterest: '',
//     });
//   }, [user]);

//   // --------------------------- التعامل مع تغييرات الإدخال ---------------------------
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name in formData.socialLinks) {
//       setFormData(prev => ({
//         ...prev,
//         socialLinks: { ...prev.socialLinks, [name]: value },
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   // --------------------------- الاهتمامات (Interests) ---------------------------
//   const handleAddInterest = () => {
//     const interest = formData.newInterest.trim();
//     if (interest.length < 2) {
//       return toast.error(t("Interest must be at least 2 characters long."));
//     }
//     if (interest && !formData.interests.includes(interest)) {
//       setFormData(prev => ({
//         ...prev,
//         interests: [...prev.interests, interest],
//         newInterest: '',
//       }));
//     } else if (formData.interests.includes(interest)) {
//       toast.warn(t("This interest is already added."));
//     }
//   };

//   const handleRemoveInterest = (interest) =>
//     setFormData(prev => ({
//       ...prev,
//       interests: prev.interests.filter(i => i !== interest),
//     }));

//   // --------------------------- منطق المقارنة والإرسال ---------------------------
//   const isValueChanged = (key, newValue) => {
//     const originalValue = user ? (user[key] ?? '') : '';
//     const currentNewValue = newValue ?? '';
//     return String(originalValue).trim() !== String(currentNewValue).trim();
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (updateProfileLoading) return;

//     const payload = {};
//     const fieldsToCompare = [
//       'username', 'profileName', 'description', 'country', 'phone', 'city',
//       'dateOfBirth', 'gender', 'relationshipStatus', 'preferedLanguage',
//     ];

//     // 1. مقارنة الحقول النصية والتاريخ
//     fieldsToCompare.forEach(f => {
//       const newValue = formData[f]?.trim?.() || formData[f];
//       if (isValueChanged(f, newValue)) {
//         payload[f] = newValue;
//       }
//     });

//     // 2. مقارنة الشريك 
//     const partnerId = formData.partner;
//     const originalPartnerId = user?.partner?._id || user?.partner || '';
//     if (partnerId !== originalPartnerId) {
//       payload.partner = partnerId;
//     } else if (formData.relationshipStatus && !partnerId && (user?.relationshipStatus === "In a Relationship" || user?.relationshipStatus === "Married")) {
//       payload.partner = null;
//     }

//     // 3. مقارنة الاهتمامات
//     const currentInterests = formData.interests.filter(i => i.trim() !== '');
//     if (JSON.stringify(currentInterests.sort()) !== JSON.stringify((user?.interests || []).sort())) {
//       payload.interests = currentInterests;
//     }

//     // 4. مقارنة الروابط الاجتماعية
//     const currentLinks = Object.fromEntries(
//       Object.entries(formData.socialLinks).filter(([_, v]) => v.trim() !== '')
//     );
//     const originalLinks = user?.socialLinks || {};

//     if (JSON.stringify(currentLinks) !== JSON.stringify(originalLinks)) {
//       payload.socialLinks = currentLinks;
//     }

//     if (Object.keys(payload).length === 0)
//       return toast.error(t("Please change at least one field before saving."));

//     updateProfile(payload);
//     setUpdate(false);
//   };

//   // ========================================================================
//   // واجهة المستخدم (تصميم Glassmorphism منظم ومتجاوب — بدون تغيير أي وظيفة)
//   // ========================================================================
//   return (
//     <div className={`${update ? 'fixed inset-0 z-50 flex items-center justify-center' : 'hidden'}`}>
//       {/* Overlay */}
//       <div
//         className="absolute inset-0 bg-black/55 backdrop-blur-sm transition-opacity"
//         onClick={() => setUpdate(false)}
//         aria-hidden="true"
//       />

//       {/* Modal */}
//       <div className="relative w-[95%] sm:w-[86%] md:w-3/4 lg:w-2/3 max-w-[1100px] max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl">
//         {/* Glass panel */}
//         <div
//           className="relative flex flex-col md:flex-row w-full h-full
//             bg-white/6 dark:bg-black/40 border border-lightMode-text2/10 dark:border-gray-700/40
//             backdrop-blur-md backdrop-saturate-150
//             rounded-3xl overflow-hidden"
//           style={{ boxShadow: '0 10px 30px rgba(2,6,23,0.6)' }}
//         >
//           {/* Left: Form content (scrollable) */}
//           <div className="w-full md:w-2/3 max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
//             {/* Header */}
//             <div className="flex items-start justify-between gap-4">
//               <div>
//                 <h2 className="text-2xl sm:text-3xl font-extrabold text-lightMode-text dark:text-darkMode-text">
//                   {t("Edit Profile Information")}
//                 </h2>
//                 <p className="mt-1 text-sm text-lightMode-text2 dark:text-gray-400">
//                   {t("Update your public profile and personal details. Fields with no changes will be ignored.")}
//                 </p>
//               </div>

//               {/* Close button */}
//               <button
//                 onClick={() => setUpdate(false)}
//                 aria-label="Close"
//                 className="ml-auto p-2 rounded-lg hover:bg-lightMode-menu/30 dark:hover:bg-gray-800 transition"
//               >
//                 <FiX className="text-xl text-lightMode-text2 dark:text-gray-300" />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">

//               {/* -------------------- قسم المعلومات الأساسية -------------------- */}
//               <fieldset className="bg-lightMode-menu/40 dark:bg-gray-900/40 border border-lightMode-text2/10 dark:border-gray-700/40 rounded-2xl p-4 sm:p-5 space-y-4">
//                 <legend className="px-2 text-lg font-semibold text-lightMode-fg dark:text-darkMode-fg">{t("Basic Info")}</legend>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {[
//                     { label: t('Username'), name: 'username', placeholder: t('Enter username') },
//                     { label: t('Profile Name'), name: 'profileName', placeholder: t('Display name') },
//                     { label: t('Country'), name: 'country', placeholder: t('Your country') },
//                     { label: t('City'), name: 'city', placeholder: t('Your city') },
//                     { label: t('Phone'), name: 'phone', placeholder: '+20 10xxx' },
//                     { label: t('Preferred Language'), name: 'preferedLanguage', placeholder: t('e.g., Arabic, English') },
//                   ].map(({ label, name, placeholder }) => (
//                     <div key={name} className="flex flex-col">
//                       <label htmlFor={name} className="text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2">
//                         {label}
//                       </label>
//                       <input
//                         id={name}
//                         name={name}
//                         value={formData[name]}
//                         onChange={handleChange}
//                         className={`${inputStyle} `}
//                         placeholder={placeholder}
//                       />
//                     </div>
//                   ))}

//                   <div className="sm:col-span-2 flex flex-col">
//                     <label htmlFor="description" className="text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2">
//                       {t('Bio')}
//                     </label>
//                     <textarea
//                       id="description"
//                       name="description"
//                       value={formData.description}
//                       onChange={handleChange}
//                       className={`${inputStyle} h-24 resize-none`}
//                       placeholder={t('Short bio about yourself (max 150 characters)')}
//                       maxLength={150}
//                     />
//                     <div className="text-xs mt-1 text-lightMode-text2 dark:text-gray-500">
//                       {formData.description.length}/150
//                     </div>
//                   </div>
//                 </div>
//               </fieldset>

//               {/* -------------------- قسم التفاصيل الشخصية -------------------- */}
//               <fieldset className="bg-lightMode-menu/40 dark:bg-gray-900/40 border border-lightMode-text2/10 dark:border-gray-700/40 rounded-2xl p-4 sm:p-5 space-y-4">
//                 <legend className="px-2 text-lg font-semibold text-lightMode-fg dark:text-darkMode-fg">{t("Personal Details")}</legend>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="flex flex-col">
//                     <label htmlFor="dateOfBirth" className="text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2">
//                       {t("Date of Birth")}
//                     </label>
//                     <input id="dateOfBirth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputStyle} />
//                   </div>

//                   <div className="flex flex-col">
//                     <label htmlFor="gender" className="text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2">
//                       {t("Gender")}
//                     </label>
//                     <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className={inputStyle}>
//                       <option value="">{t("Select")}</option>
//                       <option>{t("Male")}</option>
//                       <option>{t("Female")}</option>
//                       <option>{t("Other")}</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="mt-2">
//                   <label htmlFor="relationshipStatus" className="text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2 block">
//                     {t("Relationship Status")}
//                   </label>
//                   <select id="relationshipStatus" name="relationshipStatus" value={formData.relationshipStatus} onChange={handleChange} className={inputStyle}>
//                     <option value="">{t("Select")}</option>
//                     <option>{t("Single")}</option>
//                     <option>{t("In a Relationship")}</option>
//                     <option>{t("Married")}</option>
//                     <option>{t("Divorced")}</option>
//                   </select>
//                 </div>

//                 {(formData.relationshipStatus === t("In a Relationship") || formData.relationshipStatus === t("Married")) && (
//                   <div className="mt-2">
//                     <label className="text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2 block">{t("Choose Partner (Must be a follower)")}</label>
//                     <div className="max-h-44 overflow-y-auto border border-lightMode-text2/10 dark:border-gray-700/40 rounded-lg p-1">
//                       {user?.following?.length ? (
//                         user.following.map(f => (
//                           <div
//                             key={f._id}
//                             onClick={() => setFormData(prev => ({ ...prev, partner: f._id }))}
//                             className={`flex items-center gap-3 p-2 cursor-pointer rounded-md transition ${
//                               formData.partner === f._id
//                                 ? 'bg-lightMode-text/10 dark:bg-darkMode-text/20'
//                                 : 'hover:bg-lightMode-menu/40 dark:hover:bg-gray-800/60'
//                             }`}
//                           >
//                             {formData.partner === f._id ? <FaCheckCircle className="text-lightMode-text dark:text-darkMode-text" /> : <div className="w-5" />}
//                             <Image
//                               width={40}
//                               height={40}
//                               src={f?.profilePhoto?.url || "/default-avatar.png"}
//                               alt={f?.username}
//                               className="w-10 h-10 rounded-full object-cover"
//                             />
//                             <div className="flex-1">
//                               <div className="text-sm font-medium text-lightMode-text dark:text-white">{f?.profileName || f?.username}</div>
//                               <div className="text-xs text-lightMode-text2 dark:text-gray-400">{f?.username}</div>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <p className="text-sm text-center text-lightMode-text2 dark:text-gray-500 p-3">{t("You must follow someone to choose a partner.")}</p>
//                       )}
//                     </div>

//                     {formData.partner && (
//                       <button type="button" onClick={() => setFormData(prev => ({ ...prev, partner: '' }))} className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-500 transition flex items-center gap-2">
//                         <FiX className="inline" /> {t("Clear Selection")}
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </fieldset>

//               {/* -------------------- قسم الاهتمامات -------------------- */}
//               <fieldset className="bg-lightMode-menu/40 dark:bg-gray-900/40 border border-lightMode-text2/10 dark:border-gray-700/40 rounded-2xl p-4 sm:p-5 space-y-3">
//                 <legend className="px-2 text-lg font-semibold text-lightMode-fg dark:text-darkMode-fg">{t("Interests and Hobbies")}</legend>

//                 <div>
//                   <label className="block text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2">{t("Current Interests")}</label>
//                   <div className="flex flex-wrap gap-2 mb-3 min-h-[48px] p-2 rounded-lg border border-lightMode-text2/10 dark:border-gray-700/40">
//                     {formData.interests.length > 0 ? (
//                       formData.interests.map((interest, i) => (
//                         <span key={i} className="flex items-center gap-2 px-3 py-1 bg-lightMode-text/8 dark:bg-gray-700 rounded-full text-sm text-lightMode-text dark:text-gray-100">
//                           <span>{interest}</span>
//                           <FiX className="cursor-pointer text-red-600 dark:text-red-400 hover:text-red-500" onClick={() => handleRemoveInterest(interest)} />
//                         </span>
//                       ))
//                     ) : (
//                       <p className="text-sm text-lightMode-text2 dark:text-gray-500 italic">{t("No interests added yet.")}</p>
//                     )}
//                   </div>

//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       name="newInterest"
//                       placeholder={t("Add a new interest")}
//                       value={formData.newInterest}
//                       onChange={handleChange}
//                       className={`${inputStyle} flex-1`}
//                       onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
//                     />
//                     <button
//                       type="button"
//                       onClick={handleAddInterest}
//                       className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-lightMode-text/90 dark:bg-darkMode-text text-white dark:text-black font-medium hover:opacity-95 transition"
//                     >
//                       <FaPlus /> <span className="hidden sm:inline">{t('Add')}</span>
//                     </button>
//                   </div>

//                   <p className="text-xs text-lightMode-text2 dark:text-gray-500 mt-2">{t("Type an interest and press Enter or click the plus icon.")}</p>
//                 </div>
//               </fieldset>

//               {/* -------------------- قسم الروابط الاجتماعية -------------------- */}
//               <fieldset className="bg-lightMode-menu/40 dark:bg-gray-900/40 border border-lightMode-text2/10 dark:border-gray-700/40 rounded-2xl p-4 sm:p-5 space-y-3">
//                 <legend className="px-2 text-lg font-semibold text-lightMode-fg dark:text-darkMode-fg">{t("Social Links")}</legend>
//                 <div className="space-y-3">
//                   {socialFields.map(({ name, label, icon }) => (
//                     <div key={name} className="flex items-center gap-3">
//                       <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-lightMode-menu/60 dark:bg-gray-700 rounded-lg text-lg text-lightMode-text dark:text-gray-100">
//                         {icon}
//                       </div>
//                       <div className="flex-1">
//                         <label htmlFor={name} className="text-xs text-lightMode-text2 dark:text-gray-400 mb-1 block">{label}</label>
//                         <input
//                           id={name}
//                           name={name}
//                           value={formData.socialLinks[name] || ''}
//                           onChange={handleChange}
//                           placeholder={`${label} URL (Optional)`}
//                           className={inputStyle}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </fieldset>

//               {/* -------------------- زر الحفظ (مع مؤشر تحميل مدمج) -------------------- */}
//               <div className="pt-2">
//                 <button
//                   type="submit"
//                   disabled={updateProfileLoading}
//                   className={`w-full py-3 px-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center transition ${
//                     updateProfileLoading
//                       ? 'bg-lightMode-text2/50 dark:bg-gray-600 cursor-not-allowed text-gray-400'
//                       : 'bg-lightMode-text dark:bg-darkMode-text hover:opacity-95 text-white dark:text-black'
//                   }`}
//                 >
//                   {updateProfileLoading ? (
//                     <>
//                       <FiLoader className="animate-spin text-black mr-2" />
//                       {t('Saving...')}
//                     </>
//                   ) : (
//                     t('Save Changes')
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Right: compact sidebar (summary + quick social) */}
//           <aside className="hidden md:flex md:w-1/3 flex-col gap-4 p-6 border-l border-lightMode-text2/6 dark:border-gray-700/30">
//             <div className="rounded-2xl p-4 bg-lightMode-menu/30 dark:bg-gray-900/30 border border-lightMode-text2/8 dark:border-gray-700/30 backdrop-blur-sm">
//               <h4 className="text-sm font-semibold text-lightMode-text dark:text-white"> {t('Quick Summary')} </h4>
//               <p className="text-xs text-lightMode-text2 dark:text-gray-400 mt-2">
//                 {t('Make sure your profile looks great. Preview how your details appear to other users.')}
//               </p>

//               <div className="mt-4 space-y-3">
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 rounded-xl bg-lightMode-menu/50 dark:bg-gray-800 flex items-center justify-center">
//                     <Image src={user?.profilePhoto?.url || '/default-avatar.png'} width={44} height={44} alt="avatar" className="rounded-lg object-cover" />
//                   </div>
//                   <div>
//                     <div className="text-sm font-medium text-lightMode-text dark:text-white">{user?.profileName || user?.username || t('No name')}</div>
//                     <div className="text-xs text-lightMode-text2 dark:text-gray-400">{user?.username ? `@${user.username}` : ''}</div>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2 flex-wrap">
//                   {Object.entries(formData.socialLinks || {}).map(([k, v]) => v ? (
//                     <div key={k} className="text-xs px-3 py-1 bg-lightMode-text/8 dark:bg-gray-800 rounded-full">{k}</div>
//                   ) : null)}
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-2xl p-4 bg-lightMode-menu/30 dark:bg-gray-900/30 border border-lightMode-text2/8 dark:border-gray-700/30 backdrop-blur-sm">
//               <h4 className="text-sm font-semibold text-lightMode-text dark:text-white">{t('Tips')}</h4>
//               <ul className="text-xs text-lightMode-text2 dark:text-gray-400 mt-3 space-y-2">
//                 <li>• {t('Keep bio short and descriptive')}</li>
//                 <li>• {t('Use social links to show your work')}</li>
//                 <li>• {t('Add interests to improve recommendations')}</li>
//               </ul>
//             </div>

//             <div className="mt-auto text-center">
//               <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-xs text-lightMode-text2 dark:text-gray-400 hover:underline">
//                 {t('Back to top')}
//               </button>
//             </div>
//           </aside>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateProfile;


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
  "w-full py-3 px-4 text-sm " +
  "text-lightMode-fg dark:text-darkMode-fg " +
  "bg-lightMode-menu/60 dark:bg-gray-800/65 " +
  "backdrop-blur-sm border border-lightMode-text2/20 dark:border-gray-700/40 " +
  "rounded-lg placeholder:text-gray-400 " +
  "focus:outline-none focus:ring-2 focus:ring-lightMode-text dark:focus:ring-darkMode-text transition";

// أيقونات/حقول الشبكات الاجتماعية
const socialFields = [
  { name: 'github', label: 'GitHub', icon: <FaGithub /> },
  { name: 'linkedin', label: 'LinkedIn', icon: <FaLinkedin className="text-blue-600 dark:text-blue-400" /> },
  { name: 'twitter', label: 'Twitter', icon: <FaTwitter className="text-blue-500" /> },
  { name: 'facebook', label: 'Facebook', icon: <FaFacebook className="text-blue-700 dark:text-blue-600" /> },
  { name: 'website', label: 'Website', icon: <FaGlobe className="text-lightMode-text dark:text-darkMode-text" /> },
];

// ============================================================================
// مكون تحديث الملف الشخصي (معدل ليكون محتوى تبويب)
// ******************************************************
// تم إزالة: خاصيتي update و setUpdate
// تم إزالة: منطق الـ Modal الخارجي والـ Overlay
// تم إزالة: أمر setUpdate(false) من دالة handleSubmit
// ******************************************************
// ============================================================================

const UpdateProfile = ({ user }) => { // 1. تم إزالة update, setUpdate من الـ props
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

  // --------------------------- التعامل مع تغييرات الإدخال (الوظيفة محفوظة) ---------------------------
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

  // --------------------------- الاهتمامات (Interests) (الوظيفة محفوظة) ---------------------------
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

  // --------------------------- منطق المقارنة والإرسال (الوظيفة محفوظة) ---------------------------
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
    // 2. تم إزالة setUpdate(false);
  };

  // ========================================================================
  // واجهة المستخدم (تعديل الهيكل ليناسب التضمين في صفحة)
  // ========================================================================
  return (
    <div className="w-full"> {/* 3. إزالة غلاف الـ Modal الشرطي */}
      
      {/* 3. تم إزالة الـ Overlay */}

      {/* Main Container - تم تعديل التنسيقات لتناسب محتوى صفحة بدلًا من نافذة منبثقة */}
      <div className="relative w-full"> 
        {/* Glass panel - تم إزالة max-w و max-h */}
        <div
          className="relative flex flex-col md:flex-row w-full
            bg-lightMode-menu/60 dark:bg-black/50 border border-lightMode-text2/10 dark:border-gray-700/40
            backdrop-blur-md backdrop-saturate-150
            rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 5px 20px rgba(2,6,23,0.15)' }} // ظل أخف
        >
          {/* Left: Form content (scrollable) - تم إزالة محددات الارتفاع ليتدفق مع الصفحة */}
          <div className="w-full md:w-2/3 overflow-y-visible p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-lightMode-text dark:text-darkMode-text">
                  {t("Edit Profile Information")}
                </h2>
                <p className="mt-1 text-sm text-lightMode-text2 dark:text-gray-400">
                  {t("Update your public profile and personal details. Fields with no changes will be ignored.")}
                </p>
              </div>

              {/* 3. تم إزالة زر الإغلاق (لأنه لم يعد نافذة منبثقة) */}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* -------------------- قسم المعلومات الأساسية -------------------- (محفوظ) */}
              <fieldset className="bg-lightMode-menu/40 dark:bg-gray-900/40 border border-lightMode-text2/10 dark:border-gray-700/40 rounded-2xl p-4 sm:p-5 space-y-4">
                <legend className="px-2 text-lg font-semibold text-lightMode-fg dark:text-darkMode-fg">{t("Basic Info")}</legend>

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
                        className={`${inputStyle} `}
                        placeholder={placeholder}
                      />
                    </div>
                  ))}

                  <div className="sm:col-span-2 flex flex-col">
                    <label htmlFor="description" className="text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2">
                      {t('Bio')}
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
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

              {/* -------------------- قسم التفاصيل الشخصية -------------------- (محفوظ) */}
              <fieldset className="bg-lightMode-menu/40 dark:bg-gray-900/40 border border-lightMode-text2/10 dark:border-gray-700/40 rounded-2xl p-4 sm:p-5 space-y-4">
                <legend className="px-2 text-lg font-semibold text-lightMode-fg dark:text-darkMode-fg">{t("Personal Details")}</legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="dateOfBirth" className="text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2">
                      {t("Date of Birth")}
                    </label>
                    <input id="dateOfBirth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputStyle} />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="gender" className="text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2">
                      {t("Gender")}
                    </label>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className={inputStyle}>
                      <option value="">{t("Select")}</option>
                      <option>{t("Male")}</option>
                      <option>{t("Female")}</option>
                      <option>{t("Other")}</option>
                    </select>
                  </div>
                </div>

                <div className="mt-2">
                  <label htmlFor="relationshipStatus" className="text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2 block">
                    {t("Relationship Status")}
                  </label>
                  <select id="relationshipStatus" name="relationshipStatus" value={formData.relationshipStatus} onChange={handleChange} className={inputStyle}>
                    <option value="">{t("Select")}</option>
                    <option>{t("Single")}</option>
                    <option>{t("In a Relationship")}</option>
                    <option>{t("Married")}</option>
                    <option>{t("Divorced")}</option>
                  </select>
                </div>

                {(formData.relationshipStatus === t("In a Relationship") || formData.relationshipStatus === t("Married")) && (
                  <div className="mt-2">
                    <label className="text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2 block">{t("Choose Partner (Must be a follower)")}</label>
                    <div className="max-h-44 overflow-y-auto border border-lightMode-text2/10 dark:border-gray-700/40 rounded-lg p-1">
                      {user?.following?.length ? (
                        user.following.map(f => (
                          <div
                            key={f._id}
                            onClick={() => setFormData(prev => ({ ...prev, partner: f._id }))}
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
                              src={f?.profilePhoto?.url || "/default-avatar.png"}
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
                        <p className="text-sm text-center text-lightMode-text2 dark:text-gray-500 p-3">{t("You must follow someone to choose a partner.")}</p>
                      )}
                    </div>

                    {formData.partner && (
                      <button type="button" onClick={() => setFormData(prev => ({ ...prev, partner: '' }))} className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-500 transition flex items-center gap-2">
                        <FiX className="inline" /> {t("Clear Selection")}
                      </button>
                    )}
                  </div>
                )}
              </fieldset>

              {/* -------------------- قسم الاهتمامات -------------------- (محفوظ) */}
              <fieldset className="bg-lightMode-menu/40 dark:bg-gray-900/40 border border-lightMode-text2/10 dark:border-gray-700/40 rounded-2xl p-4 sm:p-5 space-y-3">
                <legend className="px-2 text-lg font-semibold text-lightMode-fg dark:text-darkMode-fg">{t("Interests and Hobbies")}</legend>

                <div>
                  <label className="block text-sm font-medium text-lightMode-text2 dark:text-gray-300 mb-2">{t("Current Interests")}</label>
                  <div className="flex flex-wrap gap-2 mb-3 min-h-[48px] p-2 rounded-lg border border-lightMode-text2/10 dark:border-gray-700/40">
                    {formData.interests.length > 0 ? (
                      formData.interests.map((interest, i) => (
                        <span key={i} className="flex items-center gap-2 px-3 py-1 bg-lightMode-text/8 dark:bg-gray-700 rounded-full text-sm text-lightMode-text dark:text-gray-100">
                          <span>{interest}</span>
                          <FiX className="cursor-pointer text-red-600 dark:text-red-400 hover:text-red-500" onClick={() => handleRemoveInterest(interest)} />
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
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-lightMode-text/90 dark:bg-darkMode-text text-white dark:text-black font-medium hover:opacity-95 transition"
                    >
                      <FaPlus /> <span className="hidden sm:inline">{t('Add')}</span>
                    </button>
                  </div>

                  <p className="text-xs text-lightMode-text2 dark:text-gray-500 mt-2">{t("Type an interest and press Enter or click the plus icon.")}</p>
                </div>
              </fieldset>

              {/* -------------------- قسم الروابط الاجتماعية -------------------- (محفوظ) */}
              <fieldset className="bg-lightMode-menu/40 dark:bg-gray-900/40 border border-lightMode-text2/10 dark:border-gray-700/40 rounded-2xl p-4 sm:p-5 space-y-3">
                <legend className="px-2 text-lg font-semibold text-lightMode-fg dark:text-darkMode-fg">{t("Social Links")}</legend>
                <div className="space-y-3">
                  {socialFields.map(({ name, label, icon }) => (
                    <div key={name} className="flex items-center gap-3">
                      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-lightMode-menu/60 dark:bg-gray-700 rounded-lg text-lg text-lightMode-text dark:text-gray-100">
                        {icon}
                      </div>
                      <div className="flex-1">
                        <label htmlFor={name} className="text-xs text-lightMode-text2 dark:text-gray-400 mb-1 block">{label}</label>
                        <input
                          id={name}
                          name={name}
                          value={formData.socialLinks[name] || ''}
                          onChange={handleChange}
                          placeholder={`${label} URL (Optional)`}
                          className={inputStyle}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>

              {/* -------------------- زر الحفظ (محفوظ) -------------------- */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={updateProfileLoading}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center transition ${
                    updateProfileLoading
                      ? 'bg-lightMode-text2/50 dark:bg-gray-600 cursor-not-allowed text-gray-400'
                      : 'bg-lightMode-text dark:bg-darkMode-text hover:opacity-95 text-white dark:text-black'
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
              </div>
            </form>
          </div>

          {/* Right: compact sidebar (summary + quick social) - (محفوظ) */}
          <aside className="hidden md:flex md:w-1/3 flex-col gap-4 p-6 border-l border-lightMode-text2/6 dark:border-gray-700/30">
            <div className="rounded-2xl p-4 bg-lightMode-menu/30 dark:bg-gray-900/30 border border-lightMode-text2/8 dark:border-gray-700/30 backdrop-blur-sm">
              <h4 className="text-sm font-semibold text-lightMode-text dark:text-white"> {t('Quick Summary')} </h4>
              <p className="text-xs text-lightMode-text2 dark:text-gray-400 mt-2">
                {t('Make sure your profile looks great. Preview how your details appear to other users.')}
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-lightMode-menu/50 dark:bg-gray-800 flex items-center justify-center">
                    <Image src={user?.profilePhoto?.url || '/default-avatar.png'} width={44} height={44} alt="avatar" className="rounded-lg object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-lightMode-text dark:text-white">{user?.profileName || user?.username || t('No name')}</div>
                    <div className="text-xs text-lightMode-text2 dark:text-gray-400">{user?.username ? `@${user.username}` : ''}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {Object.entries(formData.socialLinks || {}).map(([k, v]) => v ? (
                    <div key={k} className="text-xs px-3 py-1 bg-lightMode-text/8 dark:bg-gray-800 rounded-full">{k}</div>
                  ) : null)}
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-4 bg-lightMode-menu/30 dark:bg-gray-900/30 border border-lightMode-text2/8 dark:border-gray-700/30 backdrop-blur-sm">
              <h4 className="text-sm font-semibold text-lightMode-text dark:text-white">{t('Tips')}</h4>
              <ul className="text-xs text-lightMode-text2 dark:text-gray-400 mt-3 space-y-2">
                <li>• {t('Keep bio short and descriptive')}</li>
                <li>• {t('Use social links to show your work')}</li>
                <li>• {t('Add interests to improve recommendations')}</li>
              </ul>
            </div>

            <div className="mt-auto text-center">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-xs text-lightMode-text2 dark:text-gray-400 hover:underline">
                {t('Back to top')}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;