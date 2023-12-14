const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/signup', authMiddleware.redirectIfLoggedIn, authController.getRegister);
router.post('/signup', authMiddleware.redirectIfLoggedIn, authController.postRegister);
router.get('/login', authMiddleware.redirectIfLoggedIn, authController.getLogin);
router.post('/login', authMiddleware.redirectIfLoggedIn, authController.postLogin);
router.post('/logout', authController.postLogout);

module.exports = router;
