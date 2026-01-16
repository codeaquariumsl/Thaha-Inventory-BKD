const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    },
    taxId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    creditLimit: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    currentBalance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    customerPrices: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    }
});

module.exports = Customer;
