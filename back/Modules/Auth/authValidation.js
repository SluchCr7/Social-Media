const joi = require('joi');
const { PREFERRED_LANGUAGES } = require('../User');

const validateLogin = (credentials) => joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
}).validate(credentials);

const validateRegistration = (user) => joi.object({
  username: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  preferedLanguage: joi.string().valid(...PREFERRED_LANGUAGES).allow('', null).optional(),
}).validate(user);

module.exports = { validateLogin, validateRegistration };
