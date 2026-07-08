const route = require('express').Router();
const { 
  getAdminStats
} = require('../Controllers/AdminController');

const { verifyToken, verifyAdmin } = require('../Middelwares/verifyToken');

// Get admin stats
route.get('/stats', verifyAdmin, getAdminStats);

module.exports = route;
