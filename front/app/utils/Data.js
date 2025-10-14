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
import { FaHistory, FaLock, FaSun, FaUserCog } from "react-icons/fa"

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
  'All', 'Technology', 'Art', 'Science', 'Gaming', 'Music',
  'Food', 'Travel', 'Health', 'Business', 'Politics', 'Sports', 'Other'
]

export const SORT_OPTIONS = ['Newest', 'Most Members', 'A-Z']

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
  { id: 'chat', label: 'Chat Colors', icon: <CiChat1 /> },
  { id: 'language', label: 'Language', icon: <MdLanguage /> },
  { id: 'history', label: 'Login History', icon: <FaHistory /> },
  { id: 'account', label: 'Account', icon: <FaUserCog /> },
]

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
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
    { label: 'Spam', value: 'spam' },
    { label: 'Inappropriate Content', value: 'inappropriate' },
    { label: 'Harassment or Hate Speech', value: 'harassment' },
    { label: 'Misinformation', value: 'misinformation' },
    { label: 'Copyright Violation', value: 'copyright' },
    { label: 'Other', value: 'other' }
  ];

  export const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]