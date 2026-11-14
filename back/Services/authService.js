const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { User, PREFERRED_LANGUAGES } = require('../Modules/User');
const { validateLogin, validateRegistration } = require('../Modules/Auth/authValidation');
const {
  REFRESH_TOKEN_MAX_AGE,
  REFRESH_TOKEN_ROTATION_GRACE_MS,
  hashToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require('../utils/tokenUtils');
const generateUniqueUserCode = require('../utils/generateUserCode');
const { userOnePopulate } = require('../Populates/Populate');
const { disconnectUserSockets } = require('../Config/socket');

const result = (status, body, options = {}) => ({ status, body, ...options });
const errorResult = (status, message, options = {}) => result(status, { message, ...options });

const publicUser = (user) => {
  const userObj = user.toObject ? user.toObject() : { ...user };
  ['password', 'refreshTokens', 'consumedRefreshTokens', 'tokenVersion'].forEach((field) => {
    delete userObj[field];
  });
  return userObj;
};

const register = async ({ body, userAgent, ip }) => {
  try {
    const { error } = validateRegistration(body);
    if (error) return result(400, { message: error.details[0].message });
    if (await User.findOne({ email: body.email })) {
      return result(400, { message: 'User already exists' });
    }

    const userCode = await generateUniqueUserCode();
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(body.password, salt);
    const user = new User({
      username: body.username,
      email: body.email,
      password,
      userCode,
      ...(body.preferedLanguage && PREFERRED_LANGUAGES.includes(body.preferedLanguage)
        ? { preferedLanguage: body.preferedLanguage }
        : {}),
    });

    const family = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
    const accessToken = generateAccessToken(user, family);
    const refreshToken = generateRefreshToken(user, family);
    user.refreshTokens = [{
      tokenHash: hashToken(refreshToken),
      family,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
      userAgent: userAgent || '',
      ip: ip || '',
    }];
    await user.save();

    return result(201, {
      message: 'User registered successfully.',
      user: publicUser(user),
    }, { authCookies: { accessToken, refreshToken } });
  } catch (error) {
    return result(500, { message: error.message || 'Internal Server Error' });
  }
};

const login = async ({ body, userAgent, ip, forwardedFor, remoteAddress }) => {
  const { error } = validateLogin(body);
  if (error) return result(400, { message: error.details[0].message });

  const user = await User.findOne({ email: body.email })
    .select('+tokenVersion')
    .populate('following', 'username profileName profilePhoto')
    .populate('followers', 'username profileName profilePhoto');
  if (!user || !await bcrypt.compare(body.password, user.password)) {
    return errorResult(400, 'Email or Password are not correct');
  }
  if (user.accountStatus === 'banned') {
    return errorResult(403, 'Your account has been banned due to violations.');
  }
  if (user.accountStatus === 'suspended' && user.suspendedUntil && new Date(user.suspendedUntil) > new Date()) {
    return errorResult(403, `Your account is suspended until ${new Date(user.suspendedUntil).toLocaleString()}.`);
  }

  const now = new Date();
  user.lastLogin = now;
  user.loginHistory.push({
    date: now,
    ip: ip || forwardedFor || remoteAddress,
    device: userAgent,
  });
  if (user.loginHistory.length > 20) user.loginHistory = user.loginHistory.slice(-20);

  const family = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
  const accessToken = generateAccessToken(user, family);
  const refreshToken = generateRefreshToken(user, family);
  user.refreshTokens = (user.refreshTokens || []).filter((session) => session.expiresAt > now);
  user.refreshTokens.push({
    tokenHash: hashToken(refreshToken),
    family,
    createdAt: now,
    expiresAt: new Date(now.getTime() + REFRESH_TOKEN_MAX_AGE),
    userAgent: userAgent || '',
    ip: ip || forwardedFor || '',
  });
  if (user.refreshTokens.length > 10) user.refreshTokens = user.refreshTokens.slice(-10);
  await user.save();

  return result(200, {
    message: 'Login successful',
    user: publicUser(user),
  }, { authCookies: { accessToken, refreshToken } });
};

const logout = async ({ refreshToken, accessToken }) => {
  const refreshClaims = refreshToken ? verifyRefreshToken(refreshToken).payload : null;
  const accessClaims = accessToken ? verifyAccessToken(accessToken).payload : null;
  const sessionId = refreshClaims?.family || accessClaims?.sid;
  const userId = refreshClaims?._id || accessClaims?._id;

  if (sessionId) {
    await User.updateOne(
      { 'refreshTokens.family': sessionId },
      { $pull: { refreshTokens: { family: sessionId } } }
    );
    if (userId) disconnectUserSockets(userId, sessionId);
  } else if (refreshToken) {
    await User.updateOne(
      { 'refreshTokens.tokenHash': hashToken(refreshToken) },
      { $pull: { refreshTokens: { tokenHash: hashToken(refreshToken) } } }
    );
  }
  return result(200, { message: 'Logged out successfully' }, { clearAuthCookies: true });
};

const logoutAllSessions = async ({ userId }) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { refreshTokens: [] }, $inc: { tokenVersion: 1 } },
    { new: true, select: '+tokenVersion' }
  );
  if (!user) return errorResult(404, 'User not found');
  disconnectUserSockets(userId);
  return result(200, { message: 'Logged out from all sessions successfully' }, { clearAuthCookies: true });
};

