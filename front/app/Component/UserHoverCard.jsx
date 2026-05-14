'use client'
import * as HoverCard from '@radix-ui/react-hover-card'
import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useAuth } from '../Context/AuthContext'
import { useUser } from '../Context/UserContext'
import { useTranslation } from 'react-i18next'
import { Avatar } from './ui/Avatar'
import { Button } from './ui/Button'

const UserHoverCard = ({ userSelected, children, side = 'bottom' }) => {
  const { user } = useAuth()
  const [isMobile, setIsMobile] = useState(false)
  const { followUser, loading } = useUser()
  const { t } = useTranslation()

  // --- Logic & State ---
  const isMe = useMemo(() => user?._id === userSelected?._id, [user?._id, userSelected?._id]);

  const isFollowing = useMemo(() => {
    if (!user || !userSelected) return false;
    return user.following?.some(id =>
      (typeof id === 'string' ? id : id._id) === userSelected._id
    );
  }, [user?.following, userSelected?._id]);

  const followerCount = useMemo(() => userSelected?.followers?.length || 0, [userSelected?.followers]);
  const followingCount = useMemo(() => userSelected?.following?.length || 0, [userSelected?.following]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await followUser(userSelected._id);
  }

  if (isMobile || !userSelected) {
    return (
      <Link
        href={`/Pages/User/${userSelected?._id}`}
        className="font-medium hover:underline inline-block"
      >
        {children || userSelected?.username}
      </Link>
    )
  }

  return (
    <HoverCard.Root openDelay={300} closeDelay={200}>
      <HoverCard.Trigger asChild>
        <span className="cursor-pointer">
          {children || (
            <Link
              href={`/Pages/User/${userSelected?._id}`}
              className="font-semibold hover:underline"
            >
              {userSelected?.username}
            </Link>
          )}
        </span>
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          side={side}
          sideOffset={8}
          align="start"
          className="z-[9999] w-80 bg-white dark:bg-black rounded-2xl border border-gray-100 dark:border-threads-border shadow-2xl p-5 overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex flex-col gap-4">
            {/* Top: Avatar & Action */}
            <div className="flex items-start justify-between">
              <Link href={`/Pages/User/${userSelected?._id}`}>
                <Avatar
                  src={userSelected?.profilePhoto?.url}
                  alt={userSelected?.username}
                  size="lg"
                  className="ring-2 ring-transparent hover:ring-gray-100 dark:hover:ring-threads-border transition-all"
                />
              </Link>

              {!isMe && (
                <Button
                  size="sm"
                  variant={isFollowing ? "outline" : "default"}
                  onClick={handleFollow}
                  disabled={loading}
                  className="rounded-full px-5 font-bold"
                >
                  {isFollowing ? t('Following') : t('Follow')}
                </Button>
              )}
            </div>

            {/* Info: Name & Bio */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <Link
                  href={`/Pages/User/${userSelected?._id}`}
                  className="text-lg font-bold hover:underline decoration-2"
                >
                  {userSelected?.username}
                </Link>
                {userSelected?.isAccountWithPremiumVerify && (
                  <CheckCircle2 size={16} className="text-blue-500 fill-blue-500 text-white" />
                )}
              </div>
              <p className="text-gray-500 text-[15px]">@{userSelected?.profileName || userSelected?.username}</p>
            </div>

            {/* Bio */}
            {userSelected?.description && (
              <p className="text-[15px] leading-relaxed text-gray-800 dark:text-gray-200 line-clamp-3">
                {userSelected.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 pt-1">
              <Link href={`/Pages/User/${userSelected?._id}/followers`} className="flex items-center gap-1 group">
                <span className="font-bold text-gray-900 dark:text-white group-hover:underline">{followerCount}</span>
                <span className="text-gray-500 text-[14px]">{t("Followers")}</span>
              </Link>
              <Link href={`/Pages/User/${userSelected?._id}/following`} className="flex items-center gap-1 group">
                <span className="font-bold text-gray-900 dark:text-white group-hover:underline">{followingCount}</span>
                <span className="text-gray-500 text-[14px]">{t("Following")}</span>
              </Link>
            </div>

            {/* Mutual Follows */}
            {userSelected?.mutualFollowers?.length > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex -space-x-2">
                  {userSelected.mutualFollowers.slice(0, 3).map((u, i) => (
                    <Avatar key={i} src={u.profilePhoto?.url} size="xs" className="border-2 border-white dark:border-black" />
                  ))}
                </div>
                <p className="text-[12px] text-gray-500">
                  Followed by {userSelected.mutualFollowers[0].username}
                  {userSelected.mutualFollowers.length > 1 && ` and ${userSelected.mutualFollowers.length - 1} others`}
                </p>
              </div>
            )}
          </div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  )
}

export default UserHoverCard;
