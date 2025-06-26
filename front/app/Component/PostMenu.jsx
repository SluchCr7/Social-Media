import React, { useEffect } from 'react';
import { CiEdit, CiMapPin } from 'react-icons/ci';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdOutlineReport } from 'react-icons/md';
import { useAuth } from '../Context/AuthContext';
import { usePost } from '../Context/PostContext';


const PostMenu = ({ showMenu, setShowMenu, post }) => {
  const { user , pinPost , users} = useAuth();
  const {deletePost} = usePost()
  const isOwner = post?.owner?._id === user?._id; 
  const [myUser , setMyUser] = React.useState(null)
  useEffect(() => {
    setMyUser(users.find((userobj) => userobj._id === user._id))
  }, [users])
  // useEffect(()=> console.log(myUser) , [myUser])
  // useEffect(()=> console.log(myUser?.pinsPosts?.includes(post._id)) , [myUser , post])
  const ownerOptions = [
    {
      icon: <CiMapPin />,
      text: myUser?.pinsPosts?.some(p => p.id === post._id) ? 'Unpin Post' : 'Pin Post',

      action: ()=> pinPost(post._id),
    },
    {
      icon: <CiEdit />,
      text: 'Edit Post',
      action: () => console.log('Editing post...'),
    },
    {
      icon: <AiOutlineDelete />,
      text: 'Delete Post',
      action: () => deletePost(post._id),
      className: 'text-red-500',
    },
  ];
  const visitorOptions = [
    {
      icon: <MdOutlineReport />,
      text: 'Report Post',
      action: () => console.log('Reporting post...'),
      className: 'text-red-400',
    },
  ];
  const optionsToShow = isOwner ? ownerOptions : visitorOptions;
  return (
    <div
      className={`${
        showMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } absolute top-10 right-0 transition-opacity duration-500 flex flex-col w-[250px] bg-lightMode-menu dark:bg-darkMode-menu rounded-lg shadow-lg z-50`}
    >
      {optionsToShow.map((option, index) => (
        <div
          key={index}
          onClick={() => {
            option.action();
            setShowMenu(false);
          }}
          className={`flex items-center gap-2 w-full px-4 py-3 cursor-pointer transition-all duration-200 ${
            option.className || 'text-lightMode-fg dark:text-darkMode-fg'
          }`}
        >
          <span className="text-xl">{option.icon}</span>
          <span className="text-sm font-medium">{option.text}</span>
        </div>
      ))}
    </div>
  );
};

export default PostMenu;
