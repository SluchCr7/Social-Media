const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const assert = require('assert');
const mongoose = require('mongoose');
const { verifyAccessToken } = require('../utils/tokenUtils');
const { postPopulate, userOnePopulate, reelPopulate } = require('../Populates/Populate');
const { User } = require('../Modules/User');
const { Post } = require('../Modules/Post');
const Reel = require('../Modules/Reel');
const { Notification } = require('../Modules/Notification');
const { Message } = require('../Modules/Message');
const Event = require('../Modules/Event');
const Report = require('../Modules/Report');
const Community = require('../Modules/Community');
const Story = require('../Modules/Story');
const Highlight = require('../Modules/Highlight');
const { optionalVerifyToken } = require('../Middelwares/verifyToken');

const runTests = async () => {
  console.log('🚀 Running Performance, Indexing & Data Fetching Test Suite...\n');
  let passed = 0;

  // Test 1: Verify PostSchema indexes
  const postIndexes = Post.schema.indexes();
  const hasStatusCreatedAt = postIndexes.some(([idx]) => idx.status === 1 && idx.createdAt === -1);
  const hasOwnerStatusCreatedAt = postIndexes.some(([idx]) => idx.owner === 1 && idx.status === 1 && idx.createdAt === -1);
  assert.ok(hasStatusCreatedAt, 'Post schema must have { status: 1, createdAt: -1 } index');
  assert.ok(hasOwnerStatusCreatedAt, 'Post schema must have { owner: 1, status: 1, createdAt: -1 } index');
  console.log('  ✅ [PASS] Post compound indexes defined for high-speed feed and user queries');
  passed++;

  // Test 2: Verify UserSchema indexes
  const userIndexes = User.schema.indexes();
  const hasUserEmail = userIndexes.some(([idx, opts]) => idx.email === 1 && opts?.unique === true);
  const hasUserRefresh = userIndexes.some(([idx]) => idx['refreshTokens.tokenHash'] === 1);
  assert.ok(hasUserEmail, 'User schema must have unique index on email');
  assert.ok(hasUserRefresh, 'User schema must have index on refreshTokens.tokenHash');
  console.log('  ✅ [PASS] User schema contains unique email and tokenHash indexes');
  passed++;

  // Test 3: Verify NotificationSchema indexes
  const notifIndexes = Notification.schema.indexes();
  const hasNotifReceiver = notifIndexes.some(([idx]) => idx.receiver === 1 && idx.createdAt === -1);
  assert.ok(hasNotifReceiver, 'Notification schema must have { receiver: 1, createdAt: -1 } index');
  console.log('  ✅ [PASS] Notification schema indexed for high-efficiency unread and list queries');
  passed++;

  // Test 4: Verify MessageSchema indexes
  const msgIndexes = Message.schema.indexes();
  const hasMsgSenderReceiver = msgIndexes.some(([idx]) => idx.sender === 1 && idx.receiver === 1);
  assert.ok(hasMsgSenderReceiver, 'Message schema must have sender/receiver index');
  console.log('  ✅ [PASS] Message schema indexed for fast conversation retrieval');
  passed++;

  // Test 5: Verify postPopulate optimization (views is not populated with full user models)
  const viewsPopulated = postPopulate.some(p => p.path === 'views');
  assert.strictEqual(viewsPopulated, false, 'postPopulate must NOT populate views with user documents');
  console.log('  ✅ [PASS] postPopulate no longer populates views with full user objects (avoids N+1 query explosion)');
  passed++;

  // Test 6: Verify postPopulate owner select doesn’t include massive followers/following arrays
  const ownerPopulate = postPopulate.find(p => p.path === 'owner');
  assert.ok(ownerPopulate, 'postPopulate must populate owner');
  assert.ok(!ownerPopulate.select.includes('followers '), 'owner select in postPopulate must not include full followers array');
  assert.ok(!ownerPopulate.select.includes('following'), 'owner select in postPopulate must not include full following array');
  console.log('  ✅ [PASS] postPopulate owner fields optimized to eliminate multi-megabyte array transfers');
  passed++;

  // Test 7: Verify optionalVerifyToken does NOT reject expired tokens with 401
  const mockExpiredToken = 'header.payload.signature';
  let nextCalled = false;
  let responseStatus = null;
  const mockReq = {
    headers: { authorization: `Bearer ${mockExpiredToken}` },
    cookies: {}
  };
  const mockRes = {
    status: (code) => {
      responseStatus = code;
      return { json: () => {} };
    }
  };
  await optionalVerifyToken(mockReq, mockRes, () => { nextCalled = true; });
  assert.strictEqual(responseStatus, null, 'optionalVerifyToken must never return 401 on expired/invalid token');
  assert.strictEqual(nextCalled, true, 'optionalVerifyToken must call next() and proceed as unauthenticated guest');
  console.log('  ✅ [PASS] optionalVerifyToken gracefully degrades to guest mode without throwing 401 errors');
  passed++;

  // Test 8: Verify userOnePopulate optimization (posts and savedPosts only select _id)
  const postsInUserOne = userOnePopulate.find(p => p.path === 'posts');
  assert.strictEqual(postsInUserOne?.select, '_id', 'posts in userOnePopulate must select _id only');
  const savedPostsInUserOne = userOnePopulate.find(p => p.path === 'savedPosts');
  assert.strictEqual(savedPostsInUserOne?.select, '_id', 'savedPosts in userOnePopulate must select _id only');
  console.log('  ✅ [PASS] userOnePopulate trimmed to eliminate deep cascading populate storms');
  passed++;

  console.log(`\n==================================================`);
  console.log(`All Performance & Architecture Tests Passed: ${passed}/8`);
  console.log(`==================================================\n`);
};

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
