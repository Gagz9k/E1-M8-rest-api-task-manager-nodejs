const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('task_manager_db', 'postgres', 'tu_password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize;