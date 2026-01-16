const { models } = require('../models');
const { Supplier } = models;

exports.createSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.create(req.body);
        res.status(201).json(supplier);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.findAll();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSupplier = async (req, res) => {
    try {
        const [updated] = await Supplier.update(req.body, {
            where: { id: req.params.id }
        });
        if (!updated) return res.status(404).json({ error: 'Supplier not found' });
        const supplier = await Supplier.findByPk(req.params.id);
        res.status(200).json(supplier);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteSupplier = async (req, res) => {
    try {
        const deleted = await Supplier.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) return res.status(404).json({ error: 'Supplier not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
