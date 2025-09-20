const express = require('express');
const router = express.Router();
const { createReel, deleteReel, getAllReels ,likeReel,viewReel,shareReel} = require('../Controllers/ReelsController');
const videoUpload = require('../Middelwares/uploadVideo'); // المسار حسب مشروعك
const { verifyToken } = require('../Middelwares/verifyToken');

// 🚀 Create Reel
router.post('/', verifyToken, videoUpload.single('video'), createReel);

// 🚀 Delete Reel
router.delete('/:id', verifyToken, deleteReel);

// 🚀 Get all Reels
router.get('/', getAllReels);
router.put('/like/:id',verifyToken, likeReel);
router.put('/view/:id',verifyToken, viewReel);
router.post('/share/:id',verifyToken, shareReel);

module.exports = router;