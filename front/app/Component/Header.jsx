import Image from 'next/image';
import React from 'react'
import { LuMessageCircle } from "react-icons/lu";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiSettings } from "react-icons/ci";

const Header = ({showNotifications , setShowNotifications, showMessanger , setShowMessanger}) => {
  return (
    <div className='w-full flex items-center justify-between p-5'>
        <span className='text-darkMode-text font-bold text-xl uppercase'>Slucht</span>
        <div className='flex items-center gap-4'>
            {/* <LuMessageCircle onClick={() => setShowMessanger(true)} className='text-darkMode-text text-xl' /> */}
            <IoIosNotificationsOutline onClick={()=> setShowNotifications(true)} className='text-darkMode-text text-2xl' />
            <Image src="/Home.jpg" alt="profile" width={40} height={40} className='rounded-full w-8 h-8' />
            {/* <CiSettings className='text-darkMode-text text-xl' /> */}
        </div>
    </div>
  )
}

export default Header