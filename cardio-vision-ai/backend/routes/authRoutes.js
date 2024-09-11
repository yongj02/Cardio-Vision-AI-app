const express = require('express');
const { registerUser, loginUser, getUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Import your existing middleware
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user', protect, getUser); // Protected route

module.exports = router;