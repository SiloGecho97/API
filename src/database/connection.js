const Sequelize = require("sequelize");

const sequelize = new Sequelize("chatdb", "root", "password", {
  host: "192.168.0.10",
  dialect: "mysql",
  logging: false,
  timezone: '+03:00',
  logging:console.log,
  pool: {
    max: 500,
    min: 30,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;

