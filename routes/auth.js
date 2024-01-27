const express = require('express');
const router = express.Router();
const { use } = require('../controllers/UserController');

router.post('/signup', UserController.signup);
router.post('/signin', UserController.signin);
router.get('/me', authMiddleware, UserController.getMe); // Protect this route with authentication middleware

module.exports = router;
