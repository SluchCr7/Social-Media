# 🎨 Remaining Components Update Guide

## Components to Update with Neural Glass Design

This document provides the design patterns and code snippets to update the remaining components.

---

## 🎯 Design System Reference

### Color Palette
```css
/* Backgrounds */
bg-white/95 dark:bg-[#0A0A0A]/98
bg-white/70 dark:bg-white/[0.02]

/* Borders */
border-gray-200 dark:border-white/10
border-gray-100 dark:border-white/5

/* Text */
text-gray-900 dark:text-white
text-gray-600 dark:text-gray-400

/* Accent Colors */
Indigo: from-indigo-600 to-indigo-500
Rose: from-rose-600 to-rose-500
Emerald: from-emerald-600 to-emerald-500
```

### Typography
```css
/* Headers */
text-2xl font-black uppercase tracking-tighter

/* Labels */
text-[10px] font-black uppercase tracking-widest

/* Body */
text-base font-medium
```

### Spacing & Borders
```css
rounded-[3rem]  /* Modals */
rounded-2xl     /* Buttons, Cards */
rounded-xl      /* Inputs */
p-10            /* Modal padding */
gap-6           /* Standard spacing */
```

---

## 📝 SharePost.jsx Update

```javascript
'use client';

import { useState } from "react";
import Image from "next/image";
import { HiShare, HiXMark, HiPaperAirplane } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

export const ShareModal = ({ post, isOpen, onClose, onShare }) => {
  const [customText, setCustomText] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    await onShare(post?._id, customText);
    setIsSharing(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/95 dark:bg-[#0A0A0A]/98 backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-[3rem] shadow-2xl max-w-2xl w-full p-10 relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                  <HiShare className="w-7 h-7 text-indigo-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Share Post</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Amplify Signal</p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5">
                <HiXMark className="w-6 h-6" />
              </button>
            </div>

            {/* Custom Text */}
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Add your thoughts..."
              className="w-full h-32 p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-gray-50 dark:bg-white/[0.03] resize-none mb-6"
            />

            {/* Post Preview */}
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 mb-6">
              {/* Post content preview */}
            </div>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShare}
              disabled={isSharing}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3"
            >
              {isSharing ? "Sharing..." : <><HiPaperAirplane /> Share Now</>}
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
```

---

## 📝 EditPostModel.jsx Update

```javascript
// Similar structure to SharePost but with edit functionality
// Key changes:
- Icon: HiPencilSquare
- Accent: Emerald (from-emerald-600 to-emerald-500)
- Title: "Edit Post" / "Modify Signal"
- Include image upload preview
- Save button instead of Share
```

---

## 📝 EditCommunityMenu.jsx Update

```javascript
// Community editing modal
// Key changes:
- Icon: HiUsers
- Accent: Purple (from-purple-600 to-purple-500)
- Title: "Edit Community" / "Configure Node"
- Include cover image upload
- Category selector with pills
- Privacy settings toggle
```

---

## 📝 MenuUploadReel.jsx Update

```javascript
// Reel upload modal
// Key changes:
- Icon: HiFilm
- Accent: Rose (from-rose-600 to-rose-500)
- Title: "Upload Reel" / "Inject Video"
- Video preview player
- Thumbnail selector
- Caption input with character count
```

---

## 📝 UpdateProfile.jsx Update

```javascript
// Profile update modal (large form)
// Key changes:
- Icon: HiUser
- Accent: Indigo
- Title: "Update Profile" / "Identity Matrix"
- Tabbed sections: Basic Info, Social Links, Privacy
- Image upload for profile/cover
- Bio with markdown preview
- Save changes button with confirmation
```

---

## 🎨 Settings Page Components

### Settings/Design.jsx

```javascript
'use client';

import { motion } from 'framer-motion';
import { HiCog, HiSignal } from 'react-icons/hi2';

export default function SettingsDesign({ activeTab, setActiveTab, tabs, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#050505] dark:via-[#0A0A0A] dark:to-[#050505]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0A0A0A]/90 backdrop-blur-3xl border-b border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
              <HiCog className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">
                Settings <span className="text-indigo-500">Console</span>
              </h1>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500">
                <HiSignal className="w-3 h-3 animate-pulse" />
                Configuration Active
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <motion.button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                whileHover={{ scale: 1.02 }}
                className={`px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap ${
                  activeTab === tab.name
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
```

---

## 🎯 Common Patterns

### Modal Wrapper
```javascript
<div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
  <motion.div
    initial={{ scale: 0.9, opacity: 0, y: 20 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    exit={{ scale: 0.9, opacity: 0, y: 20 }}
    className="bg-white/95 dark:bg-[#0A0A0A]/98 backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-[3rem] shadow-2xl max-w-2xl w-full p-10"
  >
```

### Form Input
```javascript
<input
  className="w-full p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
/>
```

### Submit Button
```javascript
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-500/30"
>
  <HiPaperAirplane className="w-5 h-5" />
  Submit
</motion.button>
```

### Section Header
```javascript
<div className="flex items-center gap-4 mb-8">
  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
    <Icon className="w-7 h-7 text-indigo-500" />
  </div>
  <div>
    <h2 className="text-2xl font-black uppercase tracking-tighter">Title</h2>
    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Subtitle</p>
  </div>
</div>
```

---

## 🚀 Implementation Checklist

- [ ] SharePost.jsx - Share modal
- [ ] EditPostModel.jsx - Post editing
- [ ] EditCommunityMenu.jsx - Community settings
- [ ] MenuUploadReel.jsx - Reel upload
- [ ] UpdateProfile.jsx - Profile editor
- [ ] Settings/Design.jsx - Settings layout
- [ ] Settings/Tabs/* - Individual setting tabs

---

## 📌 Notes

1. **Icons**: Use Heroicons 2 (hi2) throughout
2. **Animations**: Framer Motion for all transitions
3. **Glassmorphism**: backdrop-blur-3xl with subtle borders
4. **Typography**: Bold, uppercase, tight tracking
5. **Colors**: Indigo primary, contextual accents (rose/emerald/purple)
6. **Responsive**: Mobile-first with proper breakpoints
7. **Dark Mode**: Full support with proper color tokens

---

**Apply these patterns consistently across all remaining components for a cohesive Neural Glass aesthetic.**
