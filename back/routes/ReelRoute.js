const express = require('express');
const router = express.Router();
const { createReel, deleteReel, getAllReels } = require('../Controllers/ReelsController');
const videoUpload = require('../Middelwares/uploadVideo'); // المسار حسب مشروعك
const { verifyToken } = require('../Middelwares/verifyToken');

// 🚀 Create Reel
router.post('/', verifyToken, videoUpload.single('video'), createReel);

// 🚀 Delete Reel
router.delete('/:id', verifyToken, deleteReel);

// 🚀 Get all Reels
router.get('/', getAllReels);

module.exports = router;