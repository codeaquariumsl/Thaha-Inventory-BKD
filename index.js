const app = require('./src/app');
const { sequelize } = require('./src/models');
const mysql = require('mysql2/promise');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // Create DB if not exists
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        await connection.end();

        // Sync Sequelize
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Sync models
        await sequelize.sync({ alter: true });
        console.log('Database synced.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
    }
}

startServer();
