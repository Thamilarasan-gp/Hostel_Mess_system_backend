const express = require('express');
const router = express.Router();
const { scanToken } = require('../controllers/scanController');
const { protect } = require('../middleware/authMiddleware');

// Apply protection to all scan routes
router.use(protect);

// Define scan routes
router.post('/scantoken', scanToken);

module.exports = router;
