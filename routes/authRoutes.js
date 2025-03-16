const express = require('express');
const router = express.Router();
const { wardenSignup, wardenLogin, studentLogin } = require('../controllers/authController');

// Authentication routes
router.post('/warden/signup', wardenSignup);
router.post('/warden/login', wardenLogin);
router.post('/student/login', studentLogin);

module.exports = router;
