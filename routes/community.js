const express = require('express');
const router = express.Router();
const CommunityController = require('../controllers/CommunityController');

// POST /v1/community
router.post('/', CommunityController.createCommunity);

// GET /v1/community
router.get('/', CommunityController.getAllCommunities);

module.exports = router;
