const app = require('./src/app');
const { sequelize, models } = require('./src/models');
require('dotenv').config();

const PORT = process.env.PORT || 5001;

// Helper: add a column if it doesn't exist
async function addColumnIfNotExists(table, column, definition) {
    try {
        await sequelize.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition};`);
        console.log(`✅ Added column: ${table}.${column}`);
    } catch (err) {
        if (err.parent?.code === 'ER_DUP_FIELDNAME') {
            // Column already exists — that's fine
        } else {
            console.error(`Error adding ${table}.${column}:`, err.parent?.sqlMessage || err.message);
        }
    }
}

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Add colorId to item tables (safe — skips if already exists)
        // await addColumnIfNotExists('salesorderitems', 'colorId', 'INTEGER NULL');
        // await addColumnIfNotExists('invoiceitems', 'colorId', 'INTEGER NULL');

        console.log('Database synced.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
    }
}

startServer();
