
const { processScheduledPosts } = require("../utils/schedulePosts");

const startScheduledPosts = (io) => {
    return setInterval(() => {
        processScheduledPosts(io);
    }, 60 * 1000);
};

module.exports = startScheduledPosts;
