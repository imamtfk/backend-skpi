const express = require('express');
const cors = require('cors');

const app = express();

// CORS
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Models & Routes
require('./models/User');
require('./models/SkpiCategory');
require('./models/SkpiSubmission');
require('./models/Absensi');

const skpiRoutes = require('./routes/skpiRoutes');
const absensiRoutes = require('./routes/absensiRoutes');
app.use('/api', skpiRoutes);
app.use('/api', absensiRoutes);

// Export untuk Vercel & Local
module.exports = app;

// Hanya jalankan server.listen jika file ini dijalankan langsung (bukan di-require)
if (require.main === module) {
  try { require('dotenv').config(); } catch(e) {}
  const { sequelize, connectDB } = require('./config/database');

  const runSeeders = async () => {
    try {
      await require('./seeders/categorySeeder')();
      await require('./seeders/userSeeder')();
      const SkpiSubmission = require('./models/SkpiSubmission');
      if (await SkpiSubmission.count() === 0) await require('./seeders/submissionSeeder')();
    } catch (e) { console.error('Seeder error:', e.message); }
  };

  (async () => {
    await connectDB();
    await sequelize.sync({ force: false }).catch(console.error);
    await runSeeders();
    app.listen(process.env.PORT || 5000, () =>
      console.log('Server running on port', process.env.PORT || 5000)
    );
  })();
}
