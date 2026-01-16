const express = require('express');
const router = express.Router();
const salesReturnController = require('../controllers/salesReturn.controller');

router.post('/', salesReturnController.createSalesReturn);
router.get('/', salesReturnController.getAllSalesReturns);
router.get('/:id', salesReturnController.getSalesReturnById);
router.put('/:id', salesReturnController.updateSalesReturn);

module.exports = router;
