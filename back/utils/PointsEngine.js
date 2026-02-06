const { User } = require('../Modules/User');
const { getReceiverSocketId, io } = require('../Config/socket');

const POINTS_CONFIG = {
    CREATE_POST: 10,
    DELETE_POST: -10,
    LIKE_POST: 2,
    REMOVE_LIKE: -2,
    COMMENT: 5,
    DELETE_COMMENT: -5,
    SHARE_POST: 7,
    FOLLOW_USER: 3,
    UNFOLLOW_USER: -3,
    PROFILE_COMPLETION: 20,
};

const calculateLevel = (points) => {
    if (points >= 1000) return 5;
    if (points >= 500) return 4;
    if (points >= 250) return 3;
    if (points >= 100) return 2;
    return 1;
};

const getLevelProgress = (points, level) => {
    let min, max;
    if (level === 1) { min = 0; max = 99; }
    else if (level === 2) { min = 100; max = 249; }
    else if (level === 3) { min = 250; max = 499; }
    else if (level === 4) { min = 500; max = 999; }
    else { min = 1000; max = 20000; } // Level 5 cap for progress calculation

    // Progress percentage
    const progress = Math.min(100, Math.max(0, ((points - min) / (max - min)) * 100));

    // Points needed for next level
    const nextLevelPoints = level === 5 ? 0 : (max + 1) - points;

    return { progress: Math.round(progress), nextLevelPoints };
};

/**
 * Updates a user's points safely.
 * @param {String} userId - The user ID to update
 * @param {String} actionKey - Key from POINTS_CONFIG (e.g., 'LIKE_POST')
 * @param {String} targetId - ID of the target object (optional)
 */
const updateUserPoints = async (userId, actionKey, targetId = null) => {
    try {
        const pointsChange = POINTS_CONFIG[actionKey];
        if (pointsChange === undefined) {
            console.error(`Invalid points action: ${actionKey}`);
            return;
        }

        const user = await User.findById(userId);
        if (!user) return;

        // Atomic update is cleaner, but we need side effects (history, socket)
        // Adjust points
        user.userLevelPoints = (user.userLevelPoints || 0) + pointsChange;

        // Prevent negative points
        if (user.userLevelPoints < 0) user.userLevelPoints = 0;

        // Calculate Level
        const newLevel = calculateLevel(user.userLevelPoints);
        const levelChanged = newLevel !== user.level;
        user.level = newLevel;

        // Existing backwards compatibility logic
        // We reuse the existing method on the schema if possible, or just replicate critical parts
        if (user.updateLevelRank) {
            user.updateLevelRank();
        }

        // Add History
        const historyEntry = {
            action: actionKey,
            points: pointsChange,
            targetId: targetId,
            date: new Date()
        };

        // Push and slice to keep last 50 entries
        user.pointsHistory.push(historyEntry);
        if (user.pointsHistory.length > 50) {
            user.pointsHistory = user.pointsHistory.slice(-50);
        }

        await user.save();

        // Socket Emission
        const progressData = getLevelProgress(user.userLevelPoints, user.level);

        const socketId = getReceiverSocketId(userId.toString());
        if (socketId) {
            io.to(socketId).emit("pointsUpdate", {
                points: user.userLevelPoints,
                level: user.level,
                levelChanged,
                pointsChange,
                action: actionKey,
                ...progressData
            });
        }

    } catch (error) {
        console.error("Error updating user points:", error);
    }
};

module.exports = {
    POINTS_CONFIG,
    updateUserPoints,
    calculateLevel
};
