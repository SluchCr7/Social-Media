const test = require('node:test');
const assert = require('node:assert/strict');
const { User } = require('../Modules/User');
const { io } = require('../Config/socket');
const userService = require('../Services/userService');

test('profile updates persist the online-status preference', async (t) => {
  const originalMethods = {
    findByIdAndUpdate: User.findByIdAndUpdate,
    findById: User.findById,
    emit: io.emit,
  };
  t.after(() => {
    User.findByIdAndUpdate = originalMethods.findByIdAndUpdate;
    User.findById = originalMethods.findById;
    io.emit = originalMethods.emit;
  });

  const userId = 'user-id';
  const updatedUser = {
    _id: userId,
    showOnlineStatus: false,
    toObject() {
      return { _id: this._id, showOnlineStatus: this.showOnlineStatus };
    },
  };
  let update;
  User.findByIdAndUpdate = (id, operation) => {
    update = operation.$set;
    return { populate: async () => updatedUser };
  };
  User.findById = () => ({
    select: async () => ({ pointsHistory: [], profilePhoto: null, description: null }),
  });
  io.emit = () => {};

  const result = await userService.updateProfile({
    userId,
    body: { showOnlineStatus: false },
  });

  assert.equal(result.status, 200);
  assert.equal(update.showOnlineStatus, false);
  assert.equal(result.body.user.showOnlineStatus, false);
});

test('user lookup only includes private fields when the requester is that user', async (t) => {
  const originalFindById = User.findById;
  t.after(() => {
    User.findById = originalFindById;
  });

  const targetUser = {
    _id: 'target-id',
    email: 'private@example.test',
    isAdmin: true,
    accountStatus: 'active',
    loginHistory: [],
    password: 'hashed',
    refreshTokens: [{ tokenHash: 'hash' }],
  };
  User.findById = () => ({ populate: async () => targetUser });

  const publicResult = await userService.getUserById({
    id: 'target-id',
    requesterId: 'another-user',
  });
  assert.equal(publicResult.body.email, undefined);
  assert.equal(publicResult.body.isAdmin, undefined);
  assert.equal(publicResult.body.accountStatus, undefined);
  assert.equal(publicResult.body.loginHistory, undefined);
  assert.equal(publicResult.body.password, undefined);
  assert.equal(publicResult.body.refreshTokens, undefined);

  const selfResult = await userService.getUserById({
    id: 'target-id',
    requesterId: 'target-id',
  });
  assert.equal(selfResult.body.email, 'private@example.test');
  assert.equal(selfResult.body.isAdmin, true);
});

test('all-users lookup returns only public profile fields', async (t) => {
  const originalFind = User.find;
  t.after(() => {
    User.find = originalFind;
  });

  const user = {
    _id: 'target-id',
    email: 'private@example.test',
    isAdmin: true,
    accountStatus: 'active',
    loginHistory: [],
    password: 'hashed',
    refreshTokens: [{ tokenHash: 'hash' }],
  };
  const query = {
    select() {
      return this;
    },
    populate() {
      return this;
    },
    then(resolve, reject) {
      return Promise.resolve([user]).then(resolve, reject);
    },
  };
  User.find = () => query;

  const result = await userService.getAllUsers();

  assert.equal(result.body[0].email, undefined);
  assert.equal(result.body[0].isAdmin, undefined);
  assert.equal(result.body[0].accountStatus, undefined);
  assert.equal(result.body[0].loginHistory, undefined);
  assert.equal(result.body[0].password, undefined);
  assert.equal(result.body[0].refreshTokens, undefined);
});
