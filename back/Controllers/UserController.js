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
const { v2 } = require('cloudinary')
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const { sendNotificationHelper } = require("../utils/SendNotification");
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

const RegisterNewUser = async (req, res) => {
  try {
    // ✅ Validate user input
    const { error } = ValidateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // ✅ Check if user exists
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // ✅ Create user
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });

    await user.save();

    // ✅ Create verification token
    // const VerificationToken = new Verification({
    //   userId: user._id,
    //   tokenVer: crypto.randomBytes(32).toString("hex"),
    // });
    // await VerificationToken.save();

    // // ✅ Prepare verification link
    // const link = `${process.env.DOMAIN_NAME}/Pages/UserVerify/${user._id}/verify/${VerificationToken.tokenVer}`;

    // const htmlTemp = `
    //   <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 40px;">
    //     <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    //       <tr>
    //         <td style="padding: 30px;">
    //           <h2 style="color: #333333;">Welcome to Sluchitt, ${user.username}!</h2>
    //           <p style="font-size: 16px; color: #555555; line-height: 1.6;">
    //             Thank you for signing up. To complete your registration, please verify your email address by clicking the button below.
    //           </p>
    //           <div style="text-align: center; margin: 30px 0;">
    //             <a href="${link}" style="background-color: #28a745; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
    //               Verify My Email
    //             </a>
    //           </div>
    //           <p style="font-size: 14px; color: #999999;">
    //             If you didn’t sign up for this account, feel free to ignore this email. Your information will remain secure.
    //           </p>
    //           <p style="font-size: 14px; margin-top: 30px; color: #555555;">
    //             Best regards,<br />
    //             <strong>Sluchitt Team</strong>
    //           </p>
    //         </td>
    //       </tr>
    //       <tr>
    //         <td style="padding: 20px; text-align: center; font-size: 12px; color: #aaaaaa;">
    //           &copy; ${new Date().getFullYear()} Sluchitt. All rights reserved.
    //         </td>
    //       </tr>
    //     </table>
    //   </div>
    // `;

    // // ✅ Send verification email
    // await sendEmail(user.email, "Verify your Email", htmlTemp);

    return res.status(201).json({
      message:
        "User Created Successfully and we sent an email now, go to verify your email",
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};


const LoginUser = asyncHandler(async (req, res) => {
  const { error } = LoginValidate(req.body);
  if (error) {
      return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findOne({ email: req.body.email })
    .populate("following", "username profileName profilePhoto")
    .populate("followers", "username profileName profilePhoto");
  if (!user) {
      return res.status(400).json({ message: "Email or Password are not correct" });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
      return res.status(400).json({ message: "Email or Password are not correct" });
  }

  // // Check email verification
  // if (!user.isVerify) {
  //     let verificationToken = await Verification.findOne({ userId: user._id });
  //     if (!verificationToken) {
  //         verificationToken = new Verification({
  //             userId: user._id,
  //             tokenVer: crypto.randomBytes(32).toString('hex'),
  //         });
  //         await verificationToken.save();
  //     }

  //     const link = `${process.env.DOMAIN_NAME}/Pages/UserVerify/${user._id}/verify/${verificationToken.tokenVer}`;
  //     const htmlTemp = `
  //     <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 40px;">
  //       <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
  //         <tr>
  //           <td style="padding: 30px;">
  //             <h2 style="color: #333333;">Welcome to Sluchitt, ${user.username}!</h2>
  //             <p style="font-size: 16px; color: #555555; line-height: 1.6;">
  //               Thank you for signing up. To complete your registration, please verify your email address by clicking the button below.
  //             </p>
    
  //             <div style="text-align: center; margin: 30px 0;">
  //               <a href="${link}" style="background-color: #28a745; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
  //                 Verify My Email
  //               </a>
  //             </div>
    
  //             <p style="font-size: 14px; color: #999999;">
  //               If you didn’t sign up for this account, feel free to ignore this email. Your information will remain secure.
  //             </p>
    
  //             <p style="font-size: 14px; margin-top: 30px; color: #555555;">
  //               Best regards,<br />
  //               <strong>Sluchitt Team</strong>
  //             </p>
  //           </td>
  //         </tr>
    
  //         <tr>
  //           <td style="padding: 20px; text-align: center; font-size: 12px; color: #aaaaaa;">
  //             &copy; ${new Date().getFullYear()} Slucitt. All rights reserved.
  //           </td>
  //         </tr>
  //       </table>
  //     </div>
  //   `;
  //     await sendEmail(user.email, 'Verify Email', htmlTemp);

  //     return res.status(401).json({
  //         message: "Your email is not verified. A new verification email has been sent.",
  //         emailSent: true
  //     });
  // }

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
      .populate({
        path: 'reels',
        populate: {
          path: 'owner',
          model: 'User',
          select: 'username profilePhoto profileName', // Optional: limit fields
        },
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
          path: "notifications",
          populate: {
            path: "sender",
            select: "username profilePhoto", // عشان تجيب بيانات المرسل كمان
          },
          options: { sort: { createdAt: -1 } },
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
        path: "following",
        select: "profilePhoto username profileName",
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
    .populate({
        path: 'reels',
        populate: {
          path: 'owner',
          model: 'User',
          select: 'username profilePhoto profileName', // Optional: limit fields
        },
      })
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
  if (!req.file) return res.status(400).json({ message: "No image uploaded" });

  try {
    // رفع الصورة للسحابة
    const result = await cloudUpload(req.file);

    // جلب المستخدم
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // إزالة الصورة القديمة إذا موجودة
    if (user.profilePhoto?.publicId) {
      await cloudRemove(user.profilePhoto.publicId);
    }

    // تحديث صورة البروفايل
    user.profilePhoto = {
      url: result.secure_url,
      publicId: result.public_id,
    };
    await user.save();

    // إنشاء بوست تلقائي لتغيير الصورة
    const postText = `🖼 ${user.username} has updated their profile photo. ${req.body.customText || ''}`;

    const ImageChangePost = new Post({
      text: postText,
      owner: req.user._id,
      Photos: [user.profilePhoto.url], // حطيناها كمصفوفة
      privacy: 'public',
    });

    await ImageChangePost.save();

    res.status(200).json({ message: "Profile photo updated", profilePhoto: user.profilePhoto });
  } catch (err) {
    console.error("Cloud upload failed:", err);
    res.status(500).json({ message: "Error uploading image" });
  }
});


const makeFollow = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id); // الشخص اللي هيتعمله follow
  const currentUser = await User.findById(req.user._id); // المستخدم الحالي

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.followers.includes(req.user._id)) {
    // 🔴 Unfollow
    await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.user._id },
    });
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: req.params.id },
    });

    return res.status(200).json({
      message: "Unfollowed",
      user,
    });
  } else {
    // 🟢 Follow
    await User.findByIdAndUpdate(req.params.id, {
      $push: { followers: req.user._id },
    });
    await User.findByIdAndUpdate(req.user._id, {
      $push: { following: req.params.id },
    });

    // ✅ إرسال Notification لصاحب الحساب
    if (user._id.toString() !== currentUser._id.toString()) {
      await sendNotificationHelper({
        sender: currentUser._id,
        receiver: user._id,
        content: "started following you",
        type: "follow",
        actionRef: currentUser._id, // ممكن نخلي المرجع هو المستخدم نفسه
        actionModel: "User",
      });
    }

    return res.status(200).json({
      message: "Followed",
      user,
    });
  }
});

