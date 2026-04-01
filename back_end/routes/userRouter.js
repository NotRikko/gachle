const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/auth');

router.post('/', user_controller.user_post);           
router.post('/login', user_controller.user_validate); 
router.post('/logout', user_controller.user_logout);  
router.post('/token', user_controller.user_token);     
router.get('/session', authenticateJWT, user_controller.user_session);
router.put('/username', authenticateJWT, user_controller.user_change_username);
router.put('/password', authenticateJWT, user_controller.user_change_password);
router.put('/picture', authenticateJWT, user_controller.user_change_picture);
router.put('/score', authenticateJWT, user_controller.user_update_score);

module.exports = router;