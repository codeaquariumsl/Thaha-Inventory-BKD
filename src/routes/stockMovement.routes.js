const express = require('express');
const router = express.Router();
const stockMovementController = require('../controllers/stockMovement.controller');

router.post('/', stockMovementController.createStockMovement);
router.get('/', stockMovementController.getAllStockMovements);

module.exports = router;
