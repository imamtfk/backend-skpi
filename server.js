const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { sequelize, connectDB } = require('./config/database');

// Import models before routes so they register with Sequelize
require('./models/User');
require('./models/SkpiCategory');
require('./models/SkpiSubmission');
require('./models/Absensi');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.get('/api/ping', (req, res) => res.json({ status: 'ok', message: 'Vercel is alive!' }));

const skpiRoutes = require('./routes/skpiRoutes');
const absensiRoutes = require('./routes/absensiRoutes');
app.use('/api', skpiRoutes);
app.use('/api', absensiRoutes);

// Vercel Serverless Export
if (process.env.VERCEL) {
  // VERCEL: Do not run background tasks (like sync) during cold start.
  // It causes random FUNCTION_INVOCATION_FAILED errors due to race conditions.
  module.exports = app;
} else {
  // LOCAL ENVIRONMENT
  const runSeeders = async () => {
    try {
      const seedCategories = require('./seeders/categorySeeder');
      const seedUsers = require('./seeders/userSeeder');
      const seedSubmissions = require('./seeders/submissionSeeder');
      await seedCategories();
      await seedUsers();
      const SkpiSubmission = require('./models/SkpiSubmission');
      const submissionCount = await SkpiSubmission.count();
      if (submissionCount === 0) await seedSubmissions();
    } catch(e) {}
  };

  const startServer = async () => {
    await connectDB();
    try {
      await sequelize.sync({ force: false });
      console.log('Database synced successfully.');
      await runSeeders();
    } catch (error) {
      console.error('Error syncing database:', error);
    }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  };
  startServer();
}
