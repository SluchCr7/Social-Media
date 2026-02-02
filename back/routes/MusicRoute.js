const express = require('express');
const router = express.Router();
const {
  addView,
  toggleLike,
  deleteMusic,
  shareMusicAsPost,
  addListen,
  updateMusic,
  getMusicById,
  getAllMusic,
  createMusic,
  searchMusic,
  getTopCharts,
  getRecommendedMusic
} = require('../Controllers/MusicController');
const { verifyToken } = require('../Middelwares/verifyToken');
const upload = require('../Middelwares/uploadMusic');

// 🔍 Search & Filters (Priority over ID routes)
router.get('/search', searchMusic);
router.get('/top-charts', getTopCharts);
router.get('/recommendations/:id', getRecommendedMusic);

// 🎵 CRUD
router.post('/', upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]), verifyToken, createMusic);
router.get('/', getAllMusic);
router.get('/:id', getMusicById);
router.put('/:id', verifyToken, updateMusic);
router.delete('/:id', verifyToken, deleteMusic);

// ⚡ Actions
router.post('/listen/:id', verifyToken, addListen);
router.post('/share/:id', verifyToken, shareMusicAsPost);
router.put('/like/:id', verifyToken, toggleLike);
router.put('/view/:id', addView);

module.exports = router;
