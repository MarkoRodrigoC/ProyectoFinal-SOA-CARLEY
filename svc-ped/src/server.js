const app = require('./app');
const env = require('./config/env');
const initializeDatabase = require('./database/initializeDatabase');

initializeDatabase()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`SVC-PED listening on port ${env.port}`);
    });
  })
  .catch((error) => {
    console.error('SVC-PED database initialization failed:', error);
    process.exit(1);
  });
