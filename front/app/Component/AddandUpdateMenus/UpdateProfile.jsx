'use client';
import React, { useState, useEffect } from 'react';
import { FiX, FiLoader } from 'react-icons/fi';
import {
  FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaGlobe, FaPlus
} from 'react-icons/fa';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useUser } from '@/app/Context/UserContext';

// --------------------------- إعدادات الأنماط العامة ---------------------------
const inputStyle =
  "w-full py-3 px-4 text-sm text-white bg-[#1f1f1f] border border-gray-700 rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition";

const socialFields = [
  { name: 'github', label: 'GitHub', icon: <FaGithub /> },
  { name: 'linkedin', label: 'LinkedIn', icon: <FaLinkedin className="text-blue-400" /> },
  { name: 'twitter', label: 'Twitter', icon: <FaTwitter className="text-blue-500" /> },
  { name: 'facebook', label: 'Facebook', icon: <FaFacebook className="text-blue-600" /> },
  { name: 'website', label: 'Website', icon: <FaGlobe className="text-green-400" /> },
];

// ============================================================================
// مكون تحديث الملف الشخصي
// ============================================================================
const UpdateProfile = ({ update, setUpdate, user }) => {
  const { updateProfile, updateProfileLoading } = useUser();

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
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      facebook: '',
      website: '',
    },
  });

  // --------------------------- تحميل بيانات المستخدم ---------------------------
  useEffect(() => {
    if (!user) return;
    setFormData(prev => ({
      ...prev,
      username: user.username || '',
      profileName: user.profileName || '',
      description: user.description || '',
      country: user.country || '',
      phone: user.phone || '',
      city: user.city || '',
      gender: user.gender || '',
      relationshipStatus: user.relationshipStatus || '',
      partner: user.partner || '',
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
    }));
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
    if (interest && !formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest],
        newInterest: '',
      }));
    }
  };

  const handleRemoveInterest = (interest) =>
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest),
    }));

  // --------------------------- إرسال النموذج ---------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {};
    const fields = [
      'username', 'profileName', 'description', 'country', 'phone',
      'dateOfBirth', 'gender', 'city', 'preferedLanguage',
      'relationshipStatus', 'partner',
    ];

    // نسخ القيم غير الفارغة فقط
    fields.forEach(f => {
      const value = formData[f]?.trim?.() || formData[f];
      if (value) payload[f] = value;
    });

    // الاهتمامات
    if (formData.interests.length > 0)
      payload.interests = Array.from(new Set([...(user?.interests || []), ...formData.interests]));

    // الروابط الاجتماعية
    const links = Object.fromEntries(
      Object.entries(formData.socialLinks).filter(([_, v]) => v.trim() !== '')
    );
    if (Object.keys(links).length > 0) payload.socialLinks = links;

    if (Object.keys(payload).length === 0)
      return toast.error("Please fill in at least one field.");

    updateProfile(payload);
  };

  // ========================================================================
  // واجهة المستخدم
  // ========================================================================
  return (
    <div className={`${update ? 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center' : 'hidden'}`}>
      <div className="relative bg-[#181818] text-white w-[95%] max-w-2xl rounded-2xl shadow-2xl p-6 animate-fade-in space-y-6 max-h-[90vh] overflow-y-auto">

        {/* شاشة التحميل */}
        {updateProfileLoading && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-50 rounded-2xl backdrop-blur-sm">
            <FiLoader className="animate-spin text-green-400 text-4xl mb-3" />
            <p className="text-gray-300 font-semibold text-lg">Updating profile...</p>
          </div>
        )}

        {/* زر الإغلاق */}
        <button onClick={() => setUpdate(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl transition">
          <FiX />
        </button>

        <h2 className="text-3xl font-bold text-center border-b pb-3 border-gray-700">Edit Profile Info</h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* -------------------- المعلومات الأساسية -------------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Username', name: 'username', placeholder: 'Enter username' },
              { label: 'Profile Name', name: 'profileName', placeholder: 'Display name' },
              { label: 'Bio', name: 'description', placeholder: 'Short bio', col: true },
              { label: 'Country', name: 'country', placeholder: 'Your country' },
              { label: 'City', name: 'city', placeholder: 'Your city' },
              { label: 'Phone', name: 'phone', placeholder: '+20 10xxx' },
            ].map(({ label, name, placeholder, col }) => (
              <div key={name} className={col ? 'sm:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
                <input
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder={placeholder}
                />
              </div>
            ))}

            {/* باقي الحقول */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputStyle} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Preferred Language</label>
              <input name="preferedLanguage" value={formData.preferedLanguage} onChange={handleChange} placeholder="Preferred Language" className={inputStyle} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className={inputStyle}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* -------------------- الحالة الاجتماعية -------------------- */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Relationship Status</label>
            <select name="relationshipStatus" value={formData.relationshipStatus} onChange={handleChange} className={inputStyle}>
              <option value="">Select</option>
              <option>Single</option>
              <option>In a Relationship</option>
              <option>Married</option>
              <option>Divorced</option>
            </select>
          </div>

          {/* اختيار الشريك */}
          {(formData.relationshipStatus === "In a Relationship" || formData.relationshipStatus === "Married") && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Choose Partner</label>
              <div className="max-h-48 overflow-y-auto border border-gray-700 rounded-xl">
                {user?.following?.length ? (
                  user.following.map(f => (
                    <div
                      key={f._id}
                      onClick={() => setFormData(prev => ({ ...prev, partner: f._id }))}
                      className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-700 transition ${formData.partner === f._id ? "bg-green-600/30" : ""}`}
                    >
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
                  <p className="text-sm text-gray-500 p-3">You must follow someone to choose a partner.</p>
                )}
              </div>
              {formData.partner && (
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, partner: '' }))} className="mt-2 text-sm text-red-400 hover:underline">
                  Clear Selection
                </button>
              )}
            </div>
          )}

          {/* -------------------- الاهتمامات -------------------- */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Interests</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.interests.map((interest, i) => (
                <span key={i} className="flex items-center gap-1 px-3 py-1 bg-gray-700 rounded-full text-sm">
                  {interest}
                  <FiX className="cursor-pointer hover:text-red-400" onClick={() => handleRemoveInterest(interest)} />
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                name="newInterest"
                placeholder="Add new interest"
                value={formData.newInterest}
                onChange={handleChange}
                className={`${inputStyle} flex-1`}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
              />
              <button type="button" onClick={handleAddInterest} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-xl transition text-white font-semibold">
                <FaPlus />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Add multiple interests, then press Enter or click +</p>
          </div>

          {/* -------------------- الروابط الاجتماعية -------------------- */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Social Links</h3>
            <div className="space-y-4">
              {socialFields.map(({ name, label, icon }) => (
                <div key={name} className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full">{icon}</div>
                  <input
                    name={name}
                    value={formData.socialLinks[name]}
                    onChange={handleChange}
                    placeholder={`${label} URL`}
                    className={inputStyle}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* -------------------- زر الحفظ -------------------- */}
          <button
            type="submit"
            disabled={updateProfileLoading}
            className={`w-full mt-6 py-3 px-4 rounded-xl font-semibold text-lg shadow-lg transition ${
              updateProfileLoading
                ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                : 'bg-green-600 hover:bg-green-500 text-white'
            }`}
          >
            {updateProfileLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
