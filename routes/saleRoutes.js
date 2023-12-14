const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleControllers');
const { authenticateUser, checkAdmin } = require('../middleware/authMiddleware');

router.get('/sales', [authenticateUser, checkAdmin], saleController.getSales);
router.get('/sales/add', [authenticateUser, checkAdmin], saleController.addSaleForm);
router.post('/sales/add', [authenticateUser, checkAdmin], saleController.addSale);
router.get('/sales/:id', authenticateUser, saleController.getSaleDetails);

module.exports = router;
