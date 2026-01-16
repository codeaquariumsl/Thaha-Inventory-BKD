const { models } = require('../models');
const { Role } = models;

exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        const role = await Role.create({ name, description });
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        const role = await Role.findByPk(req.params.id);
        if (!role) return res.status(404).json({ error: 'Role not found' });

        if (name) role.name = name;
        if (description) role.description = description;

        await role.save();
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) return res.status(404).json({ error: 'Role not found' });
        await role.destroy();
        res.json({ message: 'Role deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
