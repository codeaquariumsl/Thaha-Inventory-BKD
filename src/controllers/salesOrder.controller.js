const { sequelize, models } = require('../models');
const { SalesOrder, SalesOrderItem, Customer, Product, DeliveryOrder } = models;

exports.createSalesOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { items, ...orderData } = req.body;

        // Role-based order type validation
        const allowedRoles = ['admin', 'tax_user'];
        const canCreateTax = req.user && allowedRoles.includes(req.user.role);

        if (orderData.orderType === 'Tax' && !canCreateTax) {
            orderData.orderType = 'General';
        }

        // Create Order
        const order = await SalesOrder.create(orderData, { transaction: t });

        // Create Items
        if (items && items.length > 0) {
            const orderItems = items.map(item => ({
                ...item,
                salesOrderId: order.id
            }));
            await SalesOrderItem.bulkCreate(orderItems, { transaction: t });
        }

        await t.commit();

        const createdOrder = await SalesOrder.findByPk(order.id, {
            include: [{ model: SalesOrderItem, as: 'items' }, Customer]
        });

        res.status(201).json(createdOrder);
    } catch (error) {
        await t.rollback();
        res.status(400).json({ error: error.message });
    }
};

exports.getAllSalesOrders = async (req, res) => {
    try {
        const whereClause = {};
        if (!req.canAccessTax) {
            whereClause.orderType = 'General';
        }

        const orders = await SalesOrder.findAll({
            where: whereClause,
            include: [
                { model: Customer },
                { model: SalesOrderItem, as: 'items', include: [Product] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSalesOrderById = async (req, res) => {
    try {
        const whereClause = { id: req.params.id };
        if (!req.canAccessTax) {
            whereClause.orderType = 'General';
        }

        const order = await SalesOrder.findOne({
            where: whereClause,
            include: [
                { model: Customer },
                { model: SalesOrderItem, as: 'items', include: [Product] }
            ]
        });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSalesOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { items, ...orderData } = req.body;

        // Role-based order type validation
        const allowedRoles = ['admin', 'tax_user'];
        const canUpdateTax = req.user && allowedRoles.includes(req.user.role);

        if (orderData.orderType === 'Tax' && !canUpdateTax) {
            delete orderData.orderType; // Don't allow changing to Tax if not authorized
        }

        // Update Order
        await SalesOrder.update(orderData, {
            where: { id: req.params.id },
            transaction: t
        });

        // Handle Items Update
        if (items) {
            await SalesOrderItem.destroy({
                where: { salesOrderId: req.params.id },
                transaction: t
            });

            const orderItems = items.map(item => ({
                ...item,
                salesOrderId: req.params.id
            }));
            await SalesOrderItem.bulkCreate(orderItems, { transaction: t });
        }

        await t.commit();
        const updatedOrder = await SalesOrder.findByPk(req.params.id, {
            include: [{ model: SalesOrderItem, as: 'items' }]
        });
        res.status(200).json(updatedOrder);
    } catch (error) {
        await t.rollback();
        res.status(400).json({ error: error.message });
    }
};

exports.deleteSalesOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        await SalesOrderItem.destroy({
            where: { salesOrderId: req.params.id },
            transaction: t
        });

        const deleted = await SalesOrder.destroy({
            where: { id: req.params.id },
            transaction: t
        });

        if (!deleted) {
            await t.rollback();
            return res.status(404).json({ error: 'Order not found' });
        }

        await t.commit();
        res.status(204).send();
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};

exports.approveSalesOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const order = await SalesOrder.findByPk(req.params.id, {
            include: [Customer, { model: DeliveryOrder }]
        });

        if (!order) {
            await t.rollback();
            return res.status(404).json({ error: 'Sales Order not found' });
        }

        if (order.status === 'Confirmed') {
            await t.rollback();
            return res.status(400).json({ error: 'Sales Order is already confirmed' });
        }

        // Update Sales Order Status
        await order.update({ status: 'Confirmed' }, { transaction: t });

        // Auto Create Delivery Order if it doesn't exist
        let deliveryOrder = await DeliveryOrder.findOne({
            where: { salesOrderId: order.id }
        });

        if (!deliveryOrder) {
            const timestamp = Date.now().toString().slice(-6);
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const deliveryNumber = `DO-${timestamp}${random}`;

            deliveryOrder = await DeliveryOrder.create({
                deliveryNumber: deliveryNumber,
                salesOrderId: order.id,
                deliveryDate: order.deliveryDate,
                shippingAddress: order.Customer?.address || 'No Address Provided',
                status: 'Pending',
                orderType: order.orderType
            }, { transaction: t });
        }

        await t.commit();

        const updatedOrder = await SalesOrder.findByPk(order.id, {
            include: [Customer, DeliveryOrder, { model: SalesOrderItem, as: 'items' }]
        });

        res.status(200).json({
            message: 'Sales Order approved and Delivery Order created successfully',
            order: updatedOrder
        });
    } catch (error) {
        await t.rollback();
        console.error('Approve Sales Order Error:', error);
        res.status(500).json({ error: error.message });
    }
};
