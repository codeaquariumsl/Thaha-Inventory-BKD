const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sku: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Categories', // Assuming table name is Categories
            key: 'id'
        }
    },
    supplierId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    stockQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    reorderLevel: {
        type: DataTypes.INTEGER,
        defaultValue: 10
    },
    description: {
        type: DataTypes.TEXT
    },
    uom: {
        type: DataTypes.STRING,
        defaultValue: 'pcs'
    },
    type: {
        type: DataTypes.ENUM('finished_good', 'raw_material'),
        defaultValue: 'finished_good'
    },
    isHaveLid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Product;
