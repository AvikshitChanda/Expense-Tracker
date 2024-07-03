const express = require('express');
const router = express.Router();
const { register, login,getUserProfile } = require('../controllers/authController');
const authMiddleware=require('../middlewares/auth')


router.post('/register', register);

router.post('/login', login);

router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;
