const { models } = require('../models');
const { Color } = models;

exports.createColor = async (req, res) => {
    try {
        const color = await Color.create(req.body);
        res.status(201).json(color);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllColors = async (req, res) => {
    try {
        const colors = await Color.findAll();
        res.status(200).json(colors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getColorById = async (req, res) => {
    try {
        const color = await Color.findByPk(req.params.id);
        if (!color) return res.status(404).json({ error: 'Color not found' });
        res.status(200).json(color);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateColor = async (req, res) => {
    try {
        const [updated] = await Color.update(req.body, {
            where: { id: req.params.id }
        });
        if (!updated) return res.status(404).json({ error: 'Color not found' });
        const color = await Color.findByPk(req.params.id);
        res.status(200).json(color);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteColor = async (req, res) => {
    try {
        const deleted = await Color.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) return res.status(404).json({ error: 'Color not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
