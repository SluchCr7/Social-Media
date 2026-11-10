const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { User, validateEmail, validatePasswordUpdate } = require('../Modules/User');
const Verification = require('../Modules/VerificationToken');
const sendEmail = require('../utils/sendMail');

const response = (status, body) => ({ status, body });
const RESET_TOKEN_TTL_MS = 10 * 60 * 1000;

const sendResetPasswordLink = async ({ body }) => {
  const { error } = validateEmail(body);
  if (error) return response(400, error.details[0].message);

  const user = await User.findOne({ email: body.email });
  if (!user) return response(400, 'Invalid email');

  let verificationToken = await Verification.findOne({ userId: user._id });
  const isExpired = verificationToken
    && Date.now() - new Date(verificationToken.createdAt).getTime() > RESET_TOKEN_TTL_MS;
  if (!verificationToken || isExpired) {
    const tokenVer = crypto.randomBytes(32).toString('hex');
    if (verificationToken) {
      verificationToken.tokenVer = tokenVer;
      verificationToken.createdAt = new Date();
    } else {
      verificationToken = new Verification({
        userId: user._id,
        tokenVer,
      });
    }
    await verificationToken.save();
  }

  const frontendUrl = (
    process.env.FRONTEND_URL
    || process.env.DOMAIN_NAME
    || 'http://localhost:3000'
  ).replace(/\/+$/, '');
  const link = `${frontendUrl}/Pages/ResetPassword/${user._id}/${verificationToken.tokenVer}`;
  const htmlTemp = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <tr>
          <td style="padding: 30px; text-align: center;">
            <h2 style="color: #333333;">Reset Your Password</h2>
            <p style="font-size: 16px; color: #555555;">
              We received a request to reset your password. Click the button below to choose a new one.
            </p>
            <a href="${link}" style="display: inline-block; margin-top: 20px; padding: 12px 25px; font-size: 16px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">
              Reset Password
            </a>
            <p style="margin-top: 30px; font-size: 14px; color: #999999;">
              If you did not request this, you can safely ignore this email. This link will expire in 10 minutes.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; text-align: center; font-size: 12px; color: #aaaaaa;">
            &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
          </td>
        </tr>
      </table>
    </div>
  `;
  await sendEmail(user.email, 'Reset Password', htmlTemp);
  return response(200, { message: 'Reset link sent to your email' });
};

const resetPassword = async ({ id, token, body }) => {
  const { error } = validatePasswordUpdate(body);
  if (error) return response(400, error.details[0].message);

  const user = await User.findById(id);
  if (!user) return response(400, 'Invalid reset link');
  const verificationToken = await Verification.findOne({
    userId: user._id,
    tokenVer: token,
  });
  if (
    !verificationToken
    || Date.now() - new Date(verificationToken.createdAt).getTime() > RESET_TOKEN_TTL_MS
  ) {
    return response(400, 'Invalid or expired reset link');
  }

  if (!user.isAccountVerified) user.isAccountVerified = true;
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(body.password, salt);
  await Verification.findByIdAndDelete(verificationToken._id);
  await user.save();
  return response(200, { message: 'Password Reset Successfully' });
};

module.exports = { sendResetPasswordLink, resetPassword };
