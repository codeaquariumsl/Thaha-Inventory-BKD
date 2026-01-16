const app = require('./src/app');
const { sequelize } = require('./src/models');
const mysql = require('mysql2/promise');
require('dotenv').config();

const PORT = process.env.PORT || 5001;

async function startServer() {
    try {
        // Create DB if not exists
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'codeaquariummysql.cpg6i88e4h6e.ap-south-1.rds.amazonaws.com',
            port: process.env.DB_PORT || 3307,
            user: process.env.DB_USER || 'code_aqu_inv_user',
            password: process.env.DB_PASSWORD || 'asdhSFBJ@45gf5'
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'thaha_inventory'}\`;`);
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
