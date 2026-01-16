const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { models } = require('../models');
const { User, Role } = models;

const SECRET_KEY = process.env.JWT_SECRET || 'CA@25';

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await User.findOne({ where: { username }, include: Role });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!user.isActive) {
            return res.status(403).json({ error: 'Account is inactive' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.Role ? user.Role.name : 'user' },
            SECRET_KEY,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.Role ? user.Role.name : null
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
