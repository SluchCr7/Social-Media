const { Post } = require("../Modules/Post");

async function processScheduledPosts(io) {
  try {
    const now = new Date();
    const postsToPublish = await Post.find({
      status: "scheduled",
      scheduledAt: { $lte: now },
    });

    for (const post of postsToPublish) {
      post.status = "published";
      await post.save();

      // يمكن إرسال إشعار أو بث Socket.io هنا
      if (io) {
        io.emit("new_post_published", post);
      }
    }

    if (postsToPublish.length > 0) {
      console.log(`✅ Published ${postsToPublish.length} scheduled posts.`);
    }
  } catch (err) {
    console.error("Error processing scheduled posts:", err.message);
  }
}

module.exports = { processScheduledPosts };
