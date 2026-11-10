const AsyncHandler = require('express-async-handler');
const passwordService = require('../Services/passwordService');

const sendResult = (res, result) => {
  if (!result) return undefined;
  if (typeof result.body === 'string') return res.status(result.status).send(result.body);
  return res.status(result.status).json(result.body);
};

const sendResetPasswordLink = AsyncHandler(async (req, res) => {
  return sendResult(res, await passwordService.sendResetPasswordLink({ body: req.body }));
});

const resetPassword = AsyncHandler(async (req, res) => {
  return sendResult(res, await passwordService.resetPassword({
    id: req.params.id,
    token: req.params.token,
    body: req.body,
  }));
});

module.exports = { sendResetPasswordLink, resetPassword };
