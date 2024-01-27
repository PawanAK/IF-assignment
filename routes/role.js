const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleController = require('../controllers/roleController');

router.post('/create', authMiddleware, roleController.createRole);
router.get('/all', authMiddleware, roleController.getAllRoles);

module.exports = router;
