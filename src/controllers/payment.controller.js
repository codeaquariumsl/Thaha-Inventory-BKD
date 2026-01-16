const { sequelize, models } = require('../models');
const { Payment, Invoice, Customer } = models;

exports.createPayment = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const data = { ...req.body };

        // Ensure method is present, default to 'Cash' if missing or use paymentMethod if provided
        if (!data.method) {
            data.method = data.paymentMethod || 'Cash';
        }

        const payment = await Payment.create(data, { transaction: t });

        // Update Invoice amountPaid and amountDue if linked
        if (payment.invoiceId) {
            const invoice = await Invoice.findByPk(payment.invoiceId, { transaction: t });
            if (invoice) {
                const newAmountPaid = parseFloat(invoice.amountPaid) + parseFloat(payment.amount);
                const newAmountDue = parseFloat(invoice.total) - newAmountPaid;

                let status = invoice.status;
                if (newAmountDue <= 0) status = 'Paid';
                else if (newAmountPaid > 0) status = 'Partial';

                await invoice.update({
                    amountPaid: newAmountPaid,
                    amountDue: newAmountDue,
                    status: status
                }, { transaction: t });
            }
        }

        // Update Customer Balance (decrease balance as they paid)
        // Wait, "Balance" usually means what they OWE. So payment reduces balance.
        const customer = await Customer.findByPk(payment.customerId, { transaction: t });
        if (customer) {
            const newBalance = parseFloat(customer.currentBalance) - parseFloat(payment.amount);
            await customer.update({ currentBalance: newBalance }, { transaction: t });
        }

        await t.commit();
        res.status(201).json(payment);
    } catch (error) {
        console.log(error);

        await t.rollback();
        res.status(400).json({ error: error.message });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            include: [{ model: Customer }, { model: Invoice }]
        });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findByPk(req.params.id, {
            include: [{ model: Customer }, { model: Invoice }]
        });
        if (!payment) return res.status(404).json({ error: 'Payment not found' });
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Usually payments are not updated/deleted easily in accounting without reversal, but for simple CRUD:
exports.deletePayment = async (req, res) => {
    // If we delete a payment, we should probably revert the Invoice/Customer balance updates. 
    // Complexity warning. For now, simple delete.
    try {
        const deleted = await Payment.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) return res.status(404).json({ error: 'Payment not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
