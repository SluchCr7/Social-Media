
const { Story } = require("../Modules/Story");

const archiveExpiredStories = async () => {
    try {
        const now = new Date();

        const archiveResult = await Story.updateMany(
            {
                expiresAt: { $lt: now },
                isArchived: false,
                isDeleted: false,
            },
            {
                $set: { isArchived: true },
            }
        );

        if (archiveResult.modifiedCount > 0) {
            console.log(
                `[Cron Job] Archived ${archiveResult.modifiedCount} expired stories.`
            );
        }
    } catch (error) {
        console.error("Error in story archiving cron job:", error);
    }
};

module.exports = archiveExpiredStories;
