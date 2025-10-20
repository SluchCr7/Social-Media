import { GoHome, GoSearch } from "react-icons/go"

import { CiUser, CiSettings, CiChat1 } from "react-icons/ci"
import { SiGoogledisplayandvideo360 } from "react-icons/si"
import { FaPlus } from "react-icons/fa6"
import { RiUserCommunityLine } from 'react-icons/ri'
import { LuMessagesSquare } from "react-icons/lu"
import { MdLanguage, MdOutlineOndemandVideo } from "react-icons/md"
import { IoTrophyOutline } from "react-icons/io5"
import { SlCalender } from "react-icons/sl"
import { IoIosMusicalNotes } from "react-icons/io";
import { FaHistory, FaLock, FaSun, FaUserCog,FaBookmark } from "react-icons/fa"
import { FiCreditCard, FiGlobe, FiMessageCircle, FiShield, FiUser, FiUsers } from "react-icons/fi"

export const colors = [
    {
        name : "warmCream",
        value : "#fdf0d5"
    },
    {
        name : "warmBlue",
        value : "#7209b7"
    },
    {
        name : "warmBrown",
        value : "#7f4f24"
    },
    {
        name : "DarkGreen",
        value : "#004b23"
    },
    {
        name : "Orange",
        value : "#ff6700"
    },
    {
        name : "Purple",
        value : "#6247aa"
    },
    {
        name : "Red",
        value : "#ff0000"
    },
    {
        name : "Blue",
        value : "#0047cc"
    }
]

export const navSections = [
  {
    title: "Main",
    items: [
      { icon: <GoHome />, text: "Home", link: "/" },
      { icon: <GoSearch />, text: "Explore", link: "/Pages/Explore" },
      { icon: <FaBookmark />, text: "Saved", link: "/Pages/Saved" },
      { icon: <MdOutlineOndemandVideo />, text: "Videos", link: "/Pages/Videos" },
      { icon: <IoIosMusicalNotes />, text: "Music", link: "/Pages/Music" },
    ]
  },
  {
    title: "Community",
    items: [
      // { icon: <FaPlus />, text: "New Zoc", link: "/Pages/NewPost" },
      { icon: <RiUserCommunityLine />, text: "Community", link: "/Pages/CommunityMain" },
      { icon: <LuMessagesSquare />, text: "Messenger", link: "/Pages/Messanger" },
    ]
  },
  {
    title: "Personal",
    items: [
      { icon: <SiGoogledisplayandvideo360 />, text: "Shorts", link: "/Pages/Reels" },
      { icon: <IoTrophyOutline />, text: "Challenge", link: "/Pages/Challenge" },
      { icon: <SlCalender />, text: "Calendar", link: "/Pages/Calender" },
      { icon: <CiUser />, text: "Profile", link: "/Pages/Profile" },
      { icon: <CiSettings />, text: "Settings", link: "/Pages/Setting" },
    ]
  }
]

export const CATEGORY_OPTIONS = [
  { name: 'All', value: 'All' },
  { name: 'Technology', value: 'Technology' },
  { name: 'Art', value: 'Art' },
  { name: 'Science', value: 'Science' },
  { name: 'Gaming', value: 'Gaming' },
  { name: 'Music', value: 'Music' },
  { name: 'Food', value: 'Food' },
  { name: 'Travel', value: 'Travel' },
  { name: 'Health', value: 'Health' },
  { name: 'Business', value: 'Business' },
  { name: 'Politics', value: 'Politics' },
  { name: 'Sports', value: 'Sports' },
  { name: 'Other', value: 'Other' }
];

export const SORT_OPTIONS = [
  { name: 'Newest', value: 'Newest' },
  { name: 'Most Members', value: 'Most Members' },
  { name: 'A-Z', value: 'A-Z' }
];


export const languageMap = {
  Arabic: "ar",
  English: "en",
  French: "fr",
  Spanish: "es",
  German: "de",
  Italian: "it",
  Portuguese: "pt",
  Russian: "ru",
  Chinese: "zh",
  Japanese: "ja",
  Korean: "ko",
  Turkish: "tr",
  Hindi: "hi",
  Bengali: "bn",
  Urdu: "ur",
  Persian: "fa",
  Dutch: "nl",
  Greek: "el",
  Polish: "pl",
  Swedish: "sv",
  Norwegian: "no",
  Danish: "da",
  Finnish: "fi",
  Thai: "th",
  Vietnamese: "vi",
  Indonesian: "id",
  Hebrew: "he",
  Malay: "ms",
};

