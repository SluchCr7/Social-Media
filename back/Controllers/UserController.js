const { User,validateUserLinks, LoginValidate, ValidateUser, validateUserUpdate, validatePasswordUpdate } = require('../Modules/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const Verification = require('../Modules/VerificationToken')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sendEmail = require('../utils/sendMail')
const path = require('path')
const { cloudUpload, cloudRemove } = require('../Config/cloudUpload')
const fs = require('fs')
const {v2} = require('cloudinary')
const {Post, ValidatePost} = require('../Modules/Post')
const { Comment } = require('../Modules/Comment')
const {Community} = require('../Modules/Community')
const { Notification } = require('../Modules/Notification');
const { Report, ValidateReport } = require('../Modules/Report')
const { validateStory, Story } = require("../Modules/Story");
/**
 * @desc Register New User
 * @route POST /api/auth/register
 * @access Public
 */

const RegisterNewUser = asyncHandler(async (req, res) => {
    const { error } = ValidateUser(req.body)
    if (error) {
        return res.status(400).json({message : error.details[0].message})
    }
    const userExist = await User.findOne({ email: req.body.email })
    if (userExist) return res.status(400).send("User already exists");
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
    })

    await user.save()
    const VerificationToken = new Verification({
        userId: user._id,
        tokenVer: crypto.randomBytes(32).toString('hex'),
    })
    await VerificationToken.save()

    const link = `${process.env.DOMAIN_NAME}/Pages/UserVerify/${user._id}/verify/${VerificationToken.tokenVer}`
    const htmlTemp = `
      <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <tr>
          <td style="padding: 30px;">
            <h2 style="color: #333333;">Welcome to Sluchitt, ${user.username}!</h2>
            <p style="font-size: 16px; color: #555555; line-height: 1.6;">
              Thank you for signing up. To complete your registration, please verify your email address by clicking the button below.
            </p>
  
            <div style="text-align: center; margin: 30px 0;">
              <a href="${link}" style="background-color: #28a745; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
                Verify My Email
              </a>
            </div>
  
            <p style="font-size: 14px; color: #999999;">
              If you didn’t sign up for this account, feel free to ignore this email. Your information will remain secure.
            </p>
  
            <p style="font-size: 14px; margin-top: 30px; color: #555555;">
              Best regards,<br />
              <strong>Sluchitt Team</strong>
            </p>
          </td>
        </tr>
  
        <tr>
          <td style="padding: 20px; text-align: center; font-size: 12px; color: #aaaaaa;">
            &copy; ${new Date().getFullYear()} Slucitt. All rights reserved.
          </td>
        </tr>
      </table>
    </div>
    `;
    await sendEmail(user.email , "Verify your Email" , htmlTemp)

    res.status(201).json({ message: "User Created Successfully and we sent an email now , go to verify your email" });
})

const LoginUser = asyncHandler(async (req, res) => {
  const { error } = LoginValidate(req.body);
  if (error) {
      return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
      return res.status(400).json({ message: "Email or Password are not correct" });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
      return res.status(400).json({ message: "Email or Password are not correct" });
  }

  // Check email verification
  if (!user.isVerify) {
      let verificationToken = await Verification.findOne({ userId: user._id });
      if (!verificationToken) {
          verificationToken = new Verification({
              userId: user._id,
              tokenVer: crypto.randomBytes(32).toString('hex'),
          });
          await verificationToken.save();
      }

      const link = `${process.env.DOMAIN_NAME}/Pages/UserVerify/${user._id}/verify/${verificationToken.tokenVer}`;
      const htmlTemp = `
      <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 40px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #333333;">Welcome to Sluchitt, ${user.username}!</h2>
              <p style="font-size: 16px; color: #555555; line-height: 1.6;">
                Thank you for signing up. To complete your registration, please verify your email address by clicking the button below.
              </p>
    
              <div style="text-align: center; margin: 30px 0;">
                <a href="${link}" style="background-color: #28a745; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
                  Verify My Email
                </a>
              </div>
    
              <p style="font-size: 14px; color: #999999;">
                If you didn’t sign up for this account, feel free to ignore this email. Your information will remain secure.
              </p>
    
              <p style="font-size: 14px; margin-top: 30px; color: #555555;">
                Best regards,<br />
                <strong>Sluchitt Team</strong>
              </p>
            </td>
          </tr>
    
          <tr>
            <td style="padding: 20px; text-align: center; font-size: 12px; color: #aaaaaa;">
              &copy; ${new Date().getFullYear()} Slucitt. All rights reserved.
            </td>
          </tr>
        </table>
      </div>
    `;
      await sendEmail(user.email, 'Verify Email', htmlTemp);

      return res.status(401).json({
          message: "Your email is not verified. A new verification email has been sent.",
          emailSent: true
      });
  }

  // Email is verified: update last login & return token
  user.lastLogin = new Date();
  await user.save();
  
  const token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      process.env.TOKEN_SECRET
  );
  
  // استبعاد كلمة المرور وإضافة التوكن إلى بيانات المستخدم
  const { password, ...others } = user._doc;
  others.token = token; // هنا نضيف التوكن داخل كائن المستخدم
  
  return res.status(200).json({
      message: "Login successful",
      user: others
  });
});

