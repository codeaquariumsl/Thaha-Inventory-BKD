const { sequelize, models } = require('../models');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const SalesOrderItem = require('../models/SalesOrderItem');
const { DeliveryOrder, SalesOrder, Invoice, InvoiceItem } = models;


exports.createDeliveryOrder = async (req, res) => {
    try {
        const orderData = { ...req.body };
        const allowedRoles = ['admin', 'tax_user'];
        const canCreateTax = req.user && allowedRoles.includes(req.user.role);

        if (orderData.orderType === 'Tax' && !canCreateTax) {
            orderData.orderType = 'General';
        }

        const deliveryOrder = await DeliveryOrder.create(orderData);
        res.status(201).json(deliveryOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllDeliveryOrders = async (req, res) => {
    try {
        const whereClause = {};
        if (!req.canAccessTax) {
            whereClause.orderType = 'General';
        }

        const deliveryOrders = await DeliveryOrder.findAll({
            where: whereClause,
            include: [{
                model: SalesOrder,
                include: [{ model: Customer },
                { model: SalesOrderItem, as: 'items', include: [Product] }]
            }]
        });
        res.status(200).json(deliveryOrders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDeliveryOrderById = async (req, res) => {
    try {
        const whereClause = { id: req.params.id };
        if (!req.canAccessTax) {
            whereClause.orderType = 'General';
        }

        const deliveryOrder = await DeliveryOrder.findOne({
            where: whereClause,
            include: [{ model: SalesOrder }]
        });
        if (!deliveryOrder) return res.status(404).json({ error: 'Delivery Order not found' });
        res.status(200).json(deliveryOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateDeliveryOrder = async (req, res) => {
    try {
        const orderData = { ...req.body };
        const allowedRoles = ['admin', 'tax_user'];
        const canUpdateTax = req.user && allowedRoles.includes(req.user.role);

        if (orderData.orderType === 'Tax' && !canUpdateTax) {
            delete orderData.orderType;
        }

        const [updated] = await DeliveryOrder.update(orderData, {
            where: { id: req.params.id }
        });
        if (!updated) return res.status(404).json({ error: 'Delivery Order not found' });
        const deliveryOrder = await DeliveryOrder.findByPk(req.params.id);
        res.status(200).json(deliveryOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteDeliveryOrder = async (req, res) => {
    try {
        const deleted = await DeliveryOrder.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) return res.status(404).json({ error: 'Delivery Order not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.approveDeliveryOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const deliveryOrder = await DeliveryOrder.findByPk(req.params.id, {
            include: [{
                model: SalesOrder,
                include: [{ model: SalesOrderItem, as: 'items' }]
            }],
            transaction: t
        });


        if (!deliveryOrder) {
            await t.rollback();
            return res.status(404).json({ error: 'Delivery Order not found' });
        }

        if (deliveryOrder.status !== 'Pending') {
            await t.rollback();
            return res.status(400).json({ error: 'Only Pending delivery orders can be approved' });
        }

        // Update status
        await deliveryOrder.update({ status: 'Approved' }, { transaction: t });

        // Auto Create Invoice
        const salesOrder = deliveryOrder.SalesOrder;
        if (salesOrder) {
            const timestamp = Date.now().toString().slice(-6);
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const invoiceNumber = `INV-${timestamp}${random}`;

            const invoice = await Invoice.create({
                invoiceNumber: invoiceNumber,
                salesOrderId: salesOrder.id,
                customerId: salesOrder.customerId,
                subtotal: salesOrder.subtotal,
                tax: salesOrder.tax,
                discount: salesOrder.discount,
                total: salesOrder.total,
                amountDue: salesOrder.total,
                status: 'Draft',
                orderType: deliveryOrder.orderType,
                invoiceDate: new Date()
            }, { transaction: t });

            // Create Invoice Items
            if (salesOrder.items && salesOrder.items.length > 0) {
                const invoiceItems = salesOrder.items.map(item => ({
                    invoiceId: invoice.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    discount: item.discount,
                    total: item.total
                }));
                await InvoiceItem.bulkCreate(invoiceItems, { transaction: t });
            }

        }

        await t.commit();
        res.status(200).json({ message: 'Delivery Order approved and Invoice created', deliveryOrder });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};
