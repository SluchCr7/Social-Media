const express = require('express');
const router = express.Router();
const {addView , toggleLike, deleteMusic, updateMusic, getMusicById, getAllMusic, createMusic} = require('../Controllers/MusicController');
const { verifyToken } = require('../Middelwares/verifyToken')
const musicUpload = require('../Middelwares/uploadMusic')
const photoUpload = require('../Middelwares/uploadPhoto');

// CRUD
router.post('/', verifyToken, photoUpload.single('image') , musicUpload.single('audio'), createMusic);
router.get('/', getAllMusic);
router.get('/:id', getMusicById);
router.put('/:id', verifyToken, updateMusic);
router.delete('/:id', verifyToken, deleteMusic);

// Actions
router.post('/like/:id', verifyToken, toggleLike);
router.post('/view/:id', addView);

module.exports = router;
