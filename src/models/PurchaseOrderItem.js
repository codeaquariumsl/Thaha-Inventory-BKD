const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PurchaseOrderItem = sequelize.define('PurchaseOrderItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    purchaseOrderId: {
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
    cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
});

module.exports = PurchaseOrderItem;
