const { sequelize } = require('./config/database');
const Absensi = require('./models/Absensi');

const checkDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('Tables:', tables);

    if (tables.includes('absensi')) {
      console.log('absensi table exists!');
      const data = await Absensi.findAll();
      console.log('Absensi data:', data);
    } else {
      console.log('absensi table DOES NOT EXIST. Syncing...');
      await sequelize.sync();
      console.log('Database synced.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    process.exit();
  }
};

checkDb();
