const express = require('express');
const router = express.Router();
const character_controller = require('../controllers/characterController');
const authenticateJWT = require('../middleware/authenticateJWT');
const { authenticateJWT, isAdmin } = require('../middleware/auth');

router.get('/', character_controller.character_get_all);
router.get('/daily', character_controller.character_get_daily);
router.post('/', authenticateJWT, isAdmin, character_controller.character_post);
router.post('/daily', authenticateJWT, isAdmin, character_controller.character_post_daily);

module.exports = router;