/**
 * @desc get All Users
 * @route GET /api/auth
 * @access Public
 */

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find()
      .populate({
        path: 'followers',
        select: 'profilePhoto username profileName',
      })
        .populate("communities", "Name Picture members")
        .populate({
            path: "pinsPosts",
            populate: {
              path: "owner",
              model: "User",
            },
        })
        .populate({
          path: "stories",
          populate: {
            path: "owner",
            model: "User",
          },
        })
        .populate({
            path: "pinsPosts",
            populate: {
              path: "originalPost",
              model: "Post",
              populate: {
                path: "owner",
                model: "User",
                select: "username profilePhoto profileName", // Optional: limit fields
              },
            },
        })          
      .populate({
        path: 'comments',
        populate: {
          path: 'owner',
          model: 'User',
        },
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'postId',
          populate: {
            path: 'owner',
            model: 'User',
          },
        },
      })
      .populate({
        path: 'posts',
        populate: {
          path: 'owner',
          model: 'User',
        },
      })
      .populate({
        path: 'posts',
        populate: {
          path: 'comments',
          model: 'Comment',
        },
      })
      .populate({
        path: 'posts',
        populate: {
          path: 'originalPost',
          model: 'Post',
        },
      })
      .populate({
        path: 'posts',
        populate: {
          path: 'originalPost',
          populate: {
            path: 'owner',
            model: 'User', // 🛠️ Fix: Was 'Post' — should be 'User'
          },
        },
      })
      .populate({
        path: 'posts',
        populate: {
          path: 'comments',
          populate: {
            path: 'owner',
            model: 'User', // 🛠️ Fix: Was 'Post' — should be 'User'
          },
        },
      })
      .populate('savedPosts')
      .populate({
        path: "reports",
        populate: {
          path: "postId",
          model: "Post",
        },
      })
    res.status(200).json(users);
  });
  

/**
 * @desc get user by id
 * @route GET /api/auth/:id
 * @access Public
 */

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).populate('comments').populate('posts')
    if (!user) {
        return res.status(404).json({ message: "User Not Found" })
    }
    res.status(200).json(user)
})


/**
 * @desc delete User
 * @route DELETE /api/auth/:id
 * @access Public
 */

const DeleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user) {
        return res.status(404).json({ message: "User Not Found" })
    }
    await Post.deleteMany({ owner: req.user._id })
    await Comment.deleteMany({ owner: req.user._id })
    await Story.deleteMany({ owner: req.user._id })
    await Report.deleteMany({ owner: req.user._id })
    await Community.deleteMany({ owner: req.user._id });
    await User.findByIdAndDelete(req.user._id)
    res.status(200).json({message : "User Deleted Successfully"})
})

/**
 * @desc Make User Admin
 * @route PUT /api/admin/:id
 * @access Public
 */
