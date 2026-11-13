const asyncHandler = require('express-async-handler');
const authService = require('../Services/authService');
const { setAuthCookies, clearAuthCookies } = require('../utils/tokenUtils');

const sendResult = (res, operationResult) => {
  if (!operationResult) return undefined;
  if (operationResult.clearAuthCookies) clearAuthCookies(res);
  if (operationResult.authCookies) {
    setAuthCookies(
      res,
      operationResult.authCookies.accessToken,
      operationResult.authCookies.refreshToken
    );
  }
  if (operationResult.body === undefined) return undefined;
  return res.status(operationResult.status).json(operationResult.body);
};

const endpoint = (operation, select = (req) => ({ body: req.body })) =>
  asyncHandler(async (req, res) => sendResult(res, await authService[operation](select(req))));

const RegisterNewUser = endpoint('register', (req) => ({
  body: req.body,
  userAgent: req.headers['user-agent'],
  ip: req.ip,
}));

const LoginUser = endpoint('login', (req) => ({
  body: req.body,
  userAgent: req.headers['user-agent'],
  ip: req.ip,
  forwardedFor: req.headers['x-forwarded-for'],
  remoteAddress: req.socket?.remoteAddress,
}));

const LogoutUser = endpoint('logout', (req) => ({
  refreshToken: req.cookies?.refreshToken,
  accessToken: req.cookies?.accessToken,
}));

const LogoutAllSessions = endpoint('logoutAllSessions', (req) => ({
  userId: req.user?._id,
}));

const RefreshToken = endpoint('refreshSession', (req) => ({
  refreshToken: req.cookies?.refreshToken,
  userAgent: req.headers['user-agent'],
  ip: req.ip,
  forwardedFor: req.headers['x-forwarded-for'],
}));

const GetCurrentUser = endpoint('getCurrentUser', (req) => ({
  userId: req.user?._id,
}));

module.exports = {
  RegisterNewUser,
  LoginUser,
  LogoutUser,
  LogoutAllSessions,
  RefreshToken,
  GetCurrentUser,
};
