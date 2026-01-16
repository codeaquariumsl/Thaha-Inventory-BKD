const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');

const { authenticateToken, authorizeTaxAccess } = require('../middlewares/auth.middleware');

router.post('/', authenticateToken, authorizeTaxAccess, invoiceController.createInvoice);
router.get('/', authenticateToken, authorizeTaxAccess, invoiceController.getAllInvoices);
router.get('/:id', authenticateToken, authorizeTaxAccess, invoiceController.getInvoiceById);
router.put('/:id', authenticateToken, authorizeTaxAccess, invoiceController.updateInvoice);
router.patch('/:id/approve', authenticateToken, invoiceController.approveInvoice);
router.delete('/:id', authenticateToken, invoiceController.deleteInvoice);

module.exports = router;
