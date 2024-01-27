const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController');

// POST /v1/auth/signup
router.post('/signup', UserController.signup);

// POST /v1/auth/signin
router.post('/signin', UserController.signin);

// GET /v1/auth/me
router.get('/me', UserController.getMe);

module.exports = router;
