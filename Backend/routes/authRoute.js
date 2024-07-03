const express = require('express');
const router = express.Router();
const { register, login,getUserProfile } = require('../controllers/authController');
const authMiddleware=require('../middlewares/auth')

// Route: POST /api/auth/register
// Description: Register a new user
router.post('/register', register);

// Route: POST /api/auth/login
// Description: Login user
router.post('/login', login);

router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;
