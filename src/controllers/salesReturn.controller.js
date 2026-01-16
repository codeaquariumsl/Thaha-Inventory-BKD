const { models } = require('../models');
const { SalesReturn, Invoice } = models;

exports.createSalesReturn = async (req, res) => {
    try {
        const salesReturn = await SalesReturn.create(req.body);
        res.status(201).json(salesReturn);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllSalesReturns = async (req, res) => {
    try {
        const returns = await SalesReturn.findAll({
            include: [{ model: Invoice }]
        });
        res.status(200).json(returns);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSalesReturnById = async (req, res) => {
    try {
        const salesReturn = await SalesReturn.findByPk(req.params.id, {
            include: [{ model: Invoice }]
        });
        if (!salesReturn) return res.status(404).json({ error: 'Sales Return not found' });
        res.status(200).json(salesReturn);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSalesReturn = async (req, res) => {
    try {
        const [updated] = await SalesReturn.update(req.body, {
            where: { id: req.params.id }
        });
        if (!updated) return res.status(404).json({ error: 'Sales Return not found' });
        const salesReturn = await SalesReturn.findByPk(req.params.id);
        res.status(200).json(salesReturn);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
