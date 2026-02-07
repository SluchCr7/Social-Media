import json
import os

def update_translations(lang, updates):
    file_path = os.path.join(r"d:\Full-Projects\threadsV2\front\public\locales", lang, "translation.json")
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    data.update(updates)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

ar_updates_1 = {
  "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.": "أنت مسؤول عن الحفاظ على سرية بيانات اعتماد حسابك وعن جميع الأنشطة التي تتم بموجب حسابك.",
  "But every post you share today becomes a memory tomorrow. Keep broadcasting your story!": "ولكن كل منشور تشاركه اليوم يصبح ذكرى غداً. استمر في نشر قصتك!",
  "✏️ Highlight updated successfully.": "✏️ تم تحديث التمييز بنجاح.",
  "✅ Highlight created successfully!": "✅ تم إنشاء التمييز بنجاح!",
  "✅ Highlights reordered.": "✅ تم إعادة ترتيب التمييزات.",
  "✅ Order saved.": "✅ تم حفظ الترتيب.",
  "✅ Reel shared successfully.": "✅ تم مشاركة الـ Reel بنجاح.",
  "✅ Signal broadcasted successfully!": "✅ تم بث الإشارة بنجاح!",
  "✅ Story published successfully.": "✅ تم نشر القصة بنجاح.",
  "✅ Story shared successfully!": "✅ تم مشاركة القصة بنجاح!",
  "❌ Broadcast failed.": "❌ فشل البث.",
  "❌ Could not update highlight.": "❌ تعذر تحديث التمييز.",
  "❌ Failed to add story.": "❌ فشل إضافة القصة.",
  "❌ Failed to react.": "❌ فشل التفاعل.",
  "❌ Failed to reorder highlights.": "❌ فشل إعادة ترتيب التمييزات.",
  "❌ Failed to reorder stories.": "❌ فشل إعادة ترتيب القصص.",
  "❌ Failed to share story.": "❌ فشل مشاركة القصة.",
  "❌ Failed to share the Reel.": "❌ فشل مشاركة الـ Reel.",
  "❌ Failed to toggle love.": "❌ فشل تغيير حالة الإعجاب.",
  "⚠️ Please select a video first.": "⚠️ يرجى اختيار فيديو أولاً.",
  "⚠️ Please upload a valid video file.": "⚠️ يرجى تحميل ملف فيديو صالح.",
  "About Hub": "حول المركز",
  "About Notification Blocking": "حول حظر التنبيهات",
  "Accept All Protocols": "قبول جميع البروتوكولات",
  "Acceptance": "القبول",
  "Acceptance of Terms": "قبول الشروط",
  "Access Registry": "سجل الوصول",
  "Account Access": "الوصول إلى الحساب",
  "Account Exports": "تصدير بيانات الحساب",
  "Account Governance": "حوكمة الحساب",
  "Account Privacy": "خصوصية الحساب",
  "Account Verified": "تم توثيق الحساب",
  "accounts": "حسابات",
  "Active Discourse": "نقاش نشط",
  "Active Nodes": "عقد نشطة",
  "Active Sessions": "جلسات نشطة",
  "Active Signals": "إشارات نشطة",
  "Active Stream": "بث مباشر"
}

update_translations('ar', ar_updates_1)
print("Updated AR Part 1")
