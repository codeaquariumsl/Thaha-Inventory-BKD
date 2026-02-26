const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Color = sequelize.define('Color', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    hexCode: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Color;
