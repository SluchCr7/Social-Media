const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { Post } = require('../Modules/Post');
const { io } = require('../Config/socket');

const pointsEnginePath = require.resolve('../utils/PointsEngine');
const originalPointsEngine = require(pointsEnginePath);
const pointsUpdates = [];
require.cache[pointsEnginePath].exports = {
  ...originalPointsEngine,
  updateUserPoints: async (...args) => pointsUpdates.push(args),
};

const postService = require('../Services/postService');

test('sharing a post stores thoughts, records the sharer, and emits updates', async (t) => {
  const originalMethods = {
    findById: Post.findById,
    findByIdAndUpdate: Post.findByIdAndUpdate,
    save: Post.prototype.save,
    populate: Post.prototype.populate,
    emit: io.emit,
  };
  t.after(() => {
    Post.findById = originalMethods.findById;
    Post.findByIdAndUpdate = originalMethods.findByIdAndUpdate;
    Post.prototype.save = originalMethods.save;
    Post.prototype.populate = originalMethods.populate;
    io.emit = originalMethods.emit;
    require.cache[pointsEnginePath].exports = originalPointsEngine;
  });

  const postId = new mongoose.Types.ObjectId().toString();
  const userId = new mongoose.Types.ObjectId().toString();
  const originalPost = {
    _id: postId,
    owner: userId,
    community: null,
    Photos: [],
    media: [],
    links: [],
    populate: async function () {
      return this;
    },
  };
  const updatedOriginalPost = { _id: postId, community: null, shares: [userId] };
  const emittedEvents = [];
  let updateQuery;
  let savedPost;
  let findByIdCalls = 0;
  Post.findById = async () => {
    findByIdCalls += 1;
    return originalPost;
  };
  Post.findByIdAndUpdate = (...args) => {
    updateQuery = args;
    return { populate: async () => updatedOriginalPost };
  };
  Post.prototype.save = async function () {
    savedPost = this;
    return this;
  };
  Post.prototype.populate = async function () {
    return this;
  };
  io.emit = (event, payload) => emittedEvents.push({ event, payload });

  const invalidText = await postService.sharePost({
    id: postId,
    userId,
    body: { customText: 'x'.repeat(301) },
  });
  assert.equal(invalidText.status, 400);
  assert.equal(findByIdCalls, 0);

  const shared = await postService.sharePost({
    id: postId,
    userId,
    body: { customText: '  thoughtful words  ' },
  });

  assert.equal(shared.status, 201);
  assert.equal(shared.body.text, 'thoughtful words');
  assert.equal(String(shared.body.originalPost), postId);
  assert.equal(savedPost, shared.body);
  assert.deepEqual(updateQuery[1], { $addToSet: { shares: userId } });
  assert.deepEqual(updateQuery[2], { new: true });
  assert.deepEqual(pointsUpdates.at(-1), [userId, 'SHARE_POST', shared.body._id]);
  assert.deepEqual(emittedEvents.map(({ event }) => event), ['post:update', 'post:create']);
  assert.equal(emittedEvents[0].payload, updatedOriginalPost);
});
