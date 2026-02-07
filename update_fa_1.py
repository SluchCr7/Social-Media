import json
import os

def update_translations(lang, updates):
    file_path = os.path.join(r"d:\Full-Projects\threadsV2\front\public\locales", lang, "translation.json")
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    data.update(updates)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

fa_updates_1 = {
  "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.": "شما مسئول حفظ محرمانگی اطلاعات حساب کاربری خود و تمامی فعالیت‌های انجام شده تحت حساب خود هستید.",
  "But every post you share today becomes a memory tomorrow. Keep broadcasting your story!": "اما هر پستی که امروز به اشتراک می‌گذارید، فردا به یک خاطره تبدیل می‌شود. به انتشار داستان خود ادامه دهید!",
  "✏️ Highlight updated successfully.": "✏️ هایلایت با موفقیت به‌روزرسانی شد.",
  "✅ Highlight created successfully!": "✅ هایلایت با موفقیت ایجاد شد!",
  "✅ Highlights reordered.": "✅ هایلایت‌ها دوباره مرتب شدند.",
  "✅ Order saved.": "✅ ترتیب ذخیره شد.",
  "✅ Reel shared successfully.": "✅ ریل با موفقیت به اشتراک گذاشته شد.",
  "✅ Signal broadcasted successfully!": "✅ سیگنال با موفقیت پخش شد!",
  "✅ Story published successfully.": "✅ استوری با موفقیت منتشر شد.",
  "✅ Story shared successfully!": "✅ استوری با موفقیت به اشتراک گذاشته شد!",
  "❌ Broadcast failed.": "❌ پخش با خطا مواجه شد.",
  "❌ Could not update highlight.": "❌ امکان به‌روزرسانی هایلایت وجود ندارد.",
  "❌ Failed to add story.": "❌ افزودن استوری با خطا مواجه شد.",
  "❌ Failed to react.": "❌ واکنش با خطا مواجه شد.",
  "❌ Failed to reorder highlights.": "❌ مرتب‌سازی هایلایت‌ها با خطا مواجه شد.",
  "❌ Failed to reorder stories.": "❌ مرتب‌سازی استوری‌ها با خطا مواجه شد.",
  "❌ Failed to share story.": "❌ اشتراک‌گذاری استوری با خطا مواجه شد.",
  "❌ Failed to share the Reel.": "❌ اشتراک‌گذاری ریل با خطا مواجه شد.",
  "❌ Failed to toggle love.": "❌ تغییر حالت لایک با خطا مواجه شد.",
  "⚠️ Please select a video first.": "⚠️ لطفا ابتدا یک ویدیو انتخاب کنید.",
  "⚠️ Please upload a valid video file.": "⚠️ لطفا یک فایل ویدیویی معتبر آپلود کنید."
}

update_translations('fa', fa_updates_1)
print("Updated FA Part 1")
