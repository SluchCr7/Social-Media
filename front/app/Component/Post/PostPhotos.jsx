'use client'
import React, { memo } from 'react';
import PostMedia from './PostMedia';

const PostPhotos = memo(({ photos = [], setImageView, postId }) => {
  if (!photos || photos.length === 0) return null;

  return (
    <PostMedia
      photos={photos}
      setImageView={setImageView}
    />
  );
});

PostPhotos.displayName = 'PostPhotos';
export default PostPhotos;
