// // utils/moderation.js

// const bannedWords = [
//   // كلمات مسيئة عامة
//   "fuck",
//   "shit",
//   "bitch",
//   "asshole",
//   "dick",
//   "pussy",
//   "damn",
//   "bastard",
//   "crap",
//   "faggot",
//   "slut",
//   "whore",
//   "cock",
//   "nigger",
//   "cunt",
//   "motherfucker",

//   // كلمات عنف أو تهديد
//   "kill",
//   "murder",
//   "rape",
//   "bomb",
//   "terrorist",
//   "shoot",
//   "stab",

//   // كلمات تمييز أو كراهية
//   "racist",
//   "jew",
//   "kike",
//   "chink",
//   "gook",
//   "fag",
//   "nazi",
//   "israel",
//   // كلمات حساسة للبالغين
//   "porn",
//   "sex",
//   "xxx",
//   "nsfw",
//   "erotic",
//   "nude",
//   "stripper",

//   // كلمات محتوى محظور عام
//   "drugs",
//   "cocaine",
//   "heroin",
//   "meth",
//   "weed",
//   "marijuana"
// ];
// function escapeRegex(word) {
//   return word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // للهروب من الرموز الخاصة في Regex
// }

// async function moderatePost({ text }) {
//   if (!text) return { status: "approved" };

//   // تحويل كل الكلمات إلى نمط Regex
//   const pattern = bannedWords.map(escapeRegex).join("|");
//   const regex = new RegExp(`\\b(${pattern})\\b`, "i"); // \b للتأكد من تطابق الكلمة بالكامل

//   const match = text.match(regex);
//   if (match) {
//     return { status: "blocked", reason: `Contains banned word: ${match[0]}` };
//   }

//   // لاحقًا: يمكن إضافة فحص الصور/روابط
//   return { status: "approved" };
// }

// module.exports = { moderatePost };
// utils/moderation.js

const bannedWords = [
  /* =========================
     English – Profanity & Hate
  ========================== */
  "fuck", "fucking", "shit", "bullshit", "bitch", "asshole", "dick", "pussy",
  "damn", "bastard", "crap", "slut", "whore", "cock", "cunt", "motherfucker",
  "retard", "faggot", "fag", "nigger", "nigga", "hoe", "jerk", "prick",

  /* Violence & Threats */
  "kill", "murder", "rape", "bomb", "terrorist", "shoot", "stab", "massacre",
  "assassinate", "behead", "explosion", "sniper",

  /* Hate / Discrimination */
  "racist", "nazi", "hitler", "kkk", "supremacy", "zionist", "israel",

  /* Adult / NSFW */
  "porn", "porno", "sex", "xxx", "nsfw", "erotic", "nude", "nudity",
  "blowjob", "handjob", "anal", "cum", "orgasm", "stripper", "escort",

  /* Drugs */
  "drugs", "cocaine", "heroin", "meth", "weed", "marijuana", "hash",
  "lsd", "ecstasy", "opioid",

  /* =========================
     Arabic – سب وقذف وكراهية
  ========================== */
  "كس", "كسمك", "كسم", "نيك", "شرموطة", "قحبة", "زانية", "منيوك",
  "ابن متناكة", "متناك", "خول", "عرص", "لبوة", "وسخ", "حقير",
  "احا", "تف", "يلعن", "يلعنك", "لعنة", "ملعون",

  /* عنف وتهديد */
  "اقتل", "قتل", "ذبح", "اغتصاب", "تفجير", "قنبلة", "ارهاب", "ارهابي",
  "رصاص", "سلاح", "داعش", "القاعدة",

  /* تمييز وكراهية */
  "يهودي", "صهيوني", "نازي", "كافر", "مرتد", "ملحد",

  /* محتوى للبالغين */
  "جنس", "سكس", "اباحي", "اباحية", "عري", "عريان", "مثير", "دعارة",

  /* مخدرات */
  "مخدرات", "حشيش", "بانجو", "هيروين", "كوكايين", "ترامادول",
  "مخدر", "تعاطي",

  /* =========================
     French
  ========================== */
  "putain", "merde", "salope", "connard", "encule", "bite", "nique",
  "bordel", "pd", "pute",

  /* =========================
     Spanish
  ========================== */
  "puta", "mierda", "pendejo", "cabrón", "coño", "joder", "chingar",
  "maricon", "zorra",

  /* =========================
     German
  ========================== */
  "scheisse", "arschloch", "fotze", "hurensohn", "schlampe",
  "wichser", "verdammt"
];


// للهروب من الرموز الخاصة في Regex
function escapeRegex(word) {
  return word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function moderatePost({ text }) {
  if (!text) {
    return { isContainWorst: false, badWord: null };
  }

  // إنشاء النمط (Regex pattern)
  const pattern = bannedWords.map(escapeRegex).join("|");
  const regex = new RegExp(`\\b(${pattern})\\b`, "i");

  const match = text.match(regex);
  if (match) {
    return {
      isContainWorst: true,
      badWord: match[0],
      message: `Contains inappropriate word: ${match[0]}`
    };
  }

  // لا يوجد كلمات ممنوعة
  return { isContainWorst: false, badWord: null };
}

module.exports = { moderatePost };
