const sequelize = require('./sequelize');
require('../models');

async function initializeDatabase() {
  await sequelize.authenticate();
  await sequelize.sync();
}

module.exports = initializeDatabase;
