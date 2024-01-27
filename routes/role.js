const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/RoleController');

// POST /v1/role
router.post('/', RoleController.createRole);

// GET /v1/role
router.get('/', RoleController.getAllRoles);

module.exports = router;
