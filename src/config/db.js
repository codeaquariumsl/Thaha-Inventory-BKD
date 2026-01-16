const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'thaha_inventory',
  process.env.DB_USER || 'code_aqu_inv_user',
  process.env.DB_PASSWORD || 'asdhSFBJ@45gf5',
  {
    host: process.env.DB_HOST || 'codeaquariummysql.cpg6i88e4h6e.ap-south-1.rds.amazonaws.com',
    port: process.env.DB_PORT || 3307,
    dialect: 'mysql',
    logging: false,
    define: {
      freezeTableName: false,
      charset: 'utf8',
      dialectOptions: {
        collate: 'utf8_general_ci'
      },
      timestamps: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
