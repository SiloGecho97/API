/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  let regStatus = sequelize.define(
    "regStatus",
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      status: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "regStatus",
    }
  );

  return regStatus;
};
