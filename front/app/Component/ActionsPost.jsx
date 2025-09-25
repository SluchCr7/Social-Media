import { Link } from 'lucide-react'
import React from 'react'
import { BiRepost } from 'react-icons/bi'
import { CiBookmark, CiHeart } from 'react-icons/ci'
import { FaRegCommentDots } from 'react-icons/fa'
import { FaFaceGrinSquintTears } from 'react-icons/fa6'
import { IoIosHeart, IoIosShareAlt } from 'react-icons/io'

const ActionsPost = ({post , isLogin , user}) => {
  return (
    <div>
        {isLogin && (
            <div className='flex items-center gap-6 pt-4'>
            <button disabled={post?.hahas?.includes(user?._id)} onClick={() => likePost(post?._id, post?.owner._id)} className='flex items-center gap-2 cursor-pointer transition-all hover:scale-110'>
                {post?.likes?.includes(user?._id) ? (
                <IoIosHeart className='text-red-500 text-2xl' />
                ) : (
                <CiHeart className='text-gray-500 text-2xl' />
                )}
                <span className='text-gray-400 text-sm font-medium'>{post?.likes?.length}</span>
            </button>
            <button disabled={post?.likes?.includes(user?._id)} onClick={() => hahaPost(post?._id)} className='flex items-center gap-2 cursor-pointer transition-all hover:scale-110'>
                {post?.hahas?.includes(user?._id) ? (
                <FaFaceGrinSquintTears className='text-yellow-500 text-2xl' />
                ) : (
                <FaFaceGrinSquintTears className='text-gray-500 text-2xl' />
                )}
                <span className='text-gray-400 text-sm font-medium'>{post?.hahas?.length}</span>
            </button>
            {!post?.isCommentOff && (
                <Link href={`/Pages/Post/${post?._id}`} className='flex items-center gap-2 transition-all hover:scale-110'>
                    <FaRegCommentDots className='text-gray-500 text-xl' />
                    <span className='text-gray-400 text-sm font-medium'>{post?.comments?.length}</span>
                </Link>
            )}
            <div 
                onClick={() => sharePost(
                    post?.originalPost ? post?.originalPost?._id : post?._id, 
                    post?.owner?._id
                )} 
                className="flex items-center gap-2 cursor-pointer transition-all hover:scale-110"
            >
                <IoIosShareAlt className="text-gray-500 text-2xl" />
                {/* <span className="text-gray-400 text-sm font-medium">{post?.shares?.length}</span> */}
            </div>
            <div onClick={() => setOpenModel(true)} className='flex items-center gap-2 cursor-pointer transition-all hover:scale-110'>
                <BiRepost className='text-gray-500 text-2xl' />
                {/* <span className='text-gray-400 text-sm font-medium'>{post?.shares?.length}</span> */}
            </div>

            <div onClick={() => savePost(post?._id)} className='flex items-center gap-2 cursor-pointer transition-all hover:scale-110'>
                <CiBookmark className={`${post?.saved?.includes(user?._id) ? 'text-yellow-400' : 'text-gray-500'} text-2xl`} />
                <span className='text-gray-400 text-sm font-medium'>{post?.saved?.length}</span>
            </div>
            </div>
        )} 
    </div>
  )
}

export default ActionsPost