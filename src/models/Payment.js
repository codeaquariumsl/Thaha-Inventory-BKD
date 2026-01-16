const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    receiptNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    invoiceId: {
        type: DataTypes.INTEGER
    },
    paymentDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    method: {
        type: DataTypes.ENUM('Cash', 'Card', 'Online', 'Check', 'Bank Transfer'),
        allowNull: false
    },
    referenceNumber: {
        type: DataTypes.STRING
    },
    notes: {
        type: DataTypes.TEXT
    }
});

module.exports = Payment;