const updateProfile = asyncHandler(async (req, res) => {
  const { error } = validateUserUpdate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const currentUserId = req.user._id;
  const {
    username,
    description,
    profileName,
    country,
    city,
    phone,
    socialLinks,
    gender,
    dateOfBirth,
    relationshipStatus,
    partner,
    interests,
  } = req.body;

  // تحقق من وجود الشريك إذا تم إدخاله
  if (partner) {
    const partnerUser = await User.findById(partner);

    if (!partnerUser) {
      return res.status(400).json({ message: "Partner user not found" });
    }

    // تحقق أنه غير مرتبط بشخص آخر
    if (
      partnerUser.partner &&
      partnerUser.partner.toString() !== currentUserId.toString()
    ) {
      return res
        .status(400)
        .json({ message: "This user is already in a relationship with someone else." });
    }

    // إذا الحالة "In a Relationship" نربط الطرفين
    if (relationshipStatus === "In a Relationship") {
      await User.findByIdAndUpdate(partner, {
        relationshipStatus: "In a Relationship",
        partner: currentUserId,
      });
    }
  }

  // البيانات التي سيتم تحديثها
  const updateData = {
    username,
    description,
    profileName,
    country,
    phone,
    socialLinks,
    gender,
    dateOfBirth,
    relationshipStatus,
    partner: partner || null,
    interests,
    city
  };

  // تحديث المستخدم
  const updatedUser = await User.findByIdAndUpdate(
    currentUserId,
    { $set: updateData },
    { new: true }
  );

  res.status(200).json({
    message: "Profile updated successfully",
    user: updatedUser,
  });
});

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
    return res.status(200).json({
        message: `Password Updated Successfully`,
        updateUserPass,
    })
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
        res.status(200).json({ message: 'Post Pin' })
    }
})

