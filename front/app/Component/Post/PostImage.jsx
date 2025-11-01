import Image from 'next/image';
import React , {memo} from 'react'
const PostImage = memo(({
    post,
    isCommunityPost,
}) => {
    const isInCommunityPage = typeof window !== 'undefined' && window.location.href.includes('/Pages/Community/');
  return (
        <div className="flex flex-col items-center">
            <Image
              src={isCommunityPost && !isInCommunityPage 
                ? post?.community?.Picture?.url 
                : post?.owner?.profilePhoto?.url}
              alt="profile"
              width={44}
              height={44}
              className={`rounded-full w-11 h-11 min-w-11 object-cover 
                ${post?.owner?.stories?.length > 0 ? "ring-2 ring-pink-500 animate-pulse" : ""}
              `}
            />
            <div className="hidden sm:block border border-gray-600 h-[70px] w-[1px] mt-2"></div>
          </div>
  )
})
PostImage.displayName = 'PostImage'
export default PostImage