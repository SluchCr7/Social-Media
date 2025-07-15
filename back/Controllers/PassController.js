const AsyncHandler = require("express-async-handler");
const {User , ValidateUser ,validateEmail, validatePasswordUpdate} = require("../Modules/User");
const bcrypt = require("bcrypt");
const crypto = require('crypto')
const sendEmail = require('../utils/sendMail')
const Verification = require('../Modules/VerificationToken')


/**
 * @desc    Send reset password Link
 * @route   POST /api/pass/reset-password-link
 * @access  Public
 * @method  POST
 */

const sendResetPasswordLink = AsyncHandler(async (req, res) => {
    // Validate Email
    const { error } = validateEmail(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).send("Invalid email")
    }
    let verificationToken = await Verification.findOne({ userId: user._id })
    if (!verificationToken) {
        verificationToken = new Verification({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex")
        })
        await verificationToken.save()
    }
    const link = `http://localhost:3000/reset/${user._id}/${verificationToken.token}`
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
  `
    await sendEmail(user.email , "Reset Password" , htmlTemp)
})

const resetPassword = AsyncHandler(async (req, res) => {
    const {error} = validatePasswordUpdate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const user = await User.findById(req.params.id)
    if (!user) {
        return res.status(400).send("Invalid User")
    }
    const verificationToken = await Verification.findOne({ userId: user._id })
    if (!verificationToken) {
        return res.status(400).send("Invalid User")
    }
    if (!user.isAccountVerified) {
        user.isAccountVerified = true
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password , salt)
    user.password = hashedPassword
    await Verification.findByIdAndDelete(verificationToken._id)
    await user.save()
    res.status(200).json({message : "Password Reset Successfully"})
})

module.exports = { sendResetPasswordLink , resetPassword }