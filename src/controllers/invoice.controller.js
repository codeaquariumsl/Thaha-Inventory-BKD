const { sequelize, models } = require('../models');
const { Invoice, InvoiceItem, SalesOrder, Customer, Product } = models;


exports.createInvoice = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { items, ...orderData } = req.body;
        const allowedRoles = ['admin', 'tax_user'];
        const canCreateTax = req.user && allowedRoles.includes(req.user.role);

        if (orderData.orderType === 'Tax' && !canCreateTax) {
            orderData.orderType = 'General';
        }

        const invoice = await Invoice.create(orderData, { transaction: t });

        if (items && items.length > 0) {
            const invoiceItems = items.map(item => ({
                ...item,
                invoiceId: invoice.id
            }));
            await InvoiceItem.bulkCreate(invoiceItems, { transaction: t });
        }

        await t.commit();
        const createdInvoice = await Invoice.findByPk(invoice.id, {
            include: [{ model: InvoiceItem, as: 'items', include: [Product] }, Customer, SalesOrder]
        });

        res.status(201).json(createdInvoice);
    } catch (error) {
        await t.rollback();
        res.status(400).json({ error: error.message });
    }
};

exports.getAllInvoices = async (req, res) => {
    try {
        const whereClause = {};
        if (!req.canAccessTax) {
            whereClause.orderType = 'General';
        }
        const invoices = await Invoice.findAll({
            where: whereClause,
            include: [
                { model: Customer },
                { model: SalesOrder },
                { model: InvoiceItem, as: 'items', include: [Product] }

            ]
        });
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getInvoiceById = async (req, res) => {
    try {
        const whereClause = { id: req.params.id };
        if (!req.canAccessTax) {
            whereClause.orderType = 'General';
        }
        const invoice = await Invoice.findOne({
            where: whereClause,
            include: [
                { model: Customer },
                { model: SalesOrder },
                { model: InvoiceItem, as: 'items', include: [Product] }

            ]
        });
        if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateInvoice = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { items, ...orderData } = req.body;
        const allowedRoles = ['admin', 'tax_user'];
        const canUpdateTax = req.user && allowedRoles.includes(req.user.role);

        if (orderData.orderType === 'Tax' && !canUpdateTax) {
            delete orderData.orderType;
        }

        const [updated] = await Invoice.update(orderData, {
            where: { id: req.params.id },
            transaction: t
        });

        if (!updated && !items) {
            await t.rollback();
            return res.status(404).json({ error: 'Invoice not found' });
        }

        // Handle Items Update
        if (items) {
            await InvoiceItem.destroy({
                where: { invoiceId: req.params.id },
                transaction: t
            });

            const invoiceItems = items.map(item => ({
                ...item,
                invoiceId: req.params.id
            }));
            await InvoiceItem.bulkCreate(invoiceItems, { transaction: t });
        }

        await t.commit();
        const invoice = await Invoice.findByPk(req.params.id, {
            include: [{ model: InvoiceItem, as: 'items', include: [Product] }]
        });
        res.status(200).json(invoice);
    } catch (error) {
        await t.rollback();
        res.status(400).json({ error: error.message });
    }
};

exports.deleteInvoice = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        await InvoiceItem.destroy({
            where: { invoiceId: req.params.id },
            transaction: t
        });

        const deleted = await Invoice.destroy({
            where: { id: req.params.id },
            transaction: t
        });

        if (!deleted) {
            await t.rollback();
            return res.status(404).json({ error: 'Invoice not found' });
        }

        await t.commit();
        res.status(204).send();
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};

exports.approveInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id);
        if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

        if (invoice.status !== 'Draft') {
            return res.status(400).json({ error: 'Only Draft invoices can be approved' });
        }

        await invoice.update({ status: 'Approved' });
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
