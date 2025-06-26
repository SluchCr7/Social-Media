const { User, LoginValidate, ValidateUser, validateUserUpdate, validatePasswordUpdate } = require('../Modules/User')
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
    const userExist = await User.findOne({ email: req.body.Email })
    if (userExist) return res.status(400).send("User already exists");
    
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
    })

    await user.save()
    // const VerificationToken = new Verification({
    //     userId: user._id,
    //     tokenVer: crypto.randomBytes(32).toString('hex'),
    // })
    // await VerificationToken.save()

    // const link = `${process.env.DOMAIN_NAME}/Auth/users/${user._id}/verify/${VerificationToken.tokenVer}`

    // const htmlTemp = `
    //     <h4>Dear ${user.Name}!</h4>

    //     <p>Thank you for signing up with Challenge Football!. Please verify your email address to complete your registration.</p>
        
    //     <p><a href="${link}">Verify Email</a></p>
        
    //     <p>If you did not sign up for this account, you can safely ignore this email.</p>
        
    //     <span>Best regards,</span>
        
    //     <span>The Challenge Football Team</span>
    // `
    // await sendEmail(user.Email , "Verify your Email" , htmlTemp)

    res.status(201).json({ message: "User Created Successfully and we sent an email now , go to verify your email" });
})

/**
 * @desc Login
 * @route GET /api/auth/login
 * @access Public
 */

const LoginUser = asyncHandler(async (req, res) => {
    const { error } = LoginValidate(req.body)
    if (error) {
        res.status(400).json({message : error.details[0].message})
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.status(400).json({message : "Email or Password are not Correct"})
    }
    const validPassword = await bcrypt.compare(req.body.password , user.password)
    if (!validPassword) {
        return res.status(400).send("Invalid email or password");
    }
    // if (!user.isVerify) {
    //     let verificationToken = await Verification.findOne({
    //         userId: user._id,
    //     })
    //     if (!verificationToken) {
    //         verificationToken = new Verification({
    //             userId: user._id,
    //             tokenVer: crypto.randomBytes(32).toString('hex'),
    //         })
    //         await verificationToken.save()
    //     }
    //     const link = `${process.env.DOMAIN_NAME}/Auth/users/${user._id}/verify/${verificationToken.tokenVer}`
    //     const htmlTemp = `
    //         <h4>Dear ${user.Name}!</h4>

    //         <p>Thank you for signing up with Challenge Football!. Please verify your email address to complete your registration.</p>
            
    //         <p><a href="${link}">Verify Email</a></p>
            
    //         <p>If you did not sign up for this account, you can safely ignore this email.</p>
            
    //         <span>Best regards,</span>
            
    //         <span>The Challenge Football Team</span>
    //     `
    //     await sendEmail(user.Email, 'Verify Email', htmlTemp)
    //     return res.status(400).json({ message: 'Email not verified' })
    // }
    const token = jwt.sign({ _id: user._id , isAdmain: user.isAdmin }, process.env.TOKEN_SECRET);
    const { Password, ...others } = user._doc
    res.send({ ...others, token });
})

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
        .populate("communities" , "Name Picture members")
        .populate({
            path: "pinsPosts",
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
      .populate('savedPosts');
  
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
    const user = await User.findById(req.params.id)
    if (!user) {
        return res.status(404).json({ message: "User Not Found" })
    }
    await User.findByIdAndDelete(req.params.id)
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
    const user = await User.findById(req.params.id)
    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }
    const verificationToken = await Verification.findOne({ userId: user._id , tokenVer: req.params.token })
    if (!verificationToken) {
        res.status(404)
        throw new Error('Verification token not found')
    }
    user.isVerify = true
    await user.save()
    await Verification.findByIdAndDelete(verificationToken._id)
    res.status(200).json({ message: 'Email verified' })
})


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
    const user = await User.findById(req.params.id)
    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }
    if (user.followers.includes(req.user._id)) {
        await User.findByIdAndUpdate(req.params.id, {
            $pull: { followers: req.user._id },
        });
        res.status(200).json({ message: 'Unfollowed' })
    }
    else {
        await User.findByIdAndUpdate(req.params.id, {
            $push: { followers: req.user._id },
        });
        res.status(200).json({ message: 'Followed' })
    }
})

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
    const {error} = validateUserUpdate(req.body)
    if (error) {
        res.status(400).json({message :error.details[0].message})
    }
    const Updateuser = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            username: req.body.username,
            description: req.body.description,
            profileName : req.body.profileName
        }
    }, { new: true })
    res.status(200).json(Updateuser)
})

const updatePassword = asyncHandler(async (req, res) => {
    const { error } = validatePasswordUpdate(req.body)
    if (error) {
        res.status(400).json({message :error.details[0].message})
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

module.exports = {DeleteUser ,makeUserAdmin , getAllUsers , getUserById , RegisterNewUser , LoginUser, verifyAccount, uploadPhoto , makeFollow , updatePassword , updateProfile , savePost , pinPost}