export const iso6391Map = {
    eng: "en",
    ara: "ar",
    fra: "fr",
    spa: "es",
    deu: "de",
    ita: "it",
    por: "pt",
    rus: "ru",
    zho: "zh",
    jpn: "ja",
    kor: "ko",
    tur: "tr",
    hin: "hi",
    ben: "bn",
    urd: "ur",
    fas: "fa",
    nld: "nl",
    ell: "el",
    pol: "pl",
    swe: "sv",
    nor: "no",
    dan: "da",
    fin: "fi",
    tha: "th",
    vie: "vi",
    ind: "id",
    heb: "he",
    msa: "ms",
};
  

export const TABS = [
  { id: 'appearance', label: 'Appearance', icon: <FaSun /> },
  { id: 'security', label: 'Security', icon: <FaLock /> },
  // { id: 'chat', label: 'Chat Colors', icon: <CiChat1 /> },
  { id: 'language', label: 'Language', icon: <MdLanguage /> },
  { id: 'history', label: 'Login History', icon: <FaHistory /> },
  { id: 'account', label: 'Account', icon: <FaUserCog /> },
]

export const DEFAULT_COLORS = [
  { name: 'Ocean', value: '#06b6d4' },
  { name: 'Sunset', value: '#fb923c' },
  { name: 'Mint', value: '#34d399' },
  { name: 'Lavender', value: '#a78bfa' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Slate', value: '#64748b' },
]


  export const tabsHeader = [
    { key: "following", label: "Following" },
    { key: "forYou", label: "For You" },
  ];

  export const reasons = [
    { label: 'Spam Content', value: 'spam' },
    { label: 'Inappropriate Content', value: 'inappropriate' },
    { label: 'Harassment or Hate Speech', value: 'harassment' },
    { label: 'Misinformation', value: 'misinformation' },
    { label: 'Copyright Violation', value: 'copyright' },
    { label: 'Other', value: 'other' }
  ];

 export const months = [
  { name: "January", value: "January" },
  { name: "February", value: "February" },
  { name: "March", value: "March" },
  { name: "April", value: "April" },
  { name: "May", value: "May" },
  { name: "June", value: "June" },
  { name: "July", value: "July" },
  { name: "August", value: "August" },
  { name: "September", value: "September" },
  { name: "October", value: "October" },
  { name: "November", value: "November" },
  { name: "December", value: "December" }
];


export const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'fa', name: 'الفارسيه', flag: '🇮🇷' },
];