const refreshSession = async ({ refreshToken, userAgent, ip, forwardedFor }) => {
  if (!refreshToken) {
    return result(401, { message: 'No refresh token provided', code: 'NO_REFRESH_TOKEN' }, {
      clearAuthCookies: true,
    });
  }

  const { payload, expired } = verifyRefreshToken(refreshToken);
  if (expired || !payload?._id || !payload.jti || !payload.family) {
    return result(401, { message: 'Refresh token expired or invalid', code: 'REFRESH_TOKEN_EXPIRED' }, {
      clearAuthCookies: true,
    });
  }

  const now = new Date();
  const tokenVersion = Number(payload.tokenVersion) || 0;
  const tokenVersionFilter = tokenVersion === 0
    ? { $or: [{ tokenVersion: 0 }, { tokenVersion: { $exists: false } }] }
    : { tokenVersion };
  const incomingTokenHash = hashToken(refreshToken);
  const nextRefreshToken = generateRefreshToken(
    { _id: payload._id, tokenVersion },
    payload.family
  );
  const accessToken = generateAccessToken({ _id: payload._id, tokenVersion }, payload.family);
  const nextSession = {
    tokenHash: hashToken(nextRefreshToken),
    family: payload.family,
    createdAt: now,
    expiresAt: new Date(now.getTime() + REFRESH_TOKEN_MAX_AGE),
    userAgent: userAgent || '',
    ip: ip || forwardedFor || '',
  };

  const user = await User.findOneAndUpdate(
    {
      _id: payload._id,
      ...tokenVersionFilter,
      refreshTokens: {
        $elemMatch: {
          tokenHash: incomingTokenHash,
          family: payload.family,
          expiresAt: { $gt: now },
        },
      },
    },
    {
      $set: { 'refreshTokens.$': nextSession },
      $push: {
        consumedRefreshTokens: {
          $each: [{
            tokenHash: incomingTokenHash,
            family: payload.family,
            expiresAt: new Date(now.getTime() + REFRESH_TOKEN_ROTATION_GRACE_MS),
          }],
          $slice: -50,
        },
      },
    },
    { new: true }
  ).select('+tokenVersion');

  if (user) {
    if (user.accountStatus === 'banned' ||
        (user.accountStatus === 'suspended' && user.suspendedUntil && user.suspendedUntil > now)) {
      await User.updateOne(
        { _id: user._id },
        { $pull: { refreshTokens: { family: payload.family } } }
      );
      return result(403, {
        message: 'Account access denied',
        code: 'ACCOUNT_ACCESS_DENIED',
      }, { clearAuthCookies: true });
    }

    return result(200, { message: 'Session refreshed successfully' }, {
      authCookies: { accessToken, refreshToken: nextRefreshToken },
    });
  }

  const recentlyConsumed = await User.exists({
    _id: payload._id,
    ...tokenVersionFilter,
    consumedRefreshTokens: {
      $elemMatch: {
        tokenHash: incomingTokenHash,
        family: payload.family,
        expiresAt: { $gt: now },
      },
    },
  });
  if (recentlyConsumed) {
    return result(409, {
      message: 'Refresh token was already rotated; retry with the updated cookie.',
      code: 'TOKEN_ROTATED',
    });
  }

  await User.updateOne(
    { _id: payload._id },
    { $pull: { refreshTokens: { family: payload.family } } }
  );
  return result(403, {
    message: 'Refresh token reuse detected or session revoked. Please sign in again.',
    code: 'TOKEN_REUSE_DETECTED',
  }, { clearAuthCookies: true });
};

const getCurrentUser = async ({ userId }) => {
  if (!userId) return errorResult(401, 'Unauthorized', { code: 'UNAUTHORIZED' });
  const user = await User.findById(userId)
    .select('-password -refreshTokens -consumedRefreshTokens')
    .populate(userOnePopulate);
  if (!user) return errorResult(404, 'User not found', { clearAuthCookies: true });
  return result(200, { user: publicUser(user) });
};

module.exports = {
  register,
  login,
  logout,
  logoutAllSessions,
  refreshSession,
  getCurrentUser,
};
