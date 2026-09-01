const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// ============================================
// CORS - Allow all origins (critical for Vercel)
// ============================================
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ============================================
// Import models (register with Sequelize)
// ============================================
require('./models/User');
require('./models/SkpiCategory');
require('./models/SkpiSubmission');
require('./models/Absensi');

// ============================================
// Routes
// ============================================
app.get('/api/ping', (req, res) => res.json({ status: 'ok', message: 'Vercel backend is alive!' }));

const skpiRoutes = require('./routes/skpiRoutes');
const absensiRoutes = require('./routes/absensiRoutes');
app.use('/api', skpiRoutes);
app.use('/api', absensiRoutes);

// ============================================
// Vercel: export app directly (no server.listen)
// Local: start server normally
// ============================================
if (process.env.VERCEL) {
  module.exports = app;
} else {
  const { sequelize, connectDB } = require('./config/database');

  const runSeeders = async () => {
    try {
      const seedCategories = require('./seeders/categorySeeder');
      const seedUsers = require('./seeders/userSeeder');
      const seedSubmissions = require('./seeders/submissionSeeder');
      await seedCategories();
      await seedUsers();
      const SkpiSubmission = require('./models/SkpiSubmission');
      const count = await SkpiSubmission.count();
      if (count === 0) await seedSubmissions();
    } catch (e) { console.error('Seeder error:', e.message); }
  };

  const startServer = async () => {
    await connectDB();
    try {
      await sequelize.sync({ force: false });
      console.log('Database synced.');
      await runSeeders();
    } catch (err) {
      console.error('Sync error:', err.message);
    }
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  };

  startServer();
}
