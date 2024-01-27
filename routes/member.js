const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const MemberController = require('../controllers/MemberController');

// POST /v1/member
router.post('/', authMiddleware, MemberController.addMember);

// DELETE /v1/member/:id
router.delete('/:id', authMiddleware, MemberController.removeMember);

module.exports = router;
