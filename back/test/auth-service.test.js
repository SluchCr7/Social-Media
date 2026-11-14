const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync, spawnSync } = require('node:child_process');
const path = require('node:path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

process.env.ACCESS_TOKEN_SECRET = 'auth-service-test-access-secret';
process.env.REFRESH_TOKEN_SECRET = 'auth-service-test-refresh-secret';
process.env.AUTH_COOKIE_SAME_SITE = 'lax';
process.env.NODE_ENV = 'test';
process.env.DOMAIN_NAME = 'https://zocial-zeta.vercel.app';

const { User } = require('../Modules/User');
const authService = require('../Services/authService');
const {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  setAuthCookies,
  clearAuthCookies,
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

  const duplicates = await Promise.all([
    authService.refreshSession({ refreshToken }),
    authService.refreshSession({ refreshToken }),
  ]);
  for (const duplicate of duplicates) {
    assert.equal(duplicate.status, 409);
    assert.equal(duplicate.body.code, 'TOKEN_ROTATED');
    assert.equal(duplicate.authCookies, undefined);
    assert.equal(JSON.stringify(duplicate.body).includes(refreshToken), false);
  }

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

test('registration persists only a refresh-token hash and returns no raw tokens', async (t) => {
  const originalFindOne = User.findOne;
  const originalExists = User.exists;
  const originalSave = User.prototype.save;
  let savedUser;

  t.after(() => {
    User.findOne = originalFindOne;
    User.exists = originalExists;
    User.prototype.save = originalSave;
  });

  User.findOne = async () => null;
  User.exists = async () => false;
  User.prototype.save = async function saveUser() {
    savedUser = this;
    return this;
  };

  const registration = await authService.register({
    body: { username: 'test-user', email: 'registration@example.com', password: 'secure-password' },
  });

  assert.equal(registration.status, 201);
  assert.equal(registration.body.user.email, 'registration@example.com');
  assert.equal(registration.body.user.refreshTokens, undefined);
  assert.equal(JSON.stringify(registration.body).includes(registration.authCookies.refreshToken), false);
  assert.equal(
    savedUser.refreshTokens[0].tokenHash,
    hashToken(registration.authCookies.refreshToken)
  );
  assert.equal(
    require('../utils/tokenUtils').verifyAccessToken(registration.authCookies.accessToken).payload.sid,
    savedUser.refreshTokens[0].family
  );
});

test('login stores a hashed session and returns only public user data', async (t) => {
  const originalFindOne = User.findOne;
  const originalSave = User.prototype.save;
  const password = 'secure-password';
  const user = new User({
    username: 'login-user',
    email: 'login@example.com',
    password: await bcrypt.hash(password, 4),
    userCode: 'LOGIN-TEST',
  });
  user.accountStatus = 'active';
  user.tokenVersion = 0;
  let savedUser;
  const query = {
    select() { return this; },
    populate() { return this; },
    then(resolve, reject) { return Promise.resolve(user).then(resolve, reject); },
  };

  t.after(() => {
    User.findOne = originalFindOne;
    User.prototype.save = originalSave;
  });

  User.findOne = () => query;
  User.prototype.save = async function saveUser() {
    savedUser = this;
    return this;
  };

  const login = await authService.login({
    body: { email: 'login@example.com', password },
    userAgent: 'test-agent',
  });

  assert.equal(login.status, 200);
  assert.equal(login.body.user.password, undefined);
  assert.equal(login.body.user.refreshTokens, undefined);
  assert.equal(JSON.stringify(login.body).includes(login.authCookies.accessToken), false);
  assert.equal(
    savedUser.refreshTokens[0].tokenHash,
    hashToken(login.authCookies.refreshToken)
  );
  assert.equal(
    require('../utils/tokenUtils').verifyRefreshToken(login.authCookies.refreshToken).payload.family,
    savedUser.refreshTokens[0].family
  );
});

test('missing, malformed, and expired refresh tokens return 401 without database writes', async () => {
  const missing = await authService.refreshSession({});
  const malformed = await authService.refreshSession({ refreshToken: 'not-a-jwt' });
  const expired = jwt.sign({
    _id: '507f1f77bcf86cd799439011',
    typ: 'refresh',
    jti: 'expired-jti',
    family: 'expired-family',
    iat: Math.floor(Date.now() / 1000) - 60,
  }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1s' });
  const expiredResult = await authService.refreshSession({ refreshToken: expired });

  for (const result of [missing, malformed, expiredResult]) {
    assert.equal(result.status, 401);
    assert.equal(result.clearAuthCookies, true);
  }
  assert.equal(missing.body.code, 'NO_REFRESH_TOKEN');
  assert.equal(malformed.body.code, 'REFRESH_TOKEN_EXPIRED');
  assert.equal(expiredResult.body.code, 'REFRESH_TOKEN_EXPIRED');
});

test('refresh returns an explicit terminal code for banned or suspended accounts', async (t) => {
  const originalFindOneAndUpdate = User.findOneAndUpdate;
  const originalUpdateOne = User.updateOne;
  const refreshToken = generateRefreshToken(
    { _id: '507f1f77bcf86cd799439011', tokenVersion: 0 },
    'restricted-family'
  );

  t.after(() => {
    User.findOneAndUpdate = originalFindOneAndUpdate;
    User.updateOne = originalUpdateOne;
  });

  User.findOneAndUpdate = () => ({
    select: () => Promise.resolve({ _id: '507f1f77bcf86cd799439011', accountStatus: 'banned' }),
  });
  User.updateOne = async () => ({ modifiedCount: 1 });

  const banned = await authService.refreshSession({ refreshToken });
  assert.equal(banned.status, 403);
  assert.equal(banned.body.code, 'ACCOUNT_ACCESS_DENIED');
  assert.equal(banned.clearAuthCookies, true);
});

test('logout revokes the matching session family and logout-all invalidates every session', async (t) => {
  const originalUpdateOne = User.updateOne;
  const originalFindByIdAndUpdate = User.findByIdAndUpdate;
  const userId = '507f1f77bcf86cd799439011';
  const family = 'logout-family';
  const refreshToken = generateRefreshToken({ _id: userId }, family);
  let logoutFilter;
  let logoutAllUpdate;

  t.after(() => {
    User.updateOne = originalUpdateOne;
    User.findByIdAndUpdate = originalFindByIdAndUpdate;
  });

  User.updateOne = async (filter) => {
    logoutFilter = filter;
    return { modifiedCount: 1 };
  };
  User.findByIdAndUpdate = async (_id, update) => {
    logoutAllUpdate = update;
    return { _id };
  };

  const logout = await authService.logout({ refreshToken });
  const logoutAll = await authService.logoutAllSessions({ userId });

  assert.equal(logout.status, 200);
  assert.equal(logout.clearAuthCookies, true);
  assert.equal(logoutFilter['refreshTokens.family'], family);
  assert.equal(logoutAll.status, 200);
  assert.deepEqual(logoutAllUpdate.$set.refreshTokens, []);
  assert.equal(logoutAllUpdate.$inc.tokenVersion, 1);
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
    clearedCookies: {},
    cookie(name, value, options) {
      this.cookies[name] = { value, options };
    },
    clearCookie(name, options) {
      this.clearedCookies[name] = options;
    },
  };

  setAuthCookies(response, 'access-token', 'refresh-token');

  assert.deepEqual(Object.keys(response.cookies).sort(), ['accessToken', 'refreshToken']);
  assert.equal(response.cookies.accessToken.options.httpOnly, true);
  assert.equal(response.cookies.refreshToken.options.httpOnly, true);
  assert.equal(response.cookies.accessToken.options.sameSite, 'lax');
  assert.equal(response.cookies.accessToken.options.domain, undefined);

  clearAuthCookies(response);
  assert.deepEqual(Object.keys(response.clearedCookies).sort(), ['accessToken', 'refreshToken']);
  assert.equal(response.clearedCookies.accessToken.path, response.cookies.accessToken.options.path);
  assert.equal(response.clearedCookies.accessToken.sameSite, response.cookies.accessToken.options.sameSite);
  assert.equal(response.clearedCookies.accessToken.secure, response.cookies.accessToken.options.secure);
  assert.equal(response.clearedCookies.accessToken.domain, response.cookies.accessToken.options.domain);
});

test('registration controller sends both cookies without exposing tokens in JSON', async (t) => {
  const originalRegister = authService.register;
  const accessToken = 'test-access-token';
  const refreshToken = 'test-refresh-token';
  const response = {
    cookies: {},
    statusCode: null,
    body: null,
    cookie(name, value, options) {
      this.cookies[name] = { value, options };
    },
    status(status) {
      this.statusCode = status;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  t.after(() => {
    authService.register = originalRegister;
  });

  authService.register = async () => ({
    status: 201,
    body: { message: 'registered', user: { _id: 'public-user-id' } },
    authCookies: { accessToken, refreshToken },
  });

  const { RegisterNewUser } = require('../Controllers/AuthController');
  await RegisterNewUser({ body: {}, headers: {}, ip: '127.0.0.1' }, response);

  assert.equal(response.statusCode, 201);
  assert.deepEqual(Object.keys(response.cookies).sort(), ['accessToken', 'refreshToken']);
  assert.equal(response.cookies.accessToken.value, accessToken);
  assert.equal(response.cookies.refreshToken.value, refreshToken);
  assert.equal(response.cookies.accessToken.options.httpOnly, true);
  assert.equal(response.cookies.refreshToken.options.httpOnly, true);
  assert.equal(JSON.stringify(response.body).includes(accessToken), false);
  assert.equal(JSON.stringify(response.body).includes(refreshToken), false);
});

test('production cookies default to cross-site settings and clear with matching attributes', () => {
  const output = execFileSync(process.execPath, ['-e', `
    process.env.ACCESS_TOKEN_SECRET = 'production-cookie-test-access-secret';
    process.env.REFRESH_TOKEN_SECRET = 'production-cookie-test-refresh-secret';
    process.env.NODE_ENV = 'production';
    delete process.env.AUTH_COOKIE_SAME_SITE;
    const tokenUtilsPath = require.resolve('./utils/tokenUtils');
    const utils = require(tokenUtilsPath);
    const cookies = {};
    const clearedCookies = {};
    const response = {
      cookie(name, value, options) {
        cookies[name] = options;
      },
      clearCookie(name, options) {
        clearedCookies[name] = options;
      },
    };
    utils.setAuthCookies(response, 'access-token', 'refresh-token');
    utils.clearAuthCookies(response);
    process.stdout.write(JSON.stringify({ cookies, clearedCookies }));
  `], {
    cwd: path.resolve(__dirname, '..'),
    encoding: 'utf8',
  });
  const { cookies, clearedCookies } = JSON.parse(output);

  for (const name of ['accessToken', 'refreshToken']) {
    assert.equal(cookies[name].httpOnly, true);
    assert.equal(cookies[name].secure, true);
    assert.equal(cookies[name].sameSite, 'none');
    assert.equal(cookies[name].path, '/');
    assert.equal(cookies[name].domain, undefined);
    const expectedClearOptions = { ...cookies[name] };
    delete expectedClearOptions.maxAge;
    assert.deepEqual(clearedCookies[name], expectedClearOptions);
  }

  const misconfiguredProduction = spawnSync(process.execPath, ['-e', `
    process.env.ACCESS_TOKEN_SECRET = 'production-cookie-test-access-secret';
    process.env.REFRESH_TOKEN_SECRET = 'production-cookie-test-refresh-secret';
    process.env.NODE_ENV = 'production';
    process.env.AUTH_COOKIE_SAME_SITE = 'lax';
    require('./utils/tokenUtils');
  `], {
    cwd: path.resolve(__dirname, '..'),
    encoding: 'utf8',
  });
  assert.notEqual(misconfiguredProduction.status, 0);
  assert.match(
    misconfiguredProduction.stderr,
    /Production cross-site auth cookies require AUTH_COOKIE_SAME_SITE=none\./
  );
});

test('production requires explicit frontend origins instead of falling back to localhost', () => {
  const missingOrigins = spawnSync(process.execPath, ['-e', "require('./app')"], {
    cwd: path.resolve(__dirname, '..'),
    encoding: 'utf8',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      DOMAIN_NAME: '',
      AUTH_COOKIE_SAME_SITE: 'none',
    },
  });

  assert.notEqual(missingOrigins.status, 0);
  assert.match(
    missingOrigins.stderr,
    /DOMAIN_NAME must contain the allowed frontend origin\(s\) in production\./
  );
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

test('CSRF checks reject unapproved origins and allow the configured frontend origin', () => {
  const createCsrfProtection = require('../Middelwares/csrfProtection');
  const middleware = createCsrfProtection(['https://zocial-zeta.vercel.app']);
  const invoke = (request) => {
    let nextCalled = false;
    let responseStatus;
    let responseBody;
    const response = {
      status(status) {
        responseStatus = status;
        return this;
      },
      json(body) {
        responseBody = body;
      },
    };

    middleware(request, response, () => {
      nextCalled = true;
    });

    return { nextCalled, responseStatus, responseBody };
  };

  const allowed = invoke({
    method: 'POST',
    headers: { origin: 'https://zocial-zeta.vercel.app' },
    cookies: { refreshToken: 'redacted' },
  });
  assert.equal(allowed.nextCalled, true);

  const missingOrigin = invoke({
    method: 'POST',
    headers: {},
    cookies: { refreshToken: 'redacted' },
  });
  assert.equal(missingOrigin.responseStatus, 403);
  assert.equal(missingOrigin.responseBody.code, 'CSRF_ORIGIN_REQUIRED');

  const unapprovedOrigin = invoke({
    method: 'POST',
    headers: { origin: 'https://untrusted.example.test' },
    cookies: {},
  });
  assert.equal(unapprovedOrigin.responseStatus, 403);
  assert.equal(unapprovedOrigin.responseBody.code, 'CSRF_ORIGIN_NOT_ALLOWED');

  assert.equal(invoke({
    method: 'OPTIONS',
    headers: {},
    cookies: {},
  }).nextCalled, true);
});

test('CORS allows only the configured production frontend and covers preflight and auth errors', async (t) => {
  const app = require('../app');
  const server = app.listen(0, '127.0.0.1');
  t.after(() => {
    server.closeAllConnections();
    return new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  });
  await new Promise((resolve) => server.once('listening', resolve));

  const origin = 'https://zocial-zeta.vercel.app';
  const url = `http://127.0.0.1:${server.address().port}/api/auth/refresh`;
  const preflight = await fetch(url, {
    method: 'OPTIONS',
    headers: {
      Origin: origin,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
  });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('access-control-allow-origin'), origin);
  assert.equal(preflight.headers.get('access-control-allow-credentials'), 'true');

  const refresh = await fetch(url, {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json' },
    body: '{}',
  });
  assert.equal(refresh.status, 401);
  assert.equal(refresh.headers.get('access-control-allow-origin'), origin);
  assert.equal(refresh.headers.get('access-control-allow-credentials'), 'true');

  const untrustedPreflight = await fetch(url, {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://untrusted.example.test',
      'Access-Control-Request-Method': 'POST',
    },
  });
  assert.equal(untrustedPreflight.headers.get('access-control-allow-origin'), null);
});

test('the refresh route has no access-token middleware', () => {
  const authRoute = require('../routes/AuthRoute');
  const refreshLayer = authRoute.stack.find(
    (layer) => layer.route?.path === '/refresh' && layer.route.methods.post
  );

  assert.ok(refreshLayer);
  assert.equal(refreshLayer.route.stack.length, 1);
});

test('public profile username lookup accepts query names and preserves the legacy path route', async (t) => {
  const userService = require('../Services/userService');
  const originalLookup = userService.getPublicUserByUsername;
  const { getPublicUserByUsername } = require('../Controllers/UserController');
  const userRoute = require('../routes/UserRoute');
  const usernames = [];

  t.after(() => {
    userService.getPublicUserByUsername = originalLookup;
  });

  userService.getPublicUserByUsername = async ({ username }) => {
    usernames.push(username);
    return { status: 200, body: { username } };
  };

  const invoke = async (request) => {
    let responseBody;
    const response = {
      status(status) {
        assert.equal(status, 200);
        return this;
      },
      json(body) {
        responseBody = body;
        return this;
      },
    };
    await getPublicUserByUsername(request, response, (error) => {
      throw error;
    });
    return responseBody;
  };

  assert.deepEqual(await invoke({
    query: { username: 'Jane Example' },
    params: {},
    headers: {},
  }), { username: 'Jane Example' });
  assert.deepEqual(await invoke({
    query: {},
    params: { username: 'Jane Example' },
    headers: {},
  }), { username: 'Jane Example' });
  assert.deepEqual(usernames, ['Jane Example', 'Jane Example']);
  assert.ok(userRoute.stack.some((layer) =>
    layer.route?.path === '/username' && layer.route.methods.get
  ));
});

test('a valid access cookie authenticates the user and active session family', async (t) => {
  const originalFindById = User.findById;
  const userId = '507f1f77bcf86cd799439011';
  const family = 'middleware-family';
  const token = generateAccessToken({ _id: userId, tokenVersion: 0 }, family);
  const user = {
    _id: userId,
    tokenVersion: 0,
    accountStatus: 'active',
    isAdmin: false,
    username: 'test-user',
    refreshTokens: [{ family }],
  };

  t.after(() => {
    User.findById = originalFindById;
  });

  User.findById = () => ({
    select: () => Promise.resolve(user),
  });

  const { verifyToken } = require('../Middelwares/verifyToken');
  const request = { cookies: { accessToken: token } };
  let nextCalled = false;
  await verifyToken(request, {}, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(request.user._id, userId);
});
