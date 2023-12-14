const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const { authenticateUser } = require('../middleware/authMiddleware');

// Rutas de perfil de usuario
router.get('/profile', authenticateUser, userController.profile);
router.get('/profile/edit', authenticateUser, userController.editProfile);
router.post('/profile/edit', authenticateUser, userController.updateProfile);

module.exports = router;
