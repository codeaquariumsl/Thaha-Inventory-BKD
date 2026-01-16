const bcrypt = require('bcryptjs');
const { models } = require('../models');
const { User, Role } = models;

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ include: Role, attributes: { exclude: ['password'] } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, { include: Role, attributes: { exclude: ['password'] } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { username, password, email, roleId, isActive } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword, email, roleId, isActive });
        res.status(201).json({ message: 'User created', userId: user.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { username, email, roleId, isActive, password } = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (username) user.username = username;
        if (email) user.email = email;
        if (roleId) user.roleId = roleId;
        if (isActive !== undefined) user.isActive = isActive;
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.json({ message: 'User updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        await user.destroy();
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
