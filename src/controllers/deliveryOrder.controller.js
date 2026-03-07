const { sequelize, models } = require('../models');
const { DeliveryOrder, SalesOrder, Invoice, InvoiceItem, DeliveryOrderItem, Customer, Product, SalesOrderItem } = models;
const { generateSequenceNumber } = require('../utils/numberGenerator');


exports.createDeliveryOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const orderData = { ...req.body };
        const items = orderData.items || [];
        const allowedRoles = ['admin', 'tax_user'];
        const canCreateTax = req.user && allowedRoles.includes(req.user.role);

        if (orderData.orderType === 'Tax' && !canCreateTax) {
            orderData.orderType = 'General';
        }

        // Generate Delivery Number
        if (!orderData.deliveryNumber) {
            orderData.deliveryNumber = await generateSequenceNumber(DeliveryOrder, 'TPID', 'deliveryNumber');
        }

        const deliveryOrder = await DeliveryOrder.create(orderData, { transaction: t });

        if (items.length > 0) {
            const deliveryItems = items.map(item => ({
                deliveryOrderId: deliveryOrder.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                discount: item.discount || 0,
                tax: item.tax || 0,
                total: item.total,
                colorId: item.colorId
            }));
            await DeliveryOrderItem.bulkCreate(deliveryItems, { transaction: t });
        }

        await t.commit();
        res.status(201).json(deliveryOrder);
    } catch (error) {
        await t.rollback();
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
            include: [
                { model: Customer },
                { model: SalesOrder },
                { model: DeliveryOrderItem, as: 'items', include: [Product] }
            ],
            order: [['createdAt', 'DESC']]
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
            include: [
                { model: Customer },
                { model: SalesOrder },
                { model: DeliveryOrderItem, as: 'items', include: [Product] }
            ]
        });
        if (!deliveryOrder) return res.status(404).json({ error: 'Delivery Order not found' });
        res.status(200).json(deliveryOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateDeliveryOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const orderData = { ...req.body };
        const items = orderData.items;
        const allowedRoles = ['admin', 'tax_user'];
        const canUpdateTax = req.user && allowedRoles.includes(req.user.role);

        if (orderData.orderType === 'Tax' && !canUpdateTax) {
            delete orderData.orderType;
        }

        const [updated] = await DeliveryOrder.update(orderData, {
            where: { id: req.params.id },
            transaction: t
        });

        if (!updated) {
            await t.rollback();
            return res.status(404).json({ error: 'Delivery Order not found' });
        }

        if (items) {
            // Clear existing items and recreate
            await DeliveryOrderItem.destroy({
                where: { deliveryOrderId: req.params.id },
                transaction: t
            });

            const deliveryItems = items.map(item => ({
                deliveryOrderId: req.params.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                discount: item.discount || 0,
                tax: item.tax || 0,
                total: item.total,
                colorId: item.colorId
            }));
            await DeliveryOrderItem.bulkCreate(deliveryItems, { transaction: t });
        }

        await t.commit();
        const deliveryOrder = await DeliveryOrder.findByPk(req.params.id, {
            include: [
                { model: Customer },
                { model: SalesOrder },
                { model: DeliveryOrderItem, as: 'items', include: [Product] }
            ]
        });
        res.status(200).json(deliveryOrder);
    } catch (error) {
        await t.rollback();
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
            include: [
                { model: SalesOrder },
                { model: DeliveryOrderItem, as: 'items' }
            ],
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
        const invoiceNumber = await generateSequenceNumber(Invoice, 'TPII', 'invoiceNumber');

        const invoice = await Invoice.create({
            invoiceNumber: invoiceNumber,
            salesOrderId: deliveryOrder.salesOrderId,
            customerId: deliveryOrder.customerId,
            subtotal: deliveryOrder.subtotal,
            tax: deliveryOrder.tax,
            discount: deliveryOrder.discount,
            total: deliveryOrder.total,
            amountDue: deliveryOrder.total,
            status: 'Draft',
            orderType: deliveryOrder.orderType,
            invoiceDate: new Date(),
            dueDate: deliveryOrder.deliveryDate || new Date()
        }, { transaction: t });

        // Create Invoice Items from Delivery Order Items
        if (deliveryOrder.items && deliveryOrder.items.length > 0) {
            const invoiceItems = deliveryOrder.items.map(item => ({
                invoiceId: invoice.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                discount: item.discount,
                total: item.total,
                colorId: item.colorId
            }));
            await InvoiceItem.bulkCreate(invoiceItems, { transaction: t });
        }

        await t.commit();
        res.status(200).json({ message: 'Delivery Order approved and Invoice created', deliveryOrder });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};
