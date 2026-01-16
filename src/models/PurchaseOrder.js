const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PurchaseOrder = sequelize.define('PurchaseOrder', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    supplierId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    orderDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Received', 'Cancelled'),
        defaultValue: 'Pending'
    },
    paymentStatus: {
        type: DataTypes.ENUM('Unpaid', 'Partial', 'Paid'),
        defaultValue: 'Unpaid'
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    tax: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    notes: {
        type: DataTypes.TEXT
    }
});

module.exports = PurchaseOrder;
