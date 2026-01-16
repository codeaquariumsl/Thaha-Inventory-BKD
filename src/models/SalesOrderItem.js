const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SalesOrderItem = sequelize.define('SalesOrderItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    salesOrderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    discount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
});

module.exports = SalesOrderItem;
