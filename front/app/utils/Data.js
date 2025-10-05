import { GoHome, GoSearch } from "react-icons/go"
import { CiUser, CiSettings } from "react-icons/ci"
import { SiGoogledisplayandvideo360 } from "react-icons/si"
import { FaPlus } from "react-icons/fa6"
import { RiUserCommunityLine } from 'react-icons/ri'
import { LuMessagesSquare } from "react-icons/lu"
import { MdOutlineOndemandVideo } from "react-icons/md"
import { IoTrophyOutline } from "react-icons/io5"
import { SlCalender } from "react-icons/sl"
import { IoIosMusicalNotes } from "react-icons/io";

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