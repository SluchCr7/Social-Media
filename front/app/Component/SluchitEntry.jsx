// 'use client'
// import React, { forwardRef, useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { BsThreeDots } from 'react-icons/bs';
// import { usePost } from '../Context/PostContext';
// import { useAuth } from '../Context/AuthContext';
// import PostMenu from './PostMenu';
// import { ShareModal } from './AddandUpdateMenus/SharePost';
// import { getHighlightedComment } from '../utils/getHighlitedComment';
// import UserHoverCard from './UserHoverCard';
// import RenderPostText from './Post/RenderText';
// import PostActions from './Post/PostActions';
// import PostPhotos from './Post/PostPhotos';
// import SharedTitle from './Post/SharedTitle';
// import { HiBadgeCheck } from 'react-icons/hi';
// import { useTranslate } from '../Context/TranslateContext';
// import { franc } from 'franc';
// import { languageMap , iso6391Map} from '../utils/Data';
// import PostLinks from './Post/PostLinks';
// import ProfileHeader from './UserComponents/ProfileHeader';
// import PostHashtags from './Post/PostHashtags';
// import SharedPost from './Post/SharedPost';
// import PostImage from './Post/PostImage';
// import PostHeader from './Post/PostHeader';
// const SluchitEntry = forwardRef(({ post }, ref) => {
//   const { likePost, hahaPost, savePost, sharePost, setImageView } = usePost();
//   const [showMenu, setShowMenu] = useState(false);
//   const { user, isLogin } = useAuth();
//   const [openModel, setOpenModel] = useState(false);
//   const { translate, loading } = useTranslate();
//   const [translated, setTranslated] = useState(null);
//   const [showTranslateButton, setShowTranslateButton] = useState(false);
//   const [showOriginal, setShowOriginal] = useState(false);
//   const isShared = post?.isShared && post?.originalPost;
//   const original = post?.originalPost;
//   const isCommunityPost = post?.community !== null;
//   const highlightedComment = getHighlightedComment(post);
//    // فحص إذا كان يجب إظهار زر الترجمة
//   useEffect(() => {
//     if (!post?.text || !post?.owner?.preferredLanguage) return;

//     const preferredLangText = post.owner.preferredLanguage;
//     const preferredLang = languageMap[preferredLangText];
//     if (!preferredLang) return;

//     // نص قصير جدًا نتجاهله
//     if (post.text.length < 3) {
//       setShowTranslateButton(false);
//       return;
//     }

//     let langCode3 = franc(post.text, { minLength: 3 }); // زيادة الدقة للنصوص القصيرة
//     if (langCode3 === 'und') {
//       setShowTranslateButton(false);
//       return;
//     }

//     const textLang = iso6391Map[langCode3] || 'en';

//     // إظهار زر الترجمة إذا لغة النص مختلفة عن لغة المفضل
//     setShowTranslateButton(textLang !== preferredLang);
//   }, [post?.text, post?.owner?.preferredLanguage]);

//   // دالة الترجمة
//   const handleTranslate = async () => {
//     if (!post?.text || !post?.owner?.preferredLanguage) return;

//     const targetLang = languageMap[post.owner.preferredLanguage];
//     if (!targetLang) return;

//     const result = await translate(post.text, targetLang);
//     setTranslated(result);
//     setShowOriginal(true);
//     setShowTranslateButton(false);
//   };

//   // دالة الرجوع للنص الأصلي
//   const handleShowOriginal = () => {
//     setShowOriginal(false);
//     setTranslated(null);
//     setShowTranslateButton(true);
//   };
//   return (
//     <div ref={ref} className="relative w-[90%] md:w-full mx-auto">
//       {/* 🔄 Share Modal */}
//       <ShareModal 
//         post={post} 
//         isOpen={openModel} 
//         onClose={() => setOpenModel(false)} 
//         onShare={(id, customText) => sharePost(id, post?.owner?._id, customText)} 
//       />    

//       {/* 📰 Post Card */}
//       <div className="
//         relative z-[1]
//         bg-white/80 dark:bg-black/30 backdrop-blur-xl
//         border border-gray-200/70 dark:border-gray-700/50
//         w-full p-4 sm:p-6 
//         rounded-2xl flex flex-col gap-5 shadow-lg
//         transition-all duration-300 hover:scale-[1.01]
//       ">

//         {/* 📌 Tags */}
//         {post?.isPinned && (
//           <div className="bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 
//             text-white text-xs font-bold px-3 py-1 rounded-full self-start shadow-md">
//             📌 Pinned 
//           </div>
//         )}
//         {isShared && (
//           <div className="bg-gradient-to-r from-cyan-500 to-blue-500 
//             text-white text-xs font-bold px-3 py-1 rounded-full self-start shadow-md">
//             🔁 Shared 
//           </div>
//         )}