const makeUserAdmin = async (req, res) => {
    try {
        const userId = req.params.id; // Get user ID from the request parameters

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Toggle the isAdmin property
        user.isAdmain = !user.isAdmain;
        // Save the updated user
        await user.save();
        return res.status(200).json({
            message: `User's admin status updated successfully`,
            user,
        });
    } catch (error) {
        console.error('Error toggling admin status:', error);
        return res.status(500).json({ message: 'An error occurred while updating admin status' });
    }
};

/**
 * @desc verify Account
 * @route PUT /api/auth/:id/verify/:token
 * @access Public
 */

const verifyAccount = asyncHandler(async (req, res) => {
  const { id, token } = req.params;

  // التحقق من وجود المستخدم
  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // التحقق من وجود التوكن المرتبط بالمستخدم
  const verificationToken = await Verification.findOne({ userId: user._id, tokenVer: token });
  if (!verificationToken) {
    res.status(404);
    throw new Error('Verification token not found or expired');
  }

  // تحديث حالة التوثيق وتاريخ التوثيق
  user.isVerify = true;
  user.verifyAt = Date.now();

  // حفظ التغييرات
  await user.save();

  // حذف التوكن بعد التحقق الناجح
  await Verification.findByIdAndDelete(verificationToken._id);

  res.status(200).json({ message: 'Email verified successfully' });
});



/**
 * @desc update Profile Photo
 * @route PUT /api/auth/photo
 * @access Public
 */


const uploadPhoto = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({message : "No file uploaded"})
    }
    // Get image 
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
    // Upload Image
    const result = await cloudUpload(imagePath)
    // Get Player
    const user = await User.findById(req.user._id)
    if(user.profilePhoto.publicId !== null){
        await cloudRemove(user.profilePhoto.publicId)
    }
    user.profilePhoto = {
        url: result.secure_url,
        publicId: result.public_id
    }
    await user.save()
    // console.log(result)
    res.status(200).json({
            url: result.secure_url
            , publicId: result.public_id
    })
    fs.unlinkSync(imagePath)
})

const makeFollow = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id); // user to be followed
    const currentUser = await User.findById(req.user._id); // the current logged-in user
  
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
  
    if (user.followers.includes(req.user._id)) {
      // Unfollow
      await User.findByIdAndUpdate(req.params.id, {
        $pull: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: req.params.id },
      });
      res.status(200).json({ message: 'Unfollowed' });
    } else {
      // Follow
      await User.findByIdAndUpdate(req.params.id, {
        $push: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: req.params.id },
      });
      res.status(200).json({ message: 'Followed' });
    }
});

const savePost = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    const post = await Post.findById(req.params.id)
    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }
    if (user.savedPosts.includes(req.params.id)) {
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { savedPosts: req.params.id },
        });
        res.status(200).json({ message: 'Unsaved' })
    }
    else {
        await User.findByIdAndUpdate(req.user._id, {
            $push: { savedPosts: req.params.id },
        });
        res.status(200).json({ message: 'Saved' })
    }
})

const updateProfile = asyncHandler(async (req, res) => {
  const { error } = validateUserUpdate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  const updateData = {
    username: req.body.username,
    description: req.body.description,
    profileName: req.body.profileName,
    country: req.body.country,
    phone: req.body.phone,
    socialLinks: req.body.socialLinks,
    interests: req.body.interests,
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateData },
    { new: true }
  )

  res.status(200).json(updatedUser)
})

const updatePassword = asyncHandler(async (req, res) => {
    const { error } = validatePasswordUpdate(req.body)
    if (error) {
        return res.status(400).json({message :error.details[0].message})
    }
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password , salt) 
    }
    const updateUserPass = await User.findByIdAndUpdate(req.user._id, {
        $set :{
            password : req.body.password
        }
    }, { new: true })
    res.status(200).json({message : "Password Updated Successfully"})
})

const pinPost = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }
    if (user.pinsPosts.includes(req.params.id)) {
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { pinsPosts: req.params.id },
        });
        res.status(200).json({ message: 'Post unPin' })
    }
    else {
        await User.findByIdAndUpdate(req.user._id, {
            $push: { pinsPosts: req.params.id },
        });
        res.status(200).json({ message: 'Ponst Pin' })
    }
})

