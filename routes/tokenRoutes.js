const express = require('express');
const router = express.Router();
const { generateToken, getTokens } = require('../controllers/tokenController');
const { protect } = require('../middleware/authMiddleware');

// Define routes with middleware
router.post('/generatetoken', protect, generateToken);
router.get('/gettokens', protect, getTokens);

module.exports = router;