//         {/* 👥 Shared By Info */}
//         {isShared && <SharedTitle user={user} post={post} original={original} />}

//         <div className="flex items-start gap-4">
//           <PostImage
//             post={post}
//             isCommunityPost={isCommunityPost}
//           />

//           {/* 📄 Main Content */}
//           <div className="flex flex-col w-full gap-3">
//             <PostHeader 
//               post={post}
//               user={post?.owner}
//               isLogin={isLogin}
//               showMenu={showMenu}
//               setShowMenu={setShowMenu}
//               isCommunityPost={isCommunityPost}
//             />
//             {/* 📝 Text */}
//             <RenderPostText
//               text={showOriginal ? translated : post?.text}
//               mentions={post?.mentions}
//               hashtags={post?.Hashtags}
//               italic={post?.isShared}
//             />
//             {/* 🔗 External Links */}
//             <PostLinks links={post?.links}/>

//             {/* زر الترجمة / العودة للنص الأصلي */}
//             {showTranslateButton && (
//               <button
//                 onClick={handleTranslate}
//                 disabled={loading}
//                 className="text-blue-500 mt-2 hover:underline"
//               >
//                 {loading ? 'جارٍ الترجمة...' : 'Translate'}
//               </button>
//             )}

//             {showOriginal && (
//               <button
//                 onClick={handleShowOriginal}
//                 className="text-blue-500 mt-2 hover:underline"
//               >
//                 Show Original
//               </button>
//             )}

//             {/* 🖼️ Original Post if Shared */}
//             {isShared && original && (
//               <SharedPost
//                 original={original}
//                 user={user}
//                 setImageView={setImageView}
//               />
//             )}

//             {/* 🖼️ Normal Post Photos */}
//             {!isShared && post?.Photos && (
//               <PostPhotos 
//                 photos={post?.Photos} 
//                 setImageView={setImageView} 
//                 postId={post?._id} 
//                 className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl overflow-hidden"
//               />
//             )}

//             {/* 🔗 Hashtags */}
//             {post?.Hashtags?.length > 0 && (
//               <PostHashtags post={post} />
//             )}

//             {/* 🎛️ Actions */}
//             {isLogin && (
//               <div className="mt-2">
//                 <PostActions
//                   post={post}
//                   user={user}
//                   likePost={likePost}
//                   hahaPost={hahaPost}
//                   sharePost={sharePost}
//                   savePost={savePost}
//                   setOpenModel={setOpenModel}
//                 />
//               </div>
//             )}

//             {/* 💬 Comment Avatars */}
//             {post?.comments?.length > 0 && (
//               <div className="flex items-center gap-2 pt-2">
//                 <div className="flex -space-x-2">
//                   {post?.comments?.slice(0, 3).map((comment, i) => (
//                     <Image
//                       key={i}
//                       src={comment?.owner?.profilePhoto?.url}
//                       alt="comment-avatar"
//                       width={24}
//                       height={24}
//                       className="rounded-full border-2 border-white dark:border-black w-6 h-6 object-cover"
//                     />
//                   ))}
//                 </div>
//                 <span className="text-gray-500 text-xs">{post?.comments?.length} comments</span>
//               </div>
//             )}

//             {/* 📨 Highlighted Comment */}
//             {highlightedComment && (
//               <div
//                 className="
//                   mt-4 px-3 sm:px-4 py-3 
//                   rounded-2xl 
//                   border border-gray-200/70 dark:border-gray-700/60 
//                   bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl 
//                   shadow-md hover:shadow-lg 
//                   transition-all duration-300 ease-in-out
//                 "
//               >
//                 <div className="flex items-start sm:items-center gap-3 sm:gap-4">
//                   {/* 🖼️ Avatar */}
//                   <Image
//                     src={highlightedComment?.owner?.profilePhoto?.url || '/default-avatar.png'}
//                     alt="comment-user"
//                     width={40}
//                     height={40}
//                     className="
//                       rounded-full w-9 h-9 sm:w-10 sm:h-10 
//                       object-cover border border-gray-300 dark:border-gray-600
//                       shadow-sm
//                     "
//                   />

//                   {/* 💬 Comment Text */}
//                   <div className="flex-1 min-w-0">
//                     <div className="flex flex-wrap items-center gap-2">
//                       <span className="text-sm sm:text-[15px] font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[70%]">
//                         {highlightedComment?.owner?.username}
//                       </span>

