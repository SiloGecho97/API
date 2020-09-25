/* jshint indent: 2 */
const moment = require("moment");

module.exports = function (sequelize, DataTypes) {
  let language = sequelize.define(
    "language",
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      language: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      remark: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
    },
    {
      tableName: "language",
    }
  );

  return language;
};
