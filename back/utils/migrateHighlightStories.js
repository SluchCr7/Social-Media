const dotenv = require('dotenv');
const connectDB = require('../Config/db');
const { Highlight } = require('../Modules/Highlight');
const { Story } = require('../Modules/Story');

dotenv.config();

const migrate = async () => {
  await connectDB();

  console.log('Starting highlight/story migration...');

  const highlights = await Highlight.find({}).select('stories');
  const storyToHighlightIds = new Map();

  highlights.forEach((highlight) => {
    (highlight.stories || []).forEach((storyId) => {
      const id = storyId.toString();
      if (!storyToHighlightIds.has(id)) {
        storyToHighlightIds.set(id, []);
      }
      storyToHighlightIds.get(id).push(highlight._id);
    });
  });

  const storyIds = Array.from(storyToHighlightIds.keys());
  if (storyIds.length > 0) {
    const bulkOps = storyIds.map((storyId) => ({
      updateOne: {
        filter: { _id: storyId },
        update: {
          $set: {
            isHighlighted: true,
            preserveAfterExpiration: true,
            highlightIds: storyToHighlightIds.get(storyId),
          },
        },
      },
    }));

    const bulkResult = await Story.bulkWrite(bulkOps);
    console.log(`Updated ${bulkResult.modifiedCount} story highlight metadata records.`);
  } else {
    console.log('No highlight stories found to migrate.');
  }

  const now = new Date();
  const archiveResult = await Story.updateMany(
    { expiresAt: { $lt: now }, isArchived: false, isDeleted: false },
    { $set: { isArchived: true } }
  );
  console.log(`Archived ${archiveResult.modifiedCount} expired stories.`);

  const deleteResult = await Story.updateMany(
    {
      expiresAt: { $lt: now },
      isDeleted: false,
      $or: [{ highlightIds: { $exists: false } }, { highlightIds: [] }],
    },
    { $set: { isDeleted: true } }
  );
  console.log(`Soft deleted ${deleteResult.modifiedCount} expired non-highlighted stories.`);

  console.log('Migration complete.');
  process.exit(0);
};

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
