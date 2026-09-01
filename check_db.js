const { sequelize } = require('./config/database');
const SkpiSubmission = require('./models/SkpiSubmission');
const User = require('./models/User');

async function run() {
  await sequelize.authenticate();
  const count = await SkpiSubmission.count({ where: { user_id: 1 } });
  console.log('User 1 submissions:', count);
  const subs = await SkpiSubmission.findAll({ raw: true });
  console.log('All Submissions:', subs);
  process.exit(0);
}
run();
