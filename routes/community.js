const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const communityController = require('../controllers/communityController');

router.post('/create', authMiddleware, communityController.createCommunity);
router.get('/all', authMiddleware, communityController.getAllCommunities);

module.exports = router;
