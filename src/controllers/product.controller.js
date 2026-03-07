const { models } = require('../models');
const { Product, Supplier, Category, Color } = models;

const colorInclude = { model: Color, as: 'Colors' };

exports.createProduct = async (req, res) => {
    try {
        const { colorIds, ...productData } = req.body;
        const product = await Product.create(productData);

        if (colorIds && Array.isArray(colorIds)) {
            await product.setColors(colorIds);
        }

        const createdProduct = await Product.findByPk(product.id, { include: [Supplier, Category, colorInclude] });
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const { Op } = require('sequelize');

exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';
        const categoryId = req.query.categoryId || '';
        const type = req.query.type || '';

        const where = {};
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { sku: { [Op.like]: `%${search}%` } }
            ];
        }
        if (categoryId && categoryId !== 'all') {
            where.categoryId = categoryId;
        }
        if (type) {
            where.type = type;
        }

        const { count, rows } = await Product.findAndCountAll({
            where,
            include: [
                { model: Supplier },
                { model: Category },
                colorInclude
            ],
            distinct: true,
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            data: rows,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, { include: [Supplier, Category, colorInclude] });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { colorIds, ...productData } = req.body;
        await Product.update(productData, {
            where: { id: req.params.id }
        });

        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        if (colorIds && Array.isArray(colorIds)) {
            await product.setColors(colorIds);
        }

        const updatedProduct = await Product.findByPk(req.params.id, { include: [Supplier, Category, colorInclude] });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) return res.status(404).json({ error: 'Product not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
