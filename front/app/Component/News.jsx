import Image from 'next/image'
import React from 'react'
import { useNews } from '../Context/NewsContext'
import Link from 'next/link'

const News = () => {
  const {news} = useNews()
  return (
    <div className='w-full flex bg-lightMode-menu dark:bg-darkMode-menu flex-col gap-3 rounded-lg py-3'> 
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-lightMode-fg/40 dark:border-darkMode-fg/40">
          <h2 className="text-lightMode-fg dark:text-darkMode-fg text-lg font-semibold">News</h2>
        </div>
        <ul className='flex flex-col w-full text-sm text-text gap-4'>
        {news
            .filter((item)=> item?.image != null)
            .map((item , index) => (
              <Link href={item?.url} key={index} className='flex items-start gap-5 w-full p-3 rounded-lg hover:bg-darkMode-bg transition'>
                <Image
                  src={item?.image}
                  alt="avatar"
                  width={300}
                  height={300}
                  unoptimized
                  className="rounded-sm w-12 h-12 object-cover"
                />
                <div className='flex flex-col items-start gap-3 w-full'>
                  <h2 className='text-lightMode-fg dark:text-darkMode-fg text-sm font-semibold line-clamp-2'>{item?.title}</h2>
                  <p className='text-muted text-lightMode-text dark:text-darkMode-text text-xs'>{new Date(item?.published_at).toLocaleDateString()}</p>
                </div>
              </Link>
            )).slice(0,3)
        }
        </ul>
        <button className='flex items-center text-sm justify-center mx-auto text-lightMode-bg dark:text-darkMode-bg border border-lightMode-bg dark:border-darkMode-bg p-2 rounded-md'>Show More</button>
    </div>
  )
}

export default News