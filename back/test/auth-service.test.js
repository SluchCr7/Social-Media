const test = require('node:test');
const assert = require('node:assert/strict');

process.env.ACCESS_TOKEN_SECRET = 'auth-service-test-access-secret';
process.env.REFRESH_TOKEN_SECRET = 'auth-service-test-refresh-secret';
process.env.AUTH_COOKIE_SAME_SITE = 'lax';
process.env.NODE_ENV = 'test';

const { User } = require('../Modules/User');
const authService = require('../Services/authService');
const {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  setAuthCookies,
} = require('../utils/tokenUtils');

test('refresh rotates the hash atomically and never returns token values in JSON', async (t) => {
  const originalFindOneAndUpdate = User.findOneAndUpdate;
  const originalExists = User.exists;
  const originalUpdateOne = User.updateOne;
  const userId = '507f1f77bcf86cd799439011';
  const family = 'refresh-family-test';
  const refreshToken = generateRefreshToken({ _id: userId, tokenVersion: 0 }, family);
  let capturedFilter;
  let capturedUpdate;

  t.after(() => {
    User.findOneAndUpdate = originalFindOneAndUpdate;
    User.exists = originalExists;
    User.updateOne = originalUpdateOne;
  });

  User.findOneAndUpdate = (filter, update) => {
    capturedFilter = filter;
    capturedUpdate = update;
    return { select: () => Promise.resolve({ _id: userId, accountStatus: 'active', tokenVersion: 0 }) };
  };

  const rotation = await authService.refreshSession({ refreshToken });

  assert.equal(rotation.status, 200);
  assert.deepEqual(Object.keys(rotation.body), ['message']);
  assert.notEqual(rotation.authCookies.refreshToken, refreshToken);
  assert.equal(
    capturedFilter.refreshTokens.$elemMatch.tokenHash,
    hashToken(refreshToken)
  );
  assert.equal(capturedFilter.refreshTokens.$elemMatch.family, family);
  assert.equal(typeof capturedUpdate.$set['refreshTokens.$'].tokenHash, 'string');
  assert.equal(capturedUpdate.$push.consumedRefreshTokens.$each[0].tokenHash, hashToken(refreshToken));

  User.findOneAndUpdate = () => ({ select: () => Promise.resolve(null) });
  User.exists = async () => true;
  User.updateOne = async () => {
    throw new Error('A concurrent rotation must not revoke the active family');
  };

  const duplicate = await authService.refreshSession({ refreshToken });
  assert.equal(duplicate.status, 409);
  assert.equal(duplicate.body.code, 'TOKEN_ROTATED');
  assert.equal(duplicate.authCookies, undefined);
  assert.equal(JSON.stringify(duplicate.body).includes(refreshToken), false);

  User.exists = async () => false;
  let familyRevocation;
  User.updateOne = async (filter, update) => {
    familyRevocation = { filter, update };
  };

  const reuse = await authService.refreshSession({ refreshToken });
  assert.equal(reuse.status, 403);
  assert.equal(reuse.clearAuthCookies, true);
  assert.equal(familyRevocation.filter._id, userId);
  assert.equal(familyRevocation.update.$pull.refreshTokens.family, family);
});

test('access tokens are bound to a revocable session family', () => {
  const { payload } = require('../utils/tokenUtils').verifyAccessToken(
    generateAccessToken(
      { _id: '507f1f77bcf86cd799439011', tokenVersion: 4 },
      'active-family'
    )
  );
  assert.equal(payload.sid, 'active-family');
  assert.equal(payload.tokenVersion, 4);
});

test('auth cookies are HttpOnly and never use a JavaScript-readable token alias', () => {
  const response = {
    cookies: {},
    cookie(name, value, options) {
      this.cookies[name] = { value, options };
    },
  };

  setAuthCookies(response, 'access-token', 'refresh-token');

  assert.deepEqual(Object.keys(response.cookies).sort(), ['accessToken', 'refreshToken']);
  assert.equal(response.cookies.accessToken.options.httpOnly, true);
  assert.equal(response.cookies.refreshToken.options.httpOnly, true);
  assert.equal(response.cookies.accessToken.options.sameSite, 'lax');
});

test('authentication middleware does not accept a token from Authorization headers', async () => {
  const { verifyToken } = require('../Middelwares/verifyToken');
  const _id = '507f1f77bcf86cd799439011';
  const token = generateAccessToken({ _id });
  let responseStatus;
  let responseBody;
  let nextCalled = false;
  const response = {
    status(status) {
      responseStatus = status;
      return this;
    },
    json(body) {
      responseBody = body;
    },
  };

  await verifyToken({
    headers: { authorization: `Bearer ${token}` },
    cookies: {},
  }, response, () => {
    nextCalled = true;
  });

  assert.equal(responseStatus, 401);
  assert.equal(responseBody.code, 'NO_TOKEN');
  assert.equal(nextCalled, false);
});
