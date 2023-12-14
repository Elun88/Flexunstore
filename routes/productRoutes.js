const express = require('express');
const router = express.Router();
const productController = require('../controllers/productControllers');
const { authenticateUser, checkAdmin } = require('../middleware/authMiddleware');

router.get('/', authenticateUser, productController.getProducts);
router.post('/create', [authenticateUser, checkAdmin], productController.createProduct);
router.get('/create', [authenticateUser, checkAdmin], productController.createProductForm);
router.get('/:id', authenticateUser, productController.getProductDetails);
router.get('/:id/edit', [authenticateUser, checkAdmin], productController.editProductForm);
router.post('/:id/edit', [authenticateUser, checkAdmin], productController.updateProduct);  
router.post('/:id/delete', [authenticateUser, checkAdmin], productController.deleteProduct);

module.exports = router;
