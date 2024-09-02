const express = require('express');
const { protect } = require('../utils/auth');
const { registerUser, authUser, getUserProfile } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
