const bcrypt = require('bcrypt');
const Verification = require('../Modules/VerificationToken');
const {
  User,
  validateUserLinks,
  LoginValidate,
  ValidateUser,
  validateUserUpdate,
  validatePasswordUpdate,
} = require('../Modules/User');
const {
  REFRESH_TOKEN_MAX_AGE,
  REFRESH_TOKEN_ROTATION_GRACE_MS,
  hashToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/tokenUtils');
const { cloudUpload, cloudRemove } = require('../Config/cloudUpload');
const { checkImageSensitivity } = require('../utils/ImgShield');
const { sendNotificationHelper } = require('../utils/SendNotification');
const { Post } = require('../Modules/Post');
const { Comment } = require('../Modules/Comment');
const { Community } = require('../Modules/Community');
const { Report } = require('../Modules/Report');
const { Story } = require('../Modules/Story');
const { Music } = require('../Modules/Music');
const { userOnePopulate } = require('../Populates/Populate');
const { io } = require('../Config/socket');
const Reel = require('../Modules/Reel');
const { updateUserPoints } = require('../utils/PointsEngine');

const result = (status, body, options = {}) => ({ status, body, ...options });
const errorResult = (status, message, options = {}) => result(status, { message, ...options });
const publicUser = (user) => {
  const userObj = user.toObject ? user.toObject() : { ...user._doc };
  delete userObj.password;
  delete userObj.refreshTokens;
  delete userObj.consumedRefreshTokens;
  return userObj;
};

const register = async ({ body, userAgent, ip }) => {
  try {
    const { error } = ValidateUser(body);
    if (error) return result(400, { message: error.details[0].message });
    if (await User.findOne({ email: body.email })) {
      return result(400, { message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(body.password, salt);
    const user = new User({ username: body.username, email: body.email, password: hashPassword });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshTokens = [{
      tokenHash: hashToken(refreshToken),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
      userAgent: userAgent || '',
      ip: ip || '',
    }];
    await user.save();
    return result(201, {
      message: 'User registered successfully.',
      user: publicUser(user),
    }, { authCookies: { accessToken, refreshToken } });
  } catch (err) {
    return result(500, { message: err.message || 'Internal Server Error' });
  }
};

const login = async ({ body, userAgent, ip, forwardedFor, remoteAddress }) => {
  const { error } = LoginValidate(body);
  if (error) return result(400, { message: error.details[0].message });
  const user = await User.findOne({ email: body.email })
    .populate('following', 'username profileName profilePhoto')
    .populate('followers', 'username profileName profilePhoto');
  if (!user) return errorResult(400, 'Email or Password are not correct');
  if (!await bcrypt.compare(body.password, user.password)) {
    return errorResult(400, 'Email or Password are not correct');
  }
  if (user.accountStatus === 'banned') {
    return errorResult(403, 'Your account has been banned due to violations.');
  }
  if (user.accountStatus === 'suspended' && user.suspendedUntil && new Date(user.suspendedUntil) > new Date()) {
    return errorResult(403, `Your account is suspended until ${new Date(user.suspendedUntil).toLocaleString()}.`);
  }

  user.lastLogin = new Date();
  user.loginHistory.push({
    date: new Date(),
    ip: ip || forwardedFor || remoteAddress,
    device: userAgent,
  });
  if (user.loginHistory.length > 20) user.loginHistory = user.loginHistory.slice(-20);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const now = new Date();
  user.refreshTokens = (user.refreshTokens || []).filter((token) => token.expiresAt > now);
  user.refreshTokens.push({
    tokenHash: hashToken(refreshToken),
    createdAt: now,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
    userAgent: userAgent || '',
    ip: ip || forwardedFor || '',
  });
  if (user.refreshTokens.length > 10) user.refreshTokens = user.refreshTokens.slice(-10);
  await user.save();
  return result(200, { message: 'Login successful', user: publicUser(user) }, {
    authCookies: { accessToken, refreshToken },
  });
};

const logout = async ({ refreshToken }) => {
  if (refreshToken) {
    const hashed = hashToken(refreshToken);
    await User.updateOne(
      { 'refreshTokens.tokenHash': hashed },
      { $pull: { refreshTokens: { tokenHash: hashed } } }
    );
  }
  return result(200, { message: 'Logged out successfully' }, { clearAuthCookies: true });
};

const logoutAllSessions = async ({ userId }) => {
  if (userId) {
    await User.updateOne({ _id: userId }, { $set: { refreshTokens: [] } });
  }
  return result(200, { message: 'Logged out from all sessions successfully' }, { clearAuthCookies: true });
};

const refreshSession = async ({ refreshToken, userAgent, ip, forwardedFor }) => {
  if (!refreshToken) {
    return result(401, { message: 'No refresh token provided', code: 'NO_REFRESH_TOKEN' });
  }
  const { payload, expired } = verifyRefreshToken(refreshToken);
  if (expired || !payload) {
    return result(401, { message: 'Refresh token expired or invalid', code: 'REFRESH_TOKEN_EXPIRED' }, {
      clearAuthCookies: true,
    });
  }

  const incomingTokenHash = hashToken(refreshToken);
  const now = new Date();
  const matchedUser = await User.findOneAndUpdate(
    { _id: payload._id, 'refreshTokens.tokenHash': incomingTokenHash },
    {
      $pull: { refreshTokens: { tokenHash: incomingTokenHash } },
      $push: {
        consumedRefreshTokens: {
          $each: [{
            tokenHash: incomingTokenHash,
            family: payload.family || '',
            expiresAt: new Date(now.getTime() + REFRESH_TOKEN_ROTATION_GRACE_MS),
          }],
          $slice: -50,
        },
      },
    },
    { new: false }
  );
  if (!matchedUser) {
    const recentlyConsumed = await User.exists({
      _id: payload._id,
      consumedRefreshTokens: {
        $elemMatch: {
          tokenHash: incomingTokenHash,
          expiresAt: { $gt: now },
        },
      },
    });

    if (recentlyConsumed) {
      return result(409, {
        message: 'A refresh request for this session is already in progress.',
        code: 'REFRESH_ROTATION_IN_PROGRESS',
      });
    }

    if (payload.family) {
      await User.updateOne(
        { _id: payload._id },
        { $pull: { refreshTokens: { family: payload.family } } }
      );
    }
    return result(403, {
      message: 'Security warning: refresh token reuse detected or session terminated. Please sign in again.',
      code: 'TOKEN_REUSE_DETECTED',
    }, { clearAuthCookies: true });
  }
  if (matchedUser.accountStatus === 'banned') {
    return result(403, { message: 'Your account has been banned due to violations.' }, {
      clearAuthCookies: true,
    });
  }
  if (matchedUser.accountStatus === 'suspended' && matchedUser.suspendedUntil && new Date(matchedUser.suspendedUntil) > new Date()) {
    return result(403, {
      message: `Your account is suspended until ${new Date(matchedUser.suspendedUntil).toLocaleString()}.`,
    }, { clearAuthCookies: true });
  }

  const accessToken = generateAccessToken(matchedUser);
  const newRefreshToken = generateRefreshToken(matchedUser, payload.family);
  const newSessionRecord = {
    tokenHash: hashToken(newRefreshToken),
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
    userAgent: userAgent || '',
    ip: ip || forwardedFor || '',
    family: payload.family || '',
  };
  await User.updateOne(
    { _id: matchedUser._id },
    {
      $push: { refreshTokens: newSessionRecord },
      $pull: { refreshTokens: { expiresAt: { $lt: new Date() } } },
    }
  );
  return result(200, { message: 'Session refreshed successfully' }, {
    authCookies: { accessToken, refreshToken: newRefreshToken },
  });
};

const getCurrentUser = async ({ userId }) => {
  if (!userId) return errorResult(401, 'Unauthorized', { code: 'UNAUTHORIZED' });
  const user = await User.findById(userId).select('-password -refreshTokens').populate(userOnePopulate);
  if (!user) return errorResult(404, 'User not found', { clearAuthCookies: true });
  return result(200, { user: publicUser(user) });
};

const getAllUsers = async () => result(200, await User.find()
  .populate({ path: 'followers', select: 'profilePhoto username profileName' })
  .populate('posts')
  .populate('comments'));

const getUserById = async ({ id }) => {
  const user = await User.findById(id).populate(userOnePopulate);
  return user ? result(200, user) : errorResult(404, 'User Not Found');
};

const deleteUser = async ({ userId }) => {
  const user = await User.findById(userId);
  if (!user) return errorResult(404, 'User Not Found');
  await Post.deleteMany({ owner: userId });
  await Comment.deleteMany({ owner: userId });
  await Story.deleteMany({ owner: userId });
  await Report.deleteMany({ owner: userId });
  await Community.deleteMany({ owner: userId });
  await User.findByIdAndDelete(userId);
  return result(200, { message: 'User Deleted Successfully' });
};

const verifyAccount = async ({ id, token }) => {
  const user = await User.findById(id);
  if (!user) return errorResult(404, 'User not found');
  const verificationToken = await Verification.findOne({ userId: user._id, tokenVer: token });
  if (!verificationToken) return errorResult(404, 'Verification token not found or expired');
  user.isVerify = true;
  user.verifyAt = Date.now();
  await user.save();
  await Verification.findByIdAndDelete(verificationToken._id);
  return result(200, { message: 'Email verified successfully' });
};

const uploadImage = async ({ file, userId, customText, imageType }) => {
  if (!file) return errorResult(400, imageType === 'cover' ? 'No cover image uploaded' : 'No image uploaded');
  try {
    const upload = await cloudUpload(file);
    const user = await User.findById(userId);
    if (!user) return errorResult(404, 'User not found');
    const photoKey = imageType === 'cover' ? 'coverPhoto' : 'profilePhoto';
    const oldPhoto = user[photoKey];
    if (oldPhoto?.publicId) await cloudRemove(oldPhoto.publicId);
    const isSensitive = await checkImageSensitivity(upload.secure_url);
    user[photoKey] = { url: upload.secure_url, publicId: upload.public_id, isSensitive };
    await user.save();
    const postText = `🖼 ${user.username} has updated their ${imageType === 'cover' ? 'cover' : 'profile'} photo. ${customText || ''}`;
    const post = new Post({
      text: postText,
      owner: userId,
      Photos: [{ url: user[photoKey].url, publicId: user[photoKey].publicId, isSensitive }],
      media: [{ type: 'image', url: user[photoKey].url, publicId: user[photoKey].publicId, isSensitive }],
      privacy: 'public',
    });
    await post.save();
    await post.save();
    io.emit('user:update', user);
    return result(200, {
      message: imageType === 'cover' ? 'Cover photo updated' : 'Profile photo updated',
      [photoKey]: user[photoKey],
    });
  } catch (err) {
    console.error('Cloud upload failed:', err);
    return errorResult(500, imageType === 'cover' ? 'Error uploading cover photo' : 'Error uploading image');
  }
};

const makeFollow = async ({ targetUserId, userId }) => {
  const user = await User.findById(targetUserId).select('username profilePhoto BlockedNotificationFromUsers followers');
  const currentUser = await User.findById(userId).select('username profilePhoto following');
  if (!user) return errorResult(404, 'User not found');
  const isFollowing = user.followers.includes(userId);
  const action = isFollowing ? 'unfollow' : 'follow';
  if (isFollowing) {
    await User.findByIdAndUpdate(user._id, { $pull: { followers: userId } });
    await User.findByIdAndUpdate(currentUser._id, { $pull: { following: user._id } });
    await updateUserPoints(userId, 'UNFOLLOW_USER', user._id);
  } else {
    await User.findByIdAndUpdate(user._id, { $push: { followers: userId } });
    await User.findByIdAndUpdate(currentUser._id, { $push: { following: user._id } });
    if (!user._id.equals(currentUser._id)) {
      const isBlocked = user.BlockedNotificationFromUsers?.some((blockedId) => blockedId.equals(currentUser._id));
      if (!isBlocked) {
        await sendNotificationHelper({
          sender: currentUser._id,
          receiver: user._id,
          content: `${currentUser.username} started following you 👥`,
          type: 'follow',
          actionRef: currentUser._id,
          actionModel: 'User',
        });
      }
    }
    await updateUserPoints(userId, 'FOLLOW_USER', user._id);
  }
  const updatedCurrentUser = await User.findById(userId).populate(userOnePopulate);
  const updatedTargetUser = await User.findById(targetUserId).populate(userOnePopulate);
  return result(200, {
    success: true,
    message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
    action,
    user: updatedCurrentUser,
    targetUser: updatedTargetUser,
    isFollowing: !isFollowing,
  });
};

const updateProfile = async ({ userId, body }) => {
  const { error } = validateUserUpdate(body);
  if (error) return errorResult(400, error.details[0].message);
  const {
    username, description, profileName, country, city, phone, socialLinks, gender,
    dateOfBirth, relationshipStatus, partner, interests, preferedLanguage,
  } = body;
  if (partner) {
    const partnerUser = await User.findById(partner);
    if (!partnerUser) return errorResult(400, 'Partner user not found');
    if (partnerUser.partner && partnerUser.partner.toString() !== userId.toString()) {
      return errorResult(400, 'This user is already in a relationship with someone else.');
    }
    if (['In a Relationship', 'Married'].includes(relationshipStatus)) {
      await User.findByIdAndUpdate(partner, { relationshipStatus, partner: userId });
    }
  }
  const updateData = {
    username, description, profileName, country, city, phone, socialLinks, gender,
    dateOfBirth, relationshipStatus, partner: partner || null, interests, preferedLanguage,
  };
  const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).populate(userOnePopulate);
  if (!updatedUser) return errorResult(404, 'User not found');
  io.emit('user:update', updatedUser);
  const fullUserCheck = await User.findById(userId).select('pointsHistory profilePhoto description');
  const hasAward = fullUserCheck.pointsHistory.some((entry) => entry.action === 'PROFILE_COMPLETION');
  if (!hasAward && fullUserCheck.profilePhoto && fullUserCheck.description) {
    await updateUserPoints(userId, 'PROFILE_COMPLETION', userId);
  }
  return result(200, { message: 'Profile updated successfully', user: updatedUser });
};

const updatePassword = async ({ userId, body }) => {
  const { error } = validatePasswordUpdate(body);
  if (error) return errorResult(400, error.details[0].message);
  const user = await User.findById(userId);
  if (!user) return errorResult(404, 'User not found');
  if (!await bcrypt.compare(body.oldPassword, user.password)) return errorResult(400, 'Old password is incorrect');
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(body.newPassword, salt);
  await user.save();
  return result(200, { message: 'Password Updated Successfully' });
};

const pinPost = async ({ userId, postId }) => {
  const user = await User.findById(userId);
  if (!user) return errorResult(404, 'User not found');
  const pinned = user.pinsPosts.includes(postId);
  await User.findByIdAndUpdate(userId, pinned
    ? { $pull: { pinsPosts: postId } }
    : { $push: { pinsPosts: postId } });
  const updatedUser = await User.findById(userId).select('pinsPosts');
  return result(200, { message: pinned ? 'Post unPinned' : 'Post Pinned', pinsPosts: updatedUser.pinsPosts });
};

const blockOrUnblockUser = async ({ userId, targetUserId }) => {
  if (userId.toString() === targetUserId.toString()) {
    return errorResult(400, "You can't block or unblock yourself.");
  }
  const currentUser = await User.findById(userId);
  const targetUser = await User.findById(targetUserId);
  if (!targetUser) return errorResult(404, 'The target user does not exist.');
  const isBlocked = currentUser.blockedUsers.includes(targetUserId);
  let message;
  if (isBlocked) {
    currentUser.blockedUsers = currentUser.blockedUsers.filter((id) => id.toString() !== targetUserId);
    await currentUser.save();
    message = 'User has been unblocked.';
  } else {
    currentUser.blockedUsers.push(targetUserId);
    await User.findByIdAndUpdate(userId, { $pull: { following: targetUserId } });
    await User.findByIdAndUpdate(targetUserId, { $pull: { followers: userId, following: userId } });
    await currentUser.save();
    message = 'User has been blocked.';
  }
  const updatedUser = await User.findById(userId).select('blockedUsers following');
  return result(200, { message, blockedUsers: updatedUser.blockedUsers, following: updatedUser.following });
};

const updateLinksSocial = async ({ userId, body }) => {
  const { error } = validateUserLinks(body);
  if (error) return errorResult(400, error.details[0].message);
  const user = await User.findById(userId);
  if (!user) return errorResult(404, 'User not found');
  const fields = ['github', 'twitter', 'linkedin', 'facebook', 'website'];
  fields.forEach((field) => {
    if (body.socialLinks[field] !== undefined) user.socialLinks[field] = body.socialLinks[field];
  });
  await user.save();
  return result(200, { message: 'Social links updated successfully', socialLinks: user.socialLinks });
};

const getSuggestedUsers = async ({ userId }) => {
  const currentUser = await User.findById(userId)
    .select('interests country following blockedUsers joinedCommunities lastActiveAt')
    .populate('joinedCommunities', '_id')
    .lean();
  if (!currentUser) return errorResult(404, 'User not found');
  const followingIds = (currentUser.following || []).map((item) =>
    typeof item === 'object' && item !== null ? item._id.toString() : item.toString());
  const blockedIds = (currentUser.blockedUsers || []).map((item) =>
    typeof item === 'object' && item !== null ? item._id.toString() : item.toString());
  const communityIds = (currentUser.joinedCommunities || []).map((item) => item._id.toString());
  const candidates = await User.find({
    _id: { $nin: [userId, ...followingIds, ...blockedIds] },
    accountStatus: 'active',
    isPrivate: false,
    acceptedTerms: true,
  }).select('_id username profilePhoto interests country joinedCommunities lastActiveAt')
    .populate('joinedCommunities', '_id').lean();
  const now = new Date();
  const suggestions = candidates.map((user) => {
    let score = 0;
    score += (user.interests || []).filter((interest) => (currentUser.interests || []).includes(interest)).length * 10;
    if (user.country === currentUser.country && user.country !== 'Unknown') score += 15;
    const userCommunities = (user.joinedCommunities || []).map((item) => item._id.toString());
    score += userCommunities.filter((id) => communityIds.includes(id)).length * 8;
    if (user.lastActiveAt && now - new Date(user.lastActiveAt) < 7 * 24 * 60 * 60 * 1000) score += 20;
    return { user, score };
  });
  return result(200, suggestions.filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score).slice(0, 10).map((item) => item.user));
};

const makeAccountPremiumVerify = async ({ userId }) => {
  if (!await User.findById(userId)) return errorResult(400, 'This User not be found');
  await User.findByIdAndUpdate(userId, { $set: { isAccountWithPremiumVerify: true } }, { new: true });
  return result(200, { message: 'Account Become Verify ' });
};

const togglePrivateAccount = async ({ userId }) => {
  try {
    const user = await User.findById(userId);
    if (!user) return errorResult(404, 'User not found');
    user.isPrivate = !user.isPrivate;
    await user.save();
    return result(200, { message: `Account is now ${user.isPrivate ? 'private' : 'public'}`, isPrivate: user.isPrivate });
  } catch (err) {
    console.error(err);
    return errorResult(500, 'Server error');
  }
};

const makeUserAdmin = async ({ userId }) => {
  const user = await User.findById(userId);
  if (!user) return errorResult(404, 'User not found');
  if (user.isAdmin) return errorResult(400, 'User is already an admin');
  user.isAdmin = true;
  await user.save();
  return result(200, {
    message: `${user.username} is now an Admin`,
    user: { _id: user._id, username: user.username, isAdmin: user.isAdmin },
  });
};

const updateAccountStatus = async ({ userId, body }) => {
  try {
    const { accountStatus, days } = body;
    if (!['active', 'banned', 'suspended'].includes(accountStatus)) return errorResult(400, 'Invalid account status value');
    const updateFields = { accountStatus };
    if (accountStatus === 'suspended') {
      if (!days || days <= 0) return errorResult(400, 'Suspension days must be greater than 0');
      const suspendedUntil = new Date();
      suspendedUntil.setDate(suspendedUntil.getDate() + days);
      updateFields.suspendedUntil = suspendedUntil;
    } else {
      updateFields.suspendedUntil = null;
    }
    const user = await User.findByIdAndUpdate(userId, updateFields, { new: true });
    if (!user) return errorResult(404, 'User not found');
    return result(200, {
      message: accountStatus === 'suspended' ? `User suspended for ${days} days` : `User status updated to ${accountStatus}`,
      user,
    });
  } catch (error) {
    console.error(error);
    return result(500, { message: 'Error updating account status', error });
  }
};

const getRelationship = async ({ userId }) => {
  const user = await User.findById(userId).populate('partner', 'username profilePhoto');
  if (!user) return errorResult(404, 'User not found');
  return result(200, {
    relationshipStatus: user.relationshipStatus,
    partner: user.partner ? { _id: user.partner._id, username: user.partner.username, profilePhoto: user.partner.profilePhoto } : null,
  });
};

const updateRelationship = async ({ userId, currentUserId, body }) => {
  const { relationshipStatus, partnerId } = body;
  if (currentUserId.toString() !== userId) return errorResult(403, 'You can only update your own relationship info');
  const user = await User.findById(userId);
  if (!user) return errorResult(404, 'User not found');
  const allowedStatuses = ['Single', 'In a Relationship', 'Married', "It's Complicated"];
  if (!allowedStatuses.includes(relationshipStatus)) return errorResult(400, 'Invalid relationship status');
  user.relationshipStatus = relationshipStatus;
  if (['In a Relationship', 'Married'].includes(relationshipStatus) && partnerId) {
    const partnerUser = await User.findById(partnerId);
    if (!partnerUser) return errorResult(404, 'Partner user not found');
    if (partnerUser.partner && partnerUser.partner.toString() !== userId) {
      return errorResult(400, 'This user is already in a relationship with someone else');
    }
    user.partner = partnerId;
    partnerUser.relationshipStatus = relationshipStatus;
    partnerUser.partner = userId;
    await partnerUser.save();
  } else {
    user.partner = null;
  }
  await user.save();
  const updatedUser = await User.findById(userId).populate('partner', 'username profilePhoto');
  return result(200, {
    message: 'Relationship info updated successfully',
    relationshipStatus: updatedUser.relationshipStatus,
    partner: updatedUser.partner ? { _id: updatedUser.partner._id, username: updatedUser.partner.username, profilePhoto: updatedUser.partner.profilePhoto } : null,
  });
};

const deleteAllUsers = async () => {
  await User.deleteMany({});
  await Post.deleteMany({});
  await Comment.deleteMany({});
  await Story.deleteMany({});
  await Report.deleteMany({});
  await Community.deleteMany({});
  return result(200, { message: 'All users deleted successfully' });
};

const toggleSongInPlaylist = async ({ userId, songId }) => {
  const user = await User.findById(userId);
  if (!user) return errorResult(404, 'User not found');
  if (!await Music.findById(songId)) return errorResult(404, 'Song not found');
  const exists = user.myMusicPlaylist.includes(songId);
  user.myMusicPlaylist = exists
    ? user.myMusicPlaylist.filter((id) => id.toString() !== songId)
    : [...user.myMusicPlaylist, songId];
  await user.save();
  return result(200, {
    message: exists ? 'Song removed from playlist' : 'Song added to playlist',
    playlist: user.myMusicPlaylist,
  });
};

const acceptCookies = async ({ userId }) => {
  const user = await User.findById(userId);
  if (!user) return errorResult(404, 'User not found');
  user.acceptedCookies = true;
  await user.save();
};

const toggleBlockNotification = async ({ userId, targetUserId }) => {
  try {
    if (targetUserId === String(userId)) return errorResult(400, 'You cannot block or unblock yourself');
    const currentUser = await User.findById(userId);
    if (!currentUser) return errorResult(404, 'Current user not found');
    const isBlocked = currentUser.BlockedNotificationFromUsers.includes(targetUserId)
      || currentUser.BlockedNotificationFromUsers.some((id) => id.toString() === targetUserId);
    if (isBlocked) {
      currentUser.BlockedNotificationFromUsers = currentUser.BlockedNotificationFromUsers
        .filter((id) => id.toString() !== targetUserId);
    } else {
      currentUser.BlockedNotificationFromUsers.push(targetUserId);
    }
    await currentUser.save();
    return result(200, {
      success: true,
      message: isBlocked ? 'Message notifications unblocked successfully.' : 'Message notifications blocked successfully.',
      blockedUsers: currentUser.BlockedNotificationFromUsers,
    });
  } catch (error) {
    console.error('Error toggling block notifications:', error);
    return result(500, { success: false, message: 'Failed to toggle block notifications' });
  }
};

const saveReel = async ({ userId, reelId }) => {
  const user = await User.findById(userId);
  if (!user) return errorResult(404, 'User not found');
  if (!await Reel.findById(reelId)) return errorResult(404, 'Reel not found');
  const exists = user.savedReels.includes(reelId);
  user.savedReels = exists
    ? user.savedReels.filter((id) => id.toString() !== reelId)
    : [...user.savedReels, reelId];
  await user.save();
  return result(200, {
    message: exists ? 'Reel removed from playlist' : 'Reel added to playlist',
    playlist: user.myMusicPlaylist,
  });
};

const getUserPoints = async ({ id }) => {
  const user = await User.findById(id).select('level userLevelRank userLevelPoints nextLevelPoints');
  if (!user) return errorResult(404, 'User not found');
  const minimumPoints = { 1: 0, 2: 100, 3: 250, 4: 500, 5: 1000 };
  const currentMin = minimumPoints[user.level] || 1000;
  const nextMin = minimumPoints[user.level + 1] || 100000;
  const progress = user.level >= 5 ? 100 : Math.round(((user.userLevelPoints - currentMin) / (nextMin - currentMin)) * 100);
  return result(200, {
    level: user.level,
    points: user.userLevelPoints,
    rank: user.userLevelRank,
    progress: Math.max(0, Math.min(100, progress)),
  });
};

const getUserPointsHistory = async ({ id }) => {
  const user = await User.findById(id).select('pointsHistory');
  if (!user) return errorResult(404, 'User not found');
  return result(200, user.pointsHistory.reverse());
};

module.exports = {
  register, login, logout, logoutAllSessions, refreshSession, getCurrentUser,
  getAllUsers, getUserById, deleteUser, verifyAccount, uploadImage, makeFollow,
  updateProfile, updatePassword, pinPost, blockOrUnblockUser, updateLinksSocial,
  getSuggestedUsers, makeAccountPremiumVerify, togglePrivateAccount, makeUserAdmin,
  updateAccountStatus, getRelationship, updateRelationship, deleteAllUsers,
  toggleSongInPlaylist, acceptCookies, toggleBlockNotification, saveReel,
  getUserPoints, getUserPointsHistory,
};
