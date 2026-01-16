const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: { // Hashed password
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    roleId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Roles',
            key: 'id'
        }
    }
});

module.exports = User;
