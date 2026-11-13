const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  RegisterNewUser,
  LoginUser,
  LogoutUser,
  LogoutAllSessions,
  RefreshToken,
  GetCurrentUser,
} = require('../Controllers/AuthController');
const { verifyToken } = require('../Middelwares/verifyToken');

const route = express.Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
});

route.post('/register', authLimiter, RegisterNewUser);
route.post('/login', authLimiter, LoginUser);
route.post('/logout', LogoutUser);
route.post('/logout-all', verifyToken, LogoutAllSessions);
route.post('/refresh', RefreshToken);
route.get('/me', verifyToken, GetCurrentUser);

module.exports = route;
