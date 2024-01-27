const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/MemberController');

// POST /v1/member
router.post('/', MemberController.addMember);

// DELETE /v1/member/:id
router.delete('/:id', MemberController.removeMember);

module.exports = router;
