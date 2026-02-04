import React, { memo } from 'react';
import SensitiveImage from './SensitiveImage';

const PostImage = memo(({
  post,
  isCommunityPost,
}) => {
  const isInCommunityPage = typeof window !== 'undefined' && window.location.href.includes('/Pages/Community/');

  const src = isCommunityPost && !isInCommunityPage
    ? post?.community?.Picture?.url
    : post?.owner?.profilePhoto?.url;

  const isSensitive = isCommunityPost && !isInCommunityPage
    ? post?.community?.Picture?.isSensitive
    : post?.owner?.profilePhoto?.isSensitive;

  return (
    <div className="flex flex-col items-center">
      <div className={`rounded-full w-10 h-10 sm:w-11 sm:h-11 overflow-hidden relative border border-black/5 dark:border-white/5 shadow-sm
        ${post?.owner?.stories?.length > 0 ? "ring-2 ring-pink-500 ring-offset-2 ring-offset-[#F2F2F2] dark:ring-offset-[#0A0A0A]" : ""}
      `}>
        <SensitiveImage
          src={src || "/default-profile.png"}
          alt="profile"
          fill
          isSensitive={isSensitive}
          className="object-cover"
        />
      </div>
      <div className="hidden sm:block border-l border-gray-300 dark:border-gray-600 h-[70px] w-[1px] mt-2 opacity-50"></div>
    </div>
  );
});

PostImage.displayName = 'PostImage';
export default PostImage;