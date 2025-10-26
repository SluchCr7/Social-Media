import { GoHome, GoSearch } from "react-icons/go"
import { CgProfile } from "react-icons/cg";
import { MdOutlinePaid } from "react-icons/md";
import { CiUser, CiSettings, CiChat1 } from "react-icons/ci"
import { SiGoogledisplayandvideo360 } from "react-icons/si"
import { FaPlus } from "react-icons/fa6"
import { RiUserCommunityLine } from 'react-icons/ri'
import { LuMessagesSquare } from "react-icons/lu"
import { MdLanguage, MdOutlineOndemandVideo } from "react-icons/md"
import { IoTrophyOutline } from "react-icons/io5"
import { SlCalender } from "react-icons/sl"
import { IoIosMusicalNotes } from "react-icons/io";
import { FaHistory, FaLock, FaSun, FaUserCog,FaBookmark, FaBell } from "react-icons/fa"
import {
  FiMessageCircle,
  FiShield,
  FiUser,
  FiGlobe,
  FiCreditCard,
  FiUsers
} from 'react-icons/fi';
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
  { id: 'profile', label: 'Profile', icon: <CgProfile />},
  { id: 'notifications', label: 'Notifications', icon: <FaBell />},
  { id: 'billing', label: 'Billing', icon: <MdOutlinePaid />,view : false}
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
  {
    key: 'account',
    icon: <FiUser />,
    title: 'Account & Profile',
    desc: 'Creating an account, logging in, resetting passwords, and managing your profile settings.'
  },
  {
    key: 'content',
    icon: <FiGlobe />,
    title: 'Content & Posting',
    desc: 'Posting issues, images, videos, copyrights, and deletion problems.'
  },
  {
    key: 'messaging',
    icon: <FiMessageCircle />,
    title: 'Messaging & Chat',
    desc: 'Private messages, group chats, notifications, and message delivery issues.'
  },
  {
    key: 'privacy',
    icon: <FiShield />,
    title: 'Privacy & Security',
    desc: 'Privacy settings, blocking users, reporting abuse, and securing your account.'
  },
  {
    key: 'billing',
    icon: <FiCreditCard />,
    title: 'Subscriptions & Ads',
    desc: 'Managing Premium subscriptions, billing, and advertiser accounts.'
  },
  {
    key: 'community',
    icon: <FiUsers />,
    title: 'Community & Guidelines',
    desc: 'Community rules, reporting violations, and submitting appeals.'
  }
];

export const FAQ = [
  {
    topicKey: 'account',
    q: 'How can I reset my password if I forgot it?',
    a: 'On the login screen, tap "Forgot Password". Enter your email or phone number to receive a reset link or code. Check your spam folder if you don’t see it.'
  },
  {
    topicKey: 'account',
    q: 'What are the steps to verify my account?',
    a: 'Go to Settings > Profile > Request Verification. Fill out the form and upload valid identification (e.g., passport). Review may take up to 7 business days.'
  },
  {
    topicKey: 'content',
    q: 'Why was my post removed or blocked?',
    a: 'Posts are usually removed for violating our content guidelines (e.g., violence, hate, or copyright issues). Review the notice and appeal if you believe it’s a mistake.'
  },
  {
    topicKey: 'content',
    q: 'How can I upload videos in high quality (4K/HD)?',
    a: 'Ensure your original video is high quality. Uploads may be compressed for faster playback. Use our native app instead of a browser for better quality.'
  },
  {
    topicKey: 'messaging',
    q: 'How do I disable read receipts in messages?',
    a: 'Go to Settings > Privacy > Messages and turn off "Read Receipts". Others won’t see if you’ve read their messages.'
  },
  {
    topicKey: 'privacy',
    q: 'What happens when I block a user?',
    a: 'Blocked users can’t see your profile, posts, or message you. They won’t be notified about the block. You can unblock anytime from your blocked accounts list.'
  },
  {
    topicKey: 'billing',
    q: 'How do I request a refund for Premium?',
    a: 'Refund policies depend on your purchase platform (App Store, Google Play, or website). Generally, refunds are available within 14 days if unused.'
  },
  {
    topicKey: 'community',
    q: 'How can I appeal a moderation decision?',
    a: 'If your content or account was removed, you’ll get a notification with an “Appeal” option. Follow the steps and explain why you think it was wrong.'
  }
];


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
  