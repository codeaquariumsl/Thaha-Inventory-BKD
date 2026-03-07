const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DeliveryOrder = sequelize.define('DeliveryOrder', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    deliveryNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    salesOrderId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    deliveryAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    trackingNumber: {
        type: DataTypes.STRING
    },
    notes: {
        type: DataTypes.TEXT
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    tax: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    discount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'In Transit', 'Delivered', 'Cancelled'),
        defaultValue: 'Pending'
    },
    dispatchDate: {
        type: DataTypes.DATE
    },
    deliveryDate: {
        type: DataTypes.DATE
    },
    orderType: {
        type: DataTypes.ENUM('General', 'Tax'),
        defaultValue: 'General'
    }
});

module.exports = DeliveryOrder;
