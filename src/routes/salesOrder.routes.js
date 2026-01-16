const express = require('express');
const router = express.Router();
const salesOrderController = require('../controllers/salesOrder.controller');

const { authenticateToken, authorizeTaxAccess } = require('../middlewares/auth.middleware');

router.post('/', authenticateToken, authorizeTaxAccess, salesOrderController.createSalesOrder);
router.get('/', authenticateToken, authorizeTaxAccess, salesOrderController.getAllSalesOrders);
router.get('/:id', authenticateToken, authorizeTaxAccess, salesOrderController.getSalesOrderById);
router.put('/:id', authenticateToken, authorizeTaxAccess, salesOrderController.updateSalesOrder);
router.patch('/:id/approve', authenticateToken, salesOrderController.approveSalesOrder);
router.delete('/:id', authenticateToken, salesOrderController.deleteSalesOrder);

module.exports = router;
