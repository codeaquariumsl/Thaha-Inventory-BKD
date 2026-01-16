const express = require('express');
const router = express.Router();
const deliveryOrderController = require('../controllers/deliveryOrder.controller');

const { authenticateToken, authorizeTaxAccess } = require('../middlewares/auth.middleware');

router.post('/', authenticateToken, authorizeTaxAccess, deliveryOrderController.createDeliveryOrder);
router.get('/', authenticateToken, authorizeTaxAccess, deliveryOrderController.getAllDeliveryOrders);
router.get('/:id', authenticateToken, authorizeTaxAccess, deliveryOrderController.getDeliveryOrderById);
router.put('/:id', authenticateToken, authorizeTaxAccess, deliveryOrderController.updateDeliveryOrder);
router.patch('/:id/approve', authenticateToken, deliveryOrderController.approveDeliveryOrder);
router.delete('/:id', authenticateToken, deliveryOrderController.deleteDeliveryOrder);

module.exports = router;
