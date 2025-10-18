const express = require('express');
const router = express.Router();
const {addView , toggleLike, deleteMusic,addListen, updateMusic, getMusicById, getAllMusic, createMusic} = require('../Controllers/MusicController');
const { verifyToken } = require('../Middelwares/verifyToken')
const musicUpload = require('../Middelwares/uploadMusic')
const photoUpload = require('../Middelwares/uploadPhoto');

// CRUD
const upload = require('../Middelwares/uploadMusic');

router.post('/',  upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]), verifyToken, createMusic)
router.get('/', getAllMusic);
router.get('/:id', getMusicById);
router.put('/:id', verifyToken, updateMusic);
router.delete('/:id', verifyToken, deleteMusic);
router.post('/listen/:id', verifyToken, addListen);
// Actions
router.put('/like/:id', verifyToken, toggleLike);
router.put('/view/:id', addView);

module.exports = router;
