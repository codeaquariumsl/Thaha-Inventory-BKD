const { sequelize, models } = require('../models');
const { PurchaseOrder, PurchaseOrderItem, Supplier, Product } = models;

exports.createPurchaseOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { items, ...orderData } = req.body;

        // Generate Order Number if not provided
        if (!orderData.orderNumber) {
            const timestamp = Date.now().toString().slice(-6);
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            orderData.orderNumber = `PO-${timestamp}${random}`;
        }

        // Normalize Enum Values (Pending -> Pending, unpaid -> Unpaid)
        if (orderData.status) {
            orderData.status = orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1).toLowerCase();
        }
        if (orderData.paymentStatus) {
            orderData.paymentStatus = orderData.paymentStatus.charAt(0).toUpperCase() + orderData.paymentStatus.slice(1).toLowerCase();
        }

        // Filter out fields not in the model to be safe
        const filteredOrderData = {
            orderNumber: orderData.orderNumber,
            supplierId: orderData.supplierId,
            orderDate: orderData.orderDate || new Date(),
            status: orderData.status,
            paymentStatus: orderData.paymentStatus,
            subtotal: orderData.subtotal,
            tax: orderData.tax,
            total: orderData.total,
            notes: orderData.notes
        };

        const order = await PurchaseOrder.create(filteredOrderData, { transaction: t });

        if (items && items.length > 0) {
            const orderItems = items.map(item => ({
                purchaseOrderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                cost: item.cost,
                total: item.total
            }));
            await PurchaseOrderItem.bulkCreate(orderItems, { transaction: t });
        }

        await t.commit();

        const createdOrder = await PurchaseOrder.findByPk(order.id, {
            include: [
                { model: PurchaseOrderItem, as: 'items' },
                { model: Supplier }
            ]
        });

        res.status(201).json(createdOrder);
    } catch (error) {
        await t.rollback();
        console.error('Create Purchase Order Error:', error);
        res.status(400).json({
            error: error.message,
            details: error.errors ? error.errors.map(e => e.message) : undefined
        });
    }
};

exports.getAllPurchaseOrders = async (req, res) => {
    try {
        const orders = await PurchaseOrder.findAll({
            include: [
                { model: Supplier },
                { model: PurchaseOrderItem, as: 'items', include: [Product] }
            ]
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPurchaseOrderById = async (req, res) => {
    try {
        const order = await PurchaseOrder.findByPk(req.params.id, {
            include: [
                { model: Supplier },
                { model: PurchaseOrderItem, as: 'items', include: [Product] }
            ]
        });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePurchaseOrder = async (req, res) => {
    // Similar simplified update logic
    const t = await sequelize.transaction();
    try {
        const { items, ...orderData } = req.body;

        await PurchaseOrder.update(orderData, {
            where: { id: req.params.id },
            transaction: t
        });

        if (items) {
            await PurchaseOrderItem.destroy({
                where: { purchaseOrderId: req.params.id },
                transaction: t
            });

            const orderItems = items.map(item => ({
                ...item,
                purchaseOrderId: req.params.id
            }));
            await PurchaseOrderItem.bulkCreate(orderItems, { transaction: t });
        }

        await t.commit();
        const updatedOrder = await PurchaseOrder.findByPk(req.params.id, {
            include: [{ model: PurchaseOrderItem, as: 'items' }]
        });
        res.status(200).json(updatedOrder);
    } catch (error) {
        await t.rollback();
        res.status(400).json({ error: error.message });
    }
};
