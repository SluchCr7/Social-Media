'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePost } from '../Context/PostContext';
import { FaTimes } from 'react-icons/fa';

const EditPostModal = ({ post, onClose }) => {
  const { editPost } = usePost();

  const [text, setText] = useState('');
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);

  // 👇 تحميل البيانات عندما يكون post متاح
  useEffect(() => {
    if (post) {
      setText(post.text || '');
      setExistingPhotos(post.Photos || []);
    }
  }, [post]);

  const removePhoto = (public_id) => {
    setExistingPhotos(existingPhotos.filter(photo => photo.public_id !== public_id));
  };

  const handleNewPhotos = (e) => {
    setNewPhotos([...newPhotos, ...Array.from(e.target.files)]);
  };

  const handleSubmit = async () => {
    if (!post) return;
    await editPost(post._id, { text, existingPhotos, newPhotos });
    onClose();
  };

  // 👇 إذا لم يصل post بعد، لا تعرض المودال
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Edit Post</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600">
            <FaTimes size={18} />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <textarea
            className="w-full h-32 p-3 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
          />

          {existingPhotos.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {existingPhotos.map((photo, idx) => (
                <div key={idx} className="relative group rounded overflow-hidden">
                  <Image
                    src={photo.url}
                    alt="post-img"
                    width={500}
                    height={500}
                    className="object-cover rounded-md w-full h-32"
                  />
                  <button
                    onClick={() => removePhoto(photo.public_id)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          )}

          {newPhotos.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {newPhotos.map((file, idx) => (
                <div key={idx} className="relative rounded overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="new"
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Add Photos</label>
            <input
              type="file"
              multiple
              onChange={handleNewPhotos}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
