const { verifyAccessToken } = require('../utils/tokenUtils');
const { User } = require('../Modules/User');

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'No authentication token provided', code: 'NO_TOKEN' });
  }

  const { payload, expired, error } = verifyAccessToken(token);

  if (expired) {
    return res.status(401).json({ message: 'Access token expired', code: 'TOKEN_EXPIRED' });
  }

  if (!payload || error) {
    return res.status(401).json({ message: 'Invalid authentication token', code: 'INVALID_TOKEN' });
  }

  try {
    // Check account status in DB
    const user = await User.findById(payload._id)
      .select('+tokenVersion accountStatus suspendedUntil isAdmin email username refreshTokens.family');
    if (!user) {
      return res.status(401).json({ message: 'User account not found', code: 'USER_NOT_FOUND' });
    }
    if ((Number(payload.tokenVersion) || 0) !== (Number(user.tokenVersion) || 0)) {
      return res.status(401).json({ message: 'Authentication session revoked', code: 'SESSION_REVOKED' });
    }
    if (payload.sid && !(user.refreshTokens || []).some((session) => session.family === payload.sid)) {
      return res.status(401).json({ message: 'Authentication session revoked', code: 'SESSION_REVOKED' });
    }

    if (user.accountStatus === 'banned') {
      return res.status(403).json({ message: 'Account has been permanently banned', code: 'ACCOUNT_BANNED' });
    }

    if (user.accountStatus === 'suspended' && user.suspendedUntil && new Date(user.suspendedUntil) > new Date()) {
      return res.status(403).json({
        message: `Account is suspended until ${new Date(user.suspendedUntil).toLocaleString()}`,
        code: 'ACCOUNT_SUSPENDED',
      });
    }

    req.token = token;
    req.user = {
      _id: String(user._id),
      id: String(user._id),
      isAdmin: Boolean(user.isAdmin),
      email: user.email || payload.email,
      username: user.username,
    };

    next();
  } catch (dbErr) {
    return res.status(500).json({ message: 'Authentication verification failure', error: dbErr.message });
  }
};

const optionalVerifyToken = async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return next();
  }

  const { payload, expired, error } = verifyAccessToken(token);

  if (expired || error || !payload?._id) {
    // For optional routes, proceed as unauthenticated guest instead of rejecting with 401
    return next();
  }

  try {
    const user = await User.findById(payload._id)
      .select('+tokenVersion accountStatus suspendedUntil isAdmin email username refreshTokens.family')
      .lean();

    if (!user ||
        (Number(payload.tokenVersion) || 0) !== (Number(user.tokenVersion) || 0) ||
        (payload.sid && !(user.refreshTokens || []).some((session) => session.family === payload.sid)) ||
        user.accountStatus === 'banned') {
      return next();
    }

    if (user.accountStatus === 'suspended' && user.suspendedUntil && new Date(user.suspendedUntil) > new Date()) {
      return next();
    }

    req.token = token;
    req.user = {
      _id: String(user._id),
      id: String(user._id),
      isAdmin: Boolean(user.isAdmin),
      email: user.email || payload.email,
      username: user.username,
    };

    next();
  } catch {
    next();
  }
};

// Verify admin
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied: administrator privileges required' });
    }
  });
};

// Verify same user
const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    const userId = req.user?._id || req.user?.id;
    if (String(userId) === String(req.params.id)) {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied: unauthorized resource access' });
    }
  });
};

// Verify admin or same user
const verifyAdminOrUser = (req, res, next) => {
  verifyToken(req, res, () => {
    const userId = req.user?._id || req.user?.id;
    if (req.user?.isAdmin || String(userId) === String(req.params.id)) {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied: unauthorized' });
    }
  });
};

module.exports = { verifyToken, optionalVerifyToken, verifyAdmin, verifyUser, verifyAdminOrUser };