export const chartData = [
    { name: 'Mon', posts: 30 },
    { name: 'Tue', posts: 50 },
    { name: 'Wed', posts: 80 },
    { name: 'Thu', posts: 60 },
    { name: 'Fri', posts: 100 },
    { name: 'Sat', posts: 70 },
    { name: 'Sun', posts: 40 },
  ];

  export const TOPICS = [
    { key: 'account', icon: <FiUser />, title: 'Account & Profile', desc: 'إنشاء الحساب، تسجيل الدخول، استعادة كلمة المرور، وإعدادات الملف الشخصي.' },
    { key: 'content', icon: <FiGlobe />, title: 'Content & Posting', desc: 'مشاكل النشر، الصور، مقاطع الفيديو، حقوق النشر، والحذف.' },
    { key: 'messaging', icon: <FiMessageCircle />, title: 'Messaging & Chat', desc: 'الرسائل الخاصة، المحادثات الجماعية، الإشعارات، ومشاكل الإرسال.' },
    { key: 'privacy', icon: <FiShield />, title: 'Privacy & Security', desc: 'إعدادات الخصوصية، الحظر، الإبلاغ عن المحتوى المسيء، وتأمين الحساب.' },
    { key: 'billing', icon: <FiCreditCard />, title: 'Subscriptions & Ads', desc: 'إدارة الاشتراكات المدفوعة (Premium)، الفواتير، وحسابات المعلنين.' },
    { key: 'community', icon: <FiUsers />, title: 'Community & Guidelines', desc: 'قواعد المجتمع، الإبلاغ عن انتهاكات، وعمليات الاستئناف.' }
  ]
  
  export const FAQ = [
    { topicKey: 'account', q: 'كيف يمكنني استعادة كلمة المرور إذا نسيتها؟', a: 'في شاشة تسجيل الدخول، اضغط على "نسيت كلمة المرور". أدخل بريدك الإلكتروني أو رقم هاتفك لتلقي رابط أو رمز لإعادة التعيين. تأكد من فحص مجلد الرسائل غير المرغوب فيها (Spam).' },
    { topicKey: 'account', q: 'ما هي خطوات التحقق من حسابي (Verification)؟', a: 'اذهب إلى الإعدادات > الملف الشخصي > طلب التحقق. املأ النموذج وقدم هوية صالحة (مثل جواز السفر). يُرجى ملاحظة أن عملية المراجعة قد تستغرق ما يصل إلى 7 أيام عمل.' },
    { topicKey: 'content', q: 'لماذا تم حظر أو إزالة منشوري؟', a: 'عادةً ما تتم إزالة المنشورات التي تنتهك إرشادات المحتوى لدينا (مثل العنف، الكراهية، أو حقوق النشر). راجع إشعار الحظر لمعرفة السبب المحدد، ويمكنك تقديم استئناف إذا كنت تعتقد أنه خطأ.' },
    { topicKey: 'content', q: 'كيف يمكنني نشر مقطع فيديو بجودة عالية (4K/HD)؟', a: 'تأكد من أن جودة الفيديو الأصلي عالية. نحن ندعم جودة عالية، لكن قد يتم ضغط الفيديو عند التحميل لتسريع العرض. استخدم تطبيقنا الأصلي بدلاً من متصفح الويب للتحميل.' },
    { topicKey: 'messaging', q: 'كيف أقوم بتعطيل إيصالات القراءة (Read Receipts) في الرسائل؟', a: 'اذهب إلى الإعدادات > الخصوصية > الرسائل. قم بإلغاء تفعيل "عرض إيصالات القراءة". لن يتمكن المستخدمون الآخرون بعد ذلك من معرفة ما إذا قرأت رسائلهم أم لا.' },
    { topicKey: 'privacy', q: 'ماذا يحدث عندما أقوم بحظر مستخدم؟', a: 'عند حظر مستخدم، لا يمكنه رؤية ملفك الشخصي، منشوراتك، أو إرسال رسائل إليك. لن يتم إخطارهم بأنك قمت بحظرهم. يمكنك إلغاء الحظر في أي وقت من قائمة "الحسابات المحظورة" في الإعدادات.' },
    { topicKey: 'billing', q: 'كيف أطلب استرداد الأموال لاشتراك Premium؟', a: 'تعتمد سياسة استرداد الأموال على منصة الشراء (App Store، Google Play، أو الموقع مباشرة). بشكل عام، يمكن استرداد المبلغ خلال 14 يومًا من الشراء إذا لم تستخدم الميزات. انتقل إلى صفحة الفواتير لتقديم الطلب.' },
    { topicKey: 'community', q: 'كيف أقدم استئنافًا ضد قرار الإشراف على المحتوى؟', a: 'إذا تم حظر حسابك أو إزالة محتوى خاص بك، ستتلقى إشعارًا يحتوي على خيار "تقديم استئناف". اتبع التعليمات واشرح سبب اعتقادك أن القرار كان خاطئًا.' },
  ]

  export const savedPosts = [
    { id: 'p1', user: 'Ahmed', avatar: '/Home.jpg', image: '/Home.jpg', caption: 'Sunset vibes at the coast 🌅 — a short story about the day.', date: 'Oct 12, 2025' },
    { id: 'p2', user: 'Lina', avatar: '/Home.jpg', image: '/Home.jpg', caption: "My workspace — minimal and cozy.", date: 'Sep 20, 2025' },
  ]
  
  export const savedMusic = [
    { id: 'm1', title: 'Lost in Time', artist: 'Nova', cover: '/Home.jpg', url: '/song1.mp3', duration: '3:42' },
    { id: 'm2', title: 'Dreamstate', artist: 'Orion', cover: '/Home.jpg', url: '/song2.mp3', duration: '4:05' },
    { id: 'm3', title: 'Midnight Loop', artist: 'Echoes', cover: '/Home.jpg', url: '/song3.mp3', duration: '2:58' }
  ]
  
  export const savedReels = [
    { id: 'r1', thumbnail: '/reels/thumb1.jpg', video: '/video1.mp4', title: 'Quick Tips for Productivity' },
    { id: 'r2', thumbnail: '/reels/thumb2.jpg', video: '/video2.mp4', title: 'Street Photography - 60s' },
  ]
  