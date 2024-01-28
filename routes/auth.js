const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const UserController = require('../controllers/UserController');

// POST /v1/auth/signup
router.post('/signup', UserController.signup);

// POST /v1/auth/signin
router.post('/signin', UserController.signin);

// GET /v1/auth/me
router.get('/me', authMiddleware, UserController.getMe);

module.exports = router;
