// utils/moderation.js

const bannedWords = [
  // كلمات مسيئة عامة
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "dick",
  "pussy",
  "damn",
  "bastard",
  "crap",
  "faggot",
  "slut",
  "whore",
  "cock",
  "nigger",
  "cunt",
  "motherfucker",

  // كلمات عنف أو تهديد
  "kill",
  "murder",
  "rape",
  "bomb",
  "terrorist",
  "shoot",
  "stab",

  // كلمات تمييز أو كراهية
  "racist",
  "jew",
  "kike",
  "chink",
  "gook",
  "fag",
  "nazi",
  "israel",
  // كلمات حساسة للبالغين
  "porn",
  "sex",
  "xxx",
  "nsfw",
  "erotic",
  "nude",
  "stripper",

  // كلمات محتوى محظور عام
  "drugs",
  "cocaine",
  "heroin",
  "meth",
  "weed",
  "marijuana"
];
function escapeRegex(word) {
  return word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // للهروب من الرموز الخاصة في Regex
}

async function moderatePost({ text }) {
  if (!text) return { status: "approved" };

  // تحويل كل الكلمات إلى نمط Regex
  const pattern = bannedWords.map(escapeRegex).join("|");
  const regex = new RegExp(`\\b(${pattern})\\b`, "i"); // \b للتأكد من تطابق الكلمة بالكامل

  const match = text.match(regex);
  if (match) {
    return { status: "blocked", reason: `Contains banned word: ${match[0]}` };
  }

  // لاحقًا: يمكن إضافة فحص الصور/روابط
  return { status: "approved" };
}

module.exports = { moderatePost };