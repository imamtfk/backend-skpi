const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

let sequelize;
try {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'u430944314_Portal_db',
    process.env.DB_USER || 'u430944314_Portal_db',
    process.env.DB_PASSWORD || process.env.DB_PASS || 'Qwertyop2026',
    {
      host: process.env.DB_HOST || '153.92.15.31',
      dialect: 'mysql',
      logging: false,
    }
  );
} catch (err) {
  console.error("Sequelize Initialization Error:", err);
}

const connectDB = async () => {
  try {
    if (!sequelize) throw new Error("Sequelize not initialized.");
    await sequelize.authenticate();
    console.log('Database Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, connectDB };
