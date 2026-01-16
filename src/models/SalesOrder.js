const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SalesOrder = sequelize.define('SalesOrder', {
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
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    orderDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    deliveryDate: {
        type: DataTypes.DATEONLY
    },
    status: {
        type: DataTypes.ENUM('Draft', 'Confirmed', 'Processing', 'Completed', 'Cancelled'),
        defaultValue: 'Draft'
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
    notes: {
        type: DataTypes.TEXT
    },
    orderType: {
        type: DataTypes.ENUM('General', 'Tax'),
        defaultValue: 'General'
    }
});

module.exports = SalesOrder;