//                       {highlightedComment?.label && (
//                         <span className="
//                           text-[10px] sm:text-xs font-medium 
//                           px-2 py-0.5 rounded-full 
//                           bg-blue-100 dark:bg-blue-900/40 
//                           text-blue-700 dark:text-blue-300
//                           whitespace-nowrap
//                         ">
//                           {highlightedComment?.label}
//                         </span>
//                       )}
//                     </div>

//                     <p className="
//                       mt-1 text-[13px] sm:text-sm 
//                       text-gray-700 dark:text-gray-300 
//                       leading-relaxed break-words 
//                       whitespace-pre-wrap
//                     ">
//                       {highlightedComment?.text}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//           </div>
//         </div>
//       </div>
//     </div>
//   )
// });

// SluchitEntry.displayName = 'SluchitEntry';
// export default SluchitEntry;

'use client'
import React, { forwardRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { usePost } from '../Context/PostContext';
import { useAuth } from '../Context/AuthContext';
import PostMenu from './PostMenu';
import { ShareModal } from './AddandUpdateMenus/SharePost';
import { getHighlightedComment } from '../utils/getHighlitedComment';
import RenderPostText from './Post/RenderText';
import PostActions from './Post/PostActions';
import PostPhotos from './Post/PostPhotos';
import SharedTitle from './Post/SharedTitle';
import { useTranslate } from '../Context/TranslateContext';
import { franc } from 'franc';
import { languageMap, iso6391Map } from '../utils/Data';
import PostLinks from './Post/PostLinks';
import PostHashtags from './Post/PostHashtags';
import SharedPost from './Post/SharedPost';
import PostImage from './Post/PostImage';
import PostHeader from './Post/PostHeader';
import { useTranslation } from 'react-i18next';

const SluchitEntry = forwardRef(({ post }, ref) => {
  const { likePost, hahaPost, savePost, sharePost, setImageView } = usePost();
  const [showMenu, setShowMenu] = useState(false);
  const { user, isLogin } = useAuth();
  const [openModel, setOpenModel] = useState(false);
  const { translate, loading } = useTranslate();
  const [translated, setTranslated] = useState(null);
  const [showTranslateButton, setShowTranslateButton] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const {t} = useTranslation()
  const isShared = post?.isShared && post?.originalPost;
  const original = post?.originalPost;
  const isCommunityPost = post?.community !== null;
  const highlightedComment = getHighlightedComment(post);

  // فحص إذا كان يجب إظهار زر الترجمة
  useEffect(() => {
    if (!post?.text || !post?.owner?.preferredLanguage) return;

    const preferredLangText = post.owner.preferredLanguage;
    const preferredLang = languageMap[preferredLangText];
    if (!preferredLang) return;

    if (post.text.length < 3) {
      setShowTranslateButton(false);
      return;
    }

    let langCode3 = franc(post.text, { minLength: 3 });
    if (langCode3 === 'und') {
      setShowTranslateButton(false);
      return;
    }

    const textLang = iso6391Map[langCode3] || 'en';
    setShowTranslateButton(textLang !== preferredLang);
  }, [post?.text, post?.owner?.preferredLanguage]);

  // دالة الترجمة
  const handleTranslate = async () => {
    if (!post?.text || !post?.owner?.preferredLanguage) return;

    const targetLang = languageMap[post.owner.preferredLanguage];
    if (!targetLang) return;

    const result = await translate(post.text, targetLang);
    setTranslated(result);
    setShowOriginal(true);
    setShowTranslateButton(false);
  };

  const handleShowOriginal = () => {
    setShowOriginal(false);
    setTranslated(null);
    setShowTranslateButton(true);
  };

  return (
    <div ref={ref} className="relative w-[90%] md:w-full mx-auto">
      {/* 🔄 Share Modal */}
      <ShareModal 
        post={post} 
        isOpen={openModel} 
        onClose={() => setOpenModel(false)} 
        onShare={(id, customText) => sharePost(id, post?.owner?._id, customText)} 
      />    

      {/* 📰 Post Card */}
      <div className="
        relative z-[1]
        bg-white/80 dark:bg-black/30 backdrop-blur-xl
        border border-gray-200/70 dark:border-gray-700/50
        w-full p-4 sm:p-6 
        rounded-2xl flex flex-col gap-5 shadow-lg
        transition-all duration-300 hover:scale-[1.01]
      ">

        {/* 📌 Tags */}
        {post?.isPinned && (
          <div className="bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 
            text-white text-xs font-bold px-3 py-1 rounded-full self-start shadow-md">
            📌 {t("Pinned")} 
          </div>
        )}
        {isShared && (
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 
            text-white text-xs font-bold px-3 py-1 rounded-full self-start shadow-md">
            🔁 {t("Shared")} 
          </div>
        )}

        {/* 👥 Shared By Info */}
        {isShared && <SharedTitle user={user} post={post} original={original} />}

        {/* المحتوى الرئيسي */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* 🖼️ Post Image */}
          <PostImage
            post={post}
            isCommunityPost={isCommunityPost}
            className="w-full sm:w-[150px] rounded-xl"
          />

          {/* 📄 المحتوى النصي + الصور + الأزرار */}
          <div className="flex flex-col w-full gap-3">
            <PostHeader 
              post={post}
              user={post?.owner}
              isLogin={isLogin}
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              isCommunityPost={isCommunityPost}
            />

            <RenderPostText
              text={showOriginal ? translated : post?.text}
              mentions={post?.mentions}
              hashtags={post?.Hashtags}
              italic={post?.isShared}
            />

            {/* 🔗 External Links */}
            <PostLinks links={post?.links}/>

            {/* زر الترجمة / العودة للنص الأصلي */}
            {showTranslateButton && (
              <button
                onClick={handleTranslate}
                disabled={loading}
                className="text-blue-500 mt-2 hover:underline"
              >
                {loading ? 'جارٍ الترجمة...' : 'Translate'}
              </button>
            )}
            {showOriginal && (
              <button
                onClick={handleShowOriginal}
                className="text-blue-500 mt-2 hover:underline"
              >
                {t("Show Original")}
              </button>
            )}

            {/* 🖼️ Original Post if Shared */}
            {isShared && original && (
              <SharedPost
                original={original}
                user={user}
                setImageView={setImageView}
              />
            )}

            {/* 🖼️ Normal Post Photos */}
            {!isShared && post?.Photos && (
              <PostPhotos 
                photos={post?.Photos} 
                setImageView={setImageView} 
                postId={post?._id} 
                className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl overflow-hidden"
              />
            )}

            {/* 🔗 Hashtags */}
            {post?.Hashtags?.length > 0 && (
              <PostHashtags post={post} />
            )}

            {/* 🎛️ Actions */}
            {isLogin && (
              <div className="mt-2">
                <PostActions
                  post={post}
                  user={user}
                  likePost={likePost}
                  hahaPost={hahaPost}
                  sharePost={sharePost}
                  savePost={savePost}
                  setOpenModel={setOpenModel}
                />
              </div>
            )}

            {/* 💬 Comment Avatars */}
            {post?.comments?.length > 0 && (
              <div className="flex items-center gap-2 pt-2">
                <div className="flex -space-x-2">
                  {post?.comments?.slice(0, 3).map((comment, i) => (
                    <Image
                      key={i}
                      src={comment?.owner?.profilePhoto?.url}
                      alt="comment-avatar"
                      width={24}
                      height={24}
                      className="rounded-full border-2 border-white dark:border-black w-6 h-6 object-cover"
                    />
                  ))}
                </div>
                <span className="text-gray-500 text-xs">{post?.comments?.length} comments</span>
              </div>
            )}

            {/* 📨 Highlighted Comment */}
            {highlightedComment && (
              <div
                className="
                  mt-4 px-3 sm:px-4 py-3 
                  rounded-2xl 
                  border border-gray-200/70 dark:border-gray-700/60 
                  bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl 
                  shadow-md hover:shadow-lg 
                  transition-all duration-300 ease-in-out
                "
              >
                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                  <Image
                    src={highlightedComment?.owner?.profilePhoto?.url || '/default-avatar.png'}
                    alt="comment-user"
                    width={40}
                    height={40}
                    className="
                      rounded-full w-9 h-9 sm:w-10 sm:h-10 
                      object-cover border border-gray-300 dark:border-gray-600
                      shadow-sm
                    "
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm sm:text-[15px] font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[70%]">
                        {highlightedComment?.owner?.username}
                      </span>
                      {highlightedComment?.label && (
                        <span className="
                          text-[10px] sm:text-xs font-medium 
                          px-2 py-0.5 rounded-full 
                          bg-blue-100 dark:bg-blue-900/40 
                          text-blue-700 dark:text-blue-300
                          whitespace-nowrap
                        ">
                          {highlightedComment?.label}
                        </span>
                      )}
                    </div>
                    <p className="
                      mt-1 text-[13px] sm:text-sm 
                      text-gray-700 dark:text-gray-300 
                      leading-relaxed break-words 
                      whitespace-pre-wrap
                    ">
                      {highlightedComment?.text}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

SluchitEntry.displayName = 'SluchitEntry';
export default SluchitEntry;
