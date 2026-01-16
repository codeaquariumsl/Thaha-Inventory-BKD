const express = require('express');
const router = express.Router();
const purchaseOrderController = require('../controllers/purchaseOrder.controller');

router.post('/', purchaseOrderController.createPurchaseOrder);
router.get('/', purchaseOrderController.getAllPurchaseOrders);
router.get('/:id', purchaseOrderController.getPurchaseOrderById);
router.put('/:id', purchaseOrderController.updatePurchaseOrder);

module.exports = router;
