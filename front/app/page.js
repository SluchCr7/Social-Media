'use client';
import MainApp from "./Component/MainApp";
import { useMusicPlayer } from "./Context/MusicPlayerContext";
import { IoIosMusicalNotes } from "react-icons/io";
import { FiPlus } from 'react-icons/fi';
import Link from "next/link";
import { useAuth } from "./Context/AuthContext";

export default function Home() {
    const {expanded, setExpanded,viewMusicPlayer, setViewMusicPlayer} = useMusicPlayer()
    const {user} = useAuth()
    const { language } = useTranslate()
    const isRTL = ['ar', 'fa', 'he', 'ur'].includes(language)
  return (
    <div className="flex items-start gap-3 w-full">
      <MainApp />
      {
        user &&
        <div
          className={`fixed z-50 flex items-center gap-3 transition-all duration-300 ${isRTL ? "left-5" : "right-5"} ${
            viewMusicPlayer ? "bottom-[160px]" : "bottom-5"
          }`}
        >
          <button
            className="bg-gradient-to-r from-purple-500 to-indigo-500 
                      text-white rounded-full w-14 h-14 flex items-center justify-center 
                      shadow-lg hover:scale-110 transition duration-300"
          >
            <Link href="/Pages/NewPost">
              <FiPlus className="text-2xl" />
            </Link>
          </button>
          {/* <button
            onClick={() => setViewMusicPlayer(!viewMusicPlayer)}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:scale-110 transition duration-300"
          >
            <IoIosMusicalNotes />
          </button> */}
        </div>
      }
    </div>
  );
}
