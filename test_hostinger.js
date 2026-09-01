const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'u430944314_Portal_db',
  'u430944314_Portal_db',
  'Qwertyop2026',
  {
    host: '153.92.15.31', // From the user's screenshot
    dialect: 'mysql',
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('Success connecting to Hostinger!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed to connect:', err);
    process.exit(1);
  });
