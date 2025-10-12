import React from 'react'
import { HiBadgeCheck } from 'react-icons/hi'
import UserHoverCard from '../UserHoverCard'
import RenderPostText from './RenderText'
import PostPhotos from './PostPhotos'
import PostLinks from './PostLinks'

const SharedPost = ({
    original,
    user,
    setImageView
}) => {
  return (
    <Link href={`/Pages/Post/${original?._id}`} 
        className="bg-white/40 dark:bg-white/5 backdrop-blur-md 
            border border-gray-200/40 dark:border-gray-700/40 
            rounded-xl p-4 flex flex-col gap-3 
            shadow-md hover:shadow-lg transition-all duration-300 
            border-l-4 border-blue-400"
        >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-4">
            <Link
            href={user?._id === original?.owner?._id ? '/Pages/Profile' : `/Pages/User/${original?.owner?._id}`}
            className="flex items-center gap-3 hover:underline"
            >
            <Image
                src={original?.owner?.profilePhoto?.url}
                alt="Shared_profile_post"
                width={50}
                height={50}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-400"
            />
            <UserHoverCard userSelected={original?.owner}>
                <div className="flex flex-col">
                <div className='flex items-center gap-1'>
                    <span className="font-semibold text-gray-900 dark:text-white">{original?.owner?.username}</span>
                    {original?.owner?.isAccountWithPremiumVerify && (
                    <HiBadgeCheck className="text-blue-500 text-lg sm:text-xl" title="Verified" />
                    )}
                </div>
                <span className="text-gray-500 text-xs">{original?.owner?.profileName}</span>
                </div>
            </UserHoverCard>
            </Link>
            <span className="text-gray-400 text-xs whitespace-nowrap">
            {new Date(original?.createdAt).toLocaleDateString()}
            </span>
        </div>

        <RenderPostText
            text={original?.text}
            mentions={original?.mentions}
            hashtags={original?.Hashtags}
            italic={true}
        />

        {original?.Photos && (
            <PostPhotos photos={original?.Photos} setImageView={setImageView} postId={original?._id} />
        )}
        <PostLinks links={original?.links}/>
    </Link>
  )
}

export default SharedPost