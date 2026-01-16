const { models } = require('../models');
const { Customer } = models;

exports.createCustomer = async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const [updated] = await Customer.update(req.body, {
            where: { id: req.params.id }
        });
        if (!updated) return res.status(404).json({ error: 'Customer not found' });
        const customer = await Customer.findByPk(req.params.id);
        res.status(200).json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const deleted = await Customer.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) return res.status(404).json({ error: 'Customer not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
