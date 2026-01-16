const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SalesReturn = sequelize.define('SalesReturn', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    returnNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    invoiceId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    returnDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    reason: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Refunded'),
        defaultValue: 'Pending'
    },
    refundAmount: {
        type: DataTypes.DECIMAL(10, 2)
    },
    refundMethod: {
        type: DataTypes.STRING
    }
});

module.exports = SalesReturn;
