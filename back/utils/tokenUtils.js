const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require("dotenv").config()

// Enforce mandatory independent environment variables
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error('FATAL: ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be explicitly set in environment variables.');
}

if (ACCESS_TOKEN_SECRET === REFRESH_TOKEN_SECRET) {
  throw new Error('FATAL: ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be distinct, independent cryptographic secrets.');
}

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const ACCESS_COOKIE_MAX_AGE = 15 * 60 * 1000; // 15 minutes
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Hash a token string using SHA-256 for secure database storage
 */
const hashToken = (token) => {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
};

/**
 * Generate short-lived Access Token
 */
const generateAccessToken = (user) => {
  const jti = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
  return jwt.sign(
    {
      _id: String(user._id || user.id),
      isAdmin: Boolean(user.isAdmin),
      email: user.email,
      typ: 'access',
      jti,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

/**
 * Generate long-lived Refresh Token with family tracking
 */
const generateRefreshToken = (user, familyId = null) => {
  const jti = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
  const family = familyId || (crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex'));
  return jwt.sign(
    {
      _id: String(user._id || user.id),
      typ: 'refresh',
      jti,
      family,
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

/**
 * Verify Access Token
 */
const verifyAccessToken = (token) => {
  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    if (payload.typ && payload.typ !== 'access') {
      return { payload: null, expired: false, error: 'Invalid token type' };
    }
    return { payload, expired: false };
  } catch (err) {
    return {
      payload: null,
      expired: err.name === 'TokenExpiredError',
      error: err.message,
    };
  }
};

/**
 * Verify Refresh Token
 */
const verifyRefreshToken = (token) => {
  try {
    const payload = jwt.verify(token, REFRESH_TOKEN_SECRET);
    if (payload.typ && payload.typ !== 'refresh') {
      return { payload: null, expired: false, error: 'Invalid token type' };
    }
    return { payload, expired: false };
  } catch (err) {
    return {
      payload: null,
      expired: err.name === 'TokenExpiredError',
      error: err.message,
    };
  }
};

/**
 * Determine cookie options based on deployment environment
 */
const getCookieOptions = (isRefresh = false) => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: isRefresh ? REFRESH_COOKIE_MAX_AGE : ACCESS_COOKIE_MAX_AGE,
  };
};

/**
 * Set HTTP-Only authentication cookies
 */
const setAuthCookies = (res, accessToken, refreshToken) => {
  const accessOpts = getCookieOptions(false);
  const refreshOpts = getCookieOptions(true);

  res.cookie('accessToken', accessToken, accessOpts);
  res.cookie('token', accessToken, accessOpts); // backward compatibility fallback for old consumers

  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, refreshOpts);
  }
};

/**
 * Clear authentication cookies
 */
const clearAuthCookies = (res) => {
  const baseOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  };

  res.clearCookie('accessToken', baseOpts);
  res.clearCookie('refreshToken', baseOpts);
  res.clearCookie('token', baseOpts);
};

module.exports = {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  ACCESS_COOKIE_MAX_AGE,
  REFRESH_COOKIE_MAX_AGE,
  hashToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getCookieOptions,
  setAuthCookies,
  clearAuthCookies,
};
