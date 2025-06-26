import React from 'react'
import SluchitEntry from './SluchitEntry'
import { usePost } from '../Context/PostContext'

const Sluchits = () => {
  const {posts} = usePost() 
  return (
    <div className='w-full flex items-start flex-col gap-8 py-5'>
      {
        posts.map(post => <SluchitEntry key={post._id} post={post}/>)
      }
    </div>
  )
}

export default Sluchits