import { GoHome, GoSearch } from "react-icons/go"
import { CiUser, CiSettings } from "react-icons/ci"
import { SiGoogledisplayandvideo360 } from "react-icons/si"
import { FaPlus } from "react-icons/fa6"
import { RiUserCommunityLine } from 'react-icons/ri'
import { LuMessagesSquare } from "react-icons/lu"
import { MdOutlineOndemandVideo } from "react-icons/md"
import { IoTrophyOutline } from "react-icons/io5"
import { SlCalender } from "react-icons/sl"

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