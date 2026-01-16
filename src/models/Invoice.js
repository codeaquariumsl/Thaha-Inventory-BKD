const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    invoiceNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    salesOrderId: {
        type: DataTypes.INTEGER
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    invoiceDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    dueDate: {
        type: DataTypes.DATEONLY
    },
    status: {
        type: DataTypes.ENUM('Draft', 'Approved', 'Sent', 'Paid', 'Partial', 'Overdue', 'Cancelled'),
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
    amountPaid: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    amountDue: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    paymentTerms: {
        type: DataTypes.STRING
    },
    notes: {
        type: DataTypes.TEXT
    },
    orderType: {
        type: DataTypes.ENUM('General', 'Tax'),
        defaultValue: 'General'
    }
});

module.exports = Invoice;
