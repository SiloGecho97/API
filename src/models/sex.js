/* jshint indent: 2 */
const moment = require("moment");

module.exports = function (sequelize, DataTypes) {
  let sex = sequelize.define(
    "sex",
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      sex: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      remark: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
    },
    {
      tableName: "sex",
    }
  );

  return sex;
};
