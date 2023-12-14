const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const { authenticateUser } = require('../middleware/authMiddleware');

// Página de inicio
router.get('/', (req, res) => {
  res.render('index');
});

// Perfil del usuario
router.get('/profile', authenticateUser, userController.profile);

// Registro de usuario
router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', userController.createUser);  

// Iniciar sesión
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', userController.login);

// Cerrar sesión
router.get('/logout', authenticateUser, userController.logout);

module.exports = router;