const blockOrUnblockUser = async (req, res) => {
  const currentUserId = req.user._id;
  const targetUserId = req.params.id;

  if (currentUserId === targetUserId) {
    return res.status(400).json({ message: "You can't block or unblock yourself." });
  }

  try {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "The target user does not exist." });
    }

    const isBlocked = currentUser.blockedUsers.includes(targetUserId);

    if (isBlocked) {
      // Unblock user
      currentUser.blockedUsers = currentUser.blockedUsers.filter(
        (id) => id.toString() !== targetUserId
      );
      await currentUser.save();
      return res.status(200).json({ message: "User has been unblocked." });
    } else {
      // Block user
      currentUser.blockedUsers.push(targetUserId);

      // Optional: Remove mutual follow if desired
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: targetUserId },
      });
      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: currentUserId, following: currentUserId },
      });

      await currentUser.save();
      return res.status(200).json({ message: "User has been blocked." });
    }
  } catch (err) {
    console.error("Block/Unblock Error:", err);
    return res.status(500).json({ message: "An error occurred.", error: err.message });
  }
};


const updateLinksSocial = asyncHandler(async (req, res) => {
  // ✅ Validate the input using Joi
  const { error } = validateUserLinks(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { socialLinks } = req.body;

  // ✅ Update only provided social links
  const fields = ['github', 'twitter', 'linkedin', 'facebook', 'website'];
  fields.forEach(field => {
    if (socialLinks[field] !== undefined) {
      user.socialLinks[field] = socialLinks[field];
    }
  });

  await user.save();

  res.status(200).json({
    message: "Social links updated successfully",
    socialLinks: user.socialLinks,
  });
});

const getSuggestedUsers = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  // جلب بيانات المستخدم الحالي
  const currentUser = await User.findById(currentUserId)
    .select('interests country following blockedUsers communities')
    .populate('communities', '_id') // لجلب المجتمعات
    .lean(); // لتحويل البيانات إلى JSON

  if (!currentUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  // استخراج المعرفات
  const followingIds = currentUser.following.map(id => id.toString());
  const blockedIds = currentUser.blockedUsers.map(id => id.toString());
  const communityIds = currentUser.communities.map(c => c._id.toString());

  // جلب كل المستخدمين باستثناء: المتابعين والمُحظورين والمستخدم الحالي
  const allUsers = await User.find({
    _id: {
      $ne: currentUserId, // غير المستخدم الحالي
      $nin: [...followingIds, ...blockedIds]  // غير المتابعين والمحظورين
    },
    accountStatus: 'active',
  })
    .select('_id username profilePhoto interests country communities')
    .populate('communities', '_id') // مجتمعاتهم
    .lean();

  // ترتيب المستخدمين بناء على النقاط
  const suggestions = allUsers.map(user => {
    let score = 0;

    // ✅ الاهتمامات المشتركة
    const sharedInterests = user.interests?.filter(interest => currentUser.interests.includes(interest)) || [];
    score += sharedInterests.length * 10;

    // ✅ نفس الدولة
    if (user.country === currentUser.country && user.country !== 'Unknown') {
      score += 15;
    }

    // ✅ المجتمعات المشتركة
    const userCommunities = user.communities.map(c => c._id.toString());
    const commonCommunities = userCommunities.filter(cid => communityIds.includes(cid));
    score += commonCommunities.length * 10;

    return { user, score };
  });

  // تصفية وترتيب النتائج النهائية
  const topSuggestions = suggestions
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10) // حد أقصى 10 مستخدمين

  res.status(200).json(topSuggestions.map(s => s.user));
});

const deleteAllUsers = asyncHandler(async (req, res) => {
    await User.deleteMany({});
    await Post.deleteMany({ })
    await Comment.deleteMany({ })
    await Story.deleteMany({ })
    await Report.deleteMany({ })
    await Community.deleteMany({ });
  res.status(200).json({ message: "All users deleted successfully" });
});

module.exports = { DeleteUser,deleteAllUsers, getSuggestedUsers, blockOrUnblockUser, makeUserAdmin, getAllUsers, getUserById, RegisterNewUser, LoginUser, verifyAccount, uploadPhoto, makeFollow, updatePassword, updateProfile, savePost, pinPost, updateLinksSocial }