const blockOrUnblockUser = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;
  const targetUserId = req.params.id;

  if (currentUserId.toString() === targetUserId.toString()) {
    return res.status(400).json({ message: "You can't block or unblock yourself." });
  }

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    res.status(404);
    throw new Error("The target user does not exist.");
  }

  const isBlocked = currentUser.blockedUsers.includes(targetUserId);

  if (isBlocked) {
    // 🔓 Unblock user
    currentUser.blockedUsers = currentUser.blockedUsers.filter(
      (id) => id.toString() !== targetUserId
    );
    await currentUser.save();

    return res.status(200).json({ message: "User has been unblocked." });
  } else {
    // 🔒 Block user
    currentUser.blockedUsers.push(targetUserId);

    // إزالة المتابعة المتبادلة
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUserId, following: currentUserId },
    });

    await currentUser.save();

    return res.status(200).json({ message: "User has been blocked." });
  }
});


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

  const currentUser = await User.findById(currentUserId)
    .select('interests country following blockedUsers communities lastActiveAt')
    .populate('communities', '_id')
    .lean();

  if (!currentUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  const followingIds = currentUser.following.map(id => id.toString());
  const blockedIds = currentUser.blockedUsers.map(id => id.toString());
  const communityIds = currentUser.communities.map(c => c._id.toString());

  // المرشحين الأساسيين
  const candidates = await User.find({
    _id: { $ne: currentUserId, $nin: [...followingIds, ...blockedIds] },
    accountStatus: 'active',
    isPrivate: false,
    acceptedTerms: true,
  })
    .select('_id username profilePhoto interests country communities lastActiveAt')
    .populate('communities', '_id')
    .lean();

  const now = new Date();

  const suggestions = candidates.map(user => {
    let score = 0;

    // ✅ الاهتمامات المشتركة
    const sharedInterests = user.interests?.filter(interest =>
      currentUser.interests.includes(interest)
    ) || [];
    score += sharedInterests.length * 10;

    // ✅ نفس الدولة
    if (user.country === currentUser.country && user.country !== 'Unknown') {
      score += 15;
    }

    // ✅ المجتمعات المشتركة
    const userCommunities = user.communities.map(c => c._id.toString());
    const commonCommunities = userCommunities.filter(cid =>
      communityIds.includes(cid)
    );
    score += commonCommunities.length * 8;

    // ✅ النشاط الأخير (آخر 7 أيام)
    if (
      user.lastActiveAt &&
      now - new Date(user.lastActiveAt) < 7 * 24 * 60 * 60 * 1000
    ) {
      score += 20;
    }

    return { user, score };
  });

  const topSuggestions = suggestions
    .filter(s => s.score > 0) // بس اللي عندهم صلة
    .sort((a, b) => b.score - a.score) // ترتيب تنازلي
    .slice(0, 10); // أفضل 10 فقط

  res.status(200).json(topSuggestions.map(s => s.user));
});


const MakeAccountPreimumVerify = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user) {
    return res.status(400).json({ message: "This User not be found" });
  }
  await User.findByIdAndUpdate(req.user._id, {
      $set :{
          isAccountWithPremiumVerify : true
      }
  }, { new: true })
  return res.status(200).json({
      message: "Account Become Verify "
  })
})

