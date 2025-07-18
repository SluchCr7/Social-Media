'use client';

import SluchitEntry from '@/app/Component/SluchitEntry';
import { useAuth } from '@/app/Context/AuthContext';
import { useCommunity } from '@/app/Context/CommunityContext';
import { usePost } from '@/app/Context/PostContext';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaUsers, FaTrashAlt, FaCrown } from 'react-icons/fa';
import EditCommunityMenu from '@/app/Component/EditCommunityMenu';
import { generateMeta } from '@/app/utils/MetaDataHelper';
import { FaUser } from "react-icons/fa";

const Page = ({ params }) => {
  const id = params?.id;
  const [CommunitySelected, setCommunitySelected] = useState(null);
  const { communities, joinToCommunity, removeMember, makeAdmin } = useCommunity();
  const { user } = useAuth();
  const [postsFiltered, setPostsFiltered] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { posts } = usePost();

  useEffect(() => {
    const matchedCommunity = communities?.find((c) => c?._id === id);
    if (matchedCommunity) {
      setCommunitySelected(matchedCommunity);
    }
  }, [communities, id]);

  useEffect(() => {
    const filteredPosts = posts?.filter((post) => post?.community?._id === id);
    setPostsFiltered(filteredPosts);
  }, [posts, id]);

  if (!CommunitySelected) {
    return <div className="text-center text-gray-500 py-10 flex items-center w-full justify-center min-h-[100vh] text-lg">Loading community...</div>;
  }

  const isOwner = (memberId) => {
    if (Array.isArray(CommunitySelected?.owner)) {
      return CommunitySelected?.owner.some(o => o?._id === memberId || o === memberId);
    }
    return CommunitySelected?.owner?._id === memberId || CommunitySelected?.owner === memberId;
  };

  const isAdmin = (memberId) => {
    return CommunitySelected?.Admins?.some((admin) => admin?._id === memberId || admin === memberId);
  };

  const filteredMembers = CommunitySelected?.members?.filter(member =>
    member?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member?.profileName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='flex flex-col w-full'>
      {/* Cover & Avatar */}
      <div className='relative w-full'>
        <Image
          src={CommunitySelected?.Cover?.url || '/default-cover.jpg'}
          alt='Community Cover'
          width={1200}
          height={300}
          className='w-full h-[200px] object-cover rounded-b-lg shadow'
        />
        <div className='absolute left-4 -bottom-10'>
          <Image
            src={CommunitySelected?.Picture?.url || '/default-avatar.png'}
            alt='Community Avatar'
            width={100}
            height={100}
            className='w-24 h-24 rounded-full border-4 border-white dark:border-darkMode-bg object-cover shadow-xl'
          />
        </div>
      </div>

      {/* Community Info */}
      <div className='mt-16 px-4 flex flex-col gap-2'>
        <div className='flex items-center justify-between flex-wrap'>
          <h2 className='text-2xl font-bold text-lightMode-fg dark:text-darkMode-fg flex items-center gap-2'>
            {CommunitySelected?.Name}
            <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md">
              {CommunitySelected?.isPrivate ? 'Private' : 'Public'}
            </span>
          </h2>

          <div className="flex gap-2 mt-2 sm:mt-0">
            {(isOwner(user?._id) || isAdmin(user?._id))  &&  (
              <>
                <button
                  onClick={() => setShowEdit(true)}
                  className='flex items-center gap-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md'
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => setShowMembers(true)}
                  className='flex items-center gap-2 text-sm bg-gray-800 hover:bg-gray-900 text-white py-1 px-3 rounded-md'
                >
                  <FaUsers /> Members
                </button>
              </>
            )}
            {!isOwner(user?._id) && (
              CommunitySelected?.members?.some((member) => member?._id === user?._id)? (
                <button
                  onClick={() => joinToCommunity(CommunitySelected?._id)}
                  className='flex items-center gap-2 text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md'
                >
                  <FaPlus /> Disjoin
                </button>
              ) : (
                <button
                  onClick={() => joinToCommunity(CommunitySelected?._id)}
                  className='flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md'
                >
                  <FaPlus /> Join
                </button>
              )
            )}
          </div>
        </div>

        <p className='text-sm text-gray-600 dark:text-gray-300 max-w-2xl w-[70%]'>
          {CommunitySelected?.description}
        </p>
        <div className='flex items-start flex-col gap-3'>
          <p className='text-sm text-gray-500 flex items-center gap-1'>
            <span><FaUser /></span>
            {CommunitySelected?.members?.length || 0} Members
          </p>
          <div className='flex items-center gap-2'>
            {
              CommunitySelected?.members?.slice(0, 5).map((member) => (
                <Image
                  key={member?._id || member}
                  src={member?.profilePhoto?.url || '/default-avatar.png'}
                  alt='Community Member'
                  width={30}
                  height={30}
                  className='w-7 h-7 rounded-full border-2 border-white dark:border-darkMode-bg object-cover shadow'
                />
              ))
            }
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className='my-6 border-lightMode-fg/20 dark:border-darkMode-fg/20 mx-4' />

      {/* Posts */}
      <div className='w-full px-4 flex flex-col gap-6 pb-10'>
        {postsFiltered.length > 0 ? (
          postsFiltered.map((post) => (
            <SluchitEntry post={post} key={post?._id} />
          ))
        ) : (
          <div className='text-center text-gray-400 text-sm'>No posts in this community yet.</div>
        )}
      </div>

      {/* Edit Menu Modal */}
      {showEdit && (
        <EditCommunityMenu
          community={CommunitySelected}
          onClose={() => setShowEdit(false)}
        />
      )}

      {/* Members Modal */}
      {showMembers && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-darkMode-menu rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowMembers(false)}
              className="absolute top-2 right-3 text-xl text-gray-500 hover:text-red-500"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold text-center mb-4">Community Members</h3>

            <input
              type="text"
              placeholder="Search by username or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mb-4 p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-darkMode-bg"
            />

            <div className="max-h-96 overflow-y-auto flex flex-col gap-4">
              {/* {filteredMembers?.map((member, i) => (
                <div key={i} className="flex items-center justify-between w-full gap-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={member?.profilePhoto?.url || '/default-avatar.png'}
                      alt='Member'
                      width={40}
                      height={40}
                      className='rounded-full w-10 h-10 object-cover'
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white flex items-center gap-2">
                        {member?.username || 'User'}
                        {isOwner(member._id) && (
                          <span className="text-xs bg-yellow-400 text-white px-2 py-0.5 rounded-full">Owner</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{member?.profileName || ''}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    {!isOwner(member._id) && (
                      <>
                        <button onClick={() => makeAdmin(CommunitySelected._id, member._id)}>
                          <FaCrown className="text-yellow-500 hover:text-yellow-600" />
                        </button>
                        <button onClick={() => removeMember(CommunitySelected._id, member._id)}>
                          <FaTrashAlt className="text-red-500 hover:text-red-600" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))} */}
              {filteredMembers?.map((member, i) => {
                const memberIsAdmin = isAdmin(member?._id);
                return (
                  <div key={i} className="flex items-center justify-between w-full gap-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={member?.profilePhoto?.url || '/default-avatar.png'}
                        alt='Member'
                        width={40}
                        height={40}
                        className='rounded-full w-10 h-10 object-cover'
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white flex items-center gap-2">
                          {member?.username}
                          {isOwner(member?._id) && (
                            <span className="text-xs bg-yellow-400 text-white px-2 py-0.5 rounded-full">Owner</span>
                          )}
                          {memberIsAdmin && !isOwner(member?._id) && (
                            <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Admin</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{member?.profileName || ''}</p>
                      </div>
                    </div>

                    {/* Controls only for owner/admins */}
                    {(isOwner(user?._id) || isAdmin(user?._id)) && !isOwner(member?._id) && (
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => makeAdmin(CommunitySelected?._id, member?._id)}
                          title={isAdmin(member?._id) ? "Remove Admin" : "Make Admin"}
                        >
                          <FaCrown className={`hover:scale-110 transition ${memberIsAdmin ? 'text-yellow-600' : 'text-yellow-400'}`} />
                        </button>
                        <button onClick={() => removeMember(CommunitySelected?._id, member?._id)}>
                          <FaTrashAlt className="text-red-500 hover:text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
