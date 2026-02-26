const { Op } = require('sequelize');

/**
 * Generates a unique sequence number for orders, deliveries, or invoices.
 * Format: [Prefix][YYMMDD][Sequence] (e.g., SYYMMDD001)
 * 
 * @param {Object} model - The Sequelize model to search in
 * @param {string} prefix - The character prefix (S, D, I)
 * @param {string} fieldName - The model field name for the generated number
 * @returns {Promise<string>} - The generated sequence number
 */
const generateSequenceNumber = async (model, prefix, fieldName) => {
    const today = new Date();
    const yy = String(today.getFullYear()).slice(-2);
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const datePart = `${yy}${mm}${dd}`;
    const searchPrefix = `${prefix}${datePart}`;

    // Find the record with the highest sequence number for today
    const lastRecord = await model.findOne({
        where: {
            [fieldName]: {
                [Op.like]: `${searchPrefix}%`
            }
        },
        order: [['createdAt', 'DESC']],
        attributes: [fieldName]
    });

    let nextSequence = 1;
    if (lastRecord && lastRecord[fieldName]) {
        // Extract the sequence part (after the prefix and datePart)
        const lastNumber = lastRecord[fieldName];
        const sequencePart = lastNumber.substring(searchPrefix.length);
        const lastSequence = parseInt(sequencePart, 10);
        if (!isNaN(lastSequence)) {
            nextSequence = lastSequence + 1;
        }
    }

    // Format the next sequence with 3 digits padding
    const nextSequenceStr = String(nextSequence).padStart(3, '0');
    return `${searchPrefix}${nextSequenceStr}`;
};

module.exports = {
    generateSequenceNumber,
};
