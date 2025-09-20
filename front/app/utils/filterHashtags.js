export const filterHashtags = (posts, hashtagCount)=>{
    posts.forEach((post) => {
    if (Array.isArray(post.Hashtags)) {
      const uniqueTagsInPost = [...new Set(post.Hashtags.map(tag => tag.toLowerCase()))];
      uniqueTagsInPost.forEach((tag) => {
        hashtagCount[tag] = (hashtagCount[tag] || 0) + 1;
      });
    }
  });

}