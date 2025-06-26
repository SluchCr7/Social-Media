import React from 'react'
import Sluchits from './Sluchits'

const MainApp = () => {
  return (
    <div className='w-[100%] h-full px-3'>
        <span className='text-darkMode-text font-bold text-xl tracking-[3px] uppercase'>Home</span>
        <Sluchits/>
    </div>
  )
}

export default MainApp