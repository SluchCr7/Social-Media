
const cron = require("node-cron");

const archiveExpiredStories = require("./storyCleanup");
const startScheduledPosts = require("./schedulePosts");

const startJobs = (io) => {
    cron.schedule("0 * * * *", archiveExpiredStories, {
        scheduled: true,
        timezone: "Asia/Riyadh",
    });

    console.log("Story archiving job scheduled (Hourly).");

    const scheduledPostsInterval = startScheduledPosts(io);

    return () => {
        cron.getTasks().forEach((task) => task.stop());
        clearInterval(scheduledPostsInterval);
    };
};

module.exports = startJobs;
