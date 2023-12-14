const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopControllers');
const { authenticateUser } = require('../middleware/authMiddleware');

// Rutas de la tienda
router.get('/', shopController.getShop);
router.get('/products/:id', shopController.getProductDetails);
router.post('/products/:id/buy', authenticateUser, shopController.buyProduct);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProductDetails);

// Rutas del carrito de compras
router.get('/cart', authenticateUser, shopController.getCart);
router.post('/cart/add/:productId', authenticateUser, shopController.addToCart);
router.post('/cart/remove/:productId', authenticateUser, shopController.removeFromCart);

module.exports = router;