const togglePrivateAccount = async (req, res) => {
    try {
        const userId = req.user._id; // نفترض أنك تستخدم auth middleware لتخزين user
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        // عكس القيمة الحالية
        user.isPrivate = !user.isPrivate;
        await user.save();

        return res.status(200).json({
            message: `Account is now ${user.isPrivate ? 'private' : 'public'}`,
            isPrivate: user.isPrivate
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};


// @desc    Make a user an Admin
// @route   PUT /api/admin/users/:id/make-admin
// @access  Admin only
const makeUserAdmin = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // العثور على المستخدم
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // تحقق إذا كان المستخدم بالفعل Admin
  if (user.isAdmin) {
    return res.status(400).json({ message: 'User is already an admin' });
  }

  // تحديث الصلاحية
  user.isAdmin = true;
  await user.save();

  res.status(200).json({
    message: `${user.username} is now an Admin`,
    user: {
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
    },
  });
});

// تحديث الحالة
const updateAccountStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { accountStatus, days } = req.body;

    if (!["active", "banned", "suspended"].includes(accountStatus)) {
      return res.status(400).json({ message: "Invalid account status value" });
    }

    let updateFields = { accountStatus };

    // لو Suspended خلي فيه مدة
    if (accountStatus === "suspended") {
      if (!days || days <= 0) {
        return res.status(400).json({ message: "Suspension days must be greater than 0" });
      }
      const suspendedUntil = new Date();
      suspendedUntil.setDate(suspendedUntil.getDate() + days);
      updateFields.suspendedUntil = suspendedUntil;
    } else {
      // لو رجع Active أو Banned شيل التاريخ القديم
      updateFields.suspendedUntil = null;
    }

    const user = await User.findByIdAndUpdate(userId, updateFields, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message:
        accountStatus === "suspended"
          ? `User suspended for ${days} days`
          : `User status updated to ${accountStatus}`,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating account status", error });
  }
};

/**
 * @desc Get relationship info of a user
 * @route GET /api/auth/relationship/:userId
 * @access Private
 */
const getRelationship = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId).populate('partner', 'username profilePhoto');
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    relationshipStatus: user.relationshipStatus,
    partner: user.partner ? { _id: user.partner._id, username: user.partner.username, profilePhoto: user.partner.profilePhoto } : null,
  });
});

/**
 * @desc Update relationship info of the current user
 * @route PUT /api/auth/relationship/:userId
 * @access Private
 */
const updateRelationship = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const { relationshipStatus, partnerId } = req.body;

  // تحقق من صلاحية المستخدم (يمكنك تعديلها حسب auth middleware)
  if (req.user._id.toString() !== userId) {
    return res.status(403).json({ message: "You can only update your own relationship info" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // التحقق من القيم المسموح بها
  const allowedStatuses = ['Single', 'In a Relationship', 'Married', "It's Complicated"];
  if (!allowedStatuses.includes(relationshipStatus)) {
    return res.status(400).json({ message: "Invalid relationship status" });
  }

  user.relationshipStatus = relationshipStatus;

  // تحديث الشريك فقط إذا الحالة تسمح
  if (['In a Relationship', 'Married'].includes(relationshipStatus)) {
    if (partnerId) {
      const partnerUser = await User.findById(partnerId);
      if (!partnerUser) {
        return res.status(404).json({ message: "Partner user not found" });
      }

      // تحقق أنه غير مرتبط بشخص آخر أو مرتبط بك
      if (partnerUser.partner && partnerUser.partner.toString() !== userId) {
        return res.status(400).json({ message: "This user is already in a relationship with someone else" });
      }

      user.partner = partnerId;

      // تحديث الشريك ليربطه بك أيضًا
      partnerUser.relationshipStatus = relationshipStatus;
      partnerUser.partner = userId;
      await partnerUser.save();
    } else {
      user.partner = null;
    }
  } else {
    user.partner = null;
  }

  await user.save();

  const updatedUser = await User.findById(userId).populate('partner', 'username profilePhoto');

  res.status(200).json({
    message: "Relationship info updated successfully",
    relationshipStatus: updatedUser.relationshipStatus,
    partner: updatedUser.partner ? { _id: updatedUser.partner._id, username: updatedUser.partner.username, profilePhoto: updatedUser.partner.profilePhoto } : null,
  });
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

module.exports = {
  updateAccountStatus,
  makeUserAdmin,
  MakeAccountPreimumVerify,
  togglePrivateAccount, DeleteUser,
  deleteAllUsers, getSuggestedUsers,
  blockOrUnblockUser, getAllUsers, getUserById,
  RegisterNewUser, LoginUser, verifyAccount,
  uploadPhoto, makeFollow, updatePassword,
  updateProfile, pinPost, updateLinksSocial,
  getRelationship,
  updateRelationship
}

