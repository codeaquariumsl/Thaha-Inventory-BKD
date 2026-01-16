const { sequelize, models } = require('../models');
const { StockMovement, Product } = models;

exports.createStockMovement = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const movement = await StockMovement.create(req.body, { transaction: t });

        // Update Product Stock
        const product = await Product.findByPk(movement.productId, { transaction: t });
        if (product) {
            let newStock = product.stockQuantity;
            if (movement.movementType === 'IN') {
                newStock += movement.quantity;
            } else if (movement.movementType === 'OUT') {
                newStock -= movement.quantity;
            } else if (movement.movementType === 'ADJ') {
                // Adjustment logic depends. Usually ADJ means "Add/Subtract" or "Set to". 
                // FRD: "Stock In", "Stock Out", "Adjustment".
                // If ADJ is treated as a delta, we might need a sign or direction. Here assuming quantity handles direction or ADJ is absolute?
                // Simplest: IN adds, OUT subtracts. ADJ adds (can be negative).
                // Let's assume quantity is positive and type dictates.
                // For ADJ, if it's correction, user might put +5 or -5. 
                // Let's assume ADJ adds the signed quantity. Or better, check if quantity is signed.
                // FRD doesn't specify. I'll assume ADJ treats quantity as a signed delta.
                newStock += movement.quantity;
            }

            await product.update({ stockQuantity: newStock }, { transaction: t });
        }

        await t.commit();
        res.status(201).json(movement);
    } catch (error) {
        await t.rollback();
        res.status(400).json({ error: error.message });
    }
};

exports.getAllStockMovements = async (req, res) => {
    try {
        const movements = await StockMovement.findAll({
            include: [{ model: Product }, { model: models.User, attributes: ['username'] }],
            order: [['date', 'DESC']]
        });
        res.status(200).json(movements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
