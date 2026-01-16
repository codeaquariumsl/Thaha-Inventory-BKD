const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StockMovement = sequelize.define('StockMovement', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    movementType: {
        type: DataTypes.ENUM('IN', 'OUT', 'ADJ'),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reference: {
        type: DataTypes.STRING
    },
    reason: {
        type: DataTypes.STRING
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    userId: {
        type: DataTypes.INTEGER
    }
});

module.exports = StockMovement;
