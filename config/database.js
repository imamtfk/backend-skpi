const { Sequelize } = require('sequelize');

// Env vars sudah di-load oleh server.js sebelum file ini di-require
// Tidak perlu dotenv di sini — Vercel set env vars lewat dashboard
const sequelize = new Sequelize(
  process.env.DB_NAME     || 'u430944314_Portal_db',
  process.env.DB_USER     || 'u430944314_Portal_db',
  process.env.DB_PASSWORD || process.env.DB_PASS || 'Qwertyop2026',
  {
    host:    process.env.DB_HOST || '153.92.15.31',
    dialect: 'mysql',
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
};

module.exports = { sequelize, connectDB };
