module.exports = function (sequelize, DataTypes) {
  let conference = sequelize.define(
    "conference",
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      callId1: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      callId2: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      gender: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      age: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      language: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("WAITING", "OCCUPIED", "CLOSED"),
        allowNull: false,
        defaultValue: "WAITING",
      },
      start_time:{
        type:DataTypes.DATE,
        allowNull:true,
        defaultValue:sequelize.NOW
      },
      end_time:{
        type:DataTypes.DATE,
      }
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "conference",
    }
  );

  return conference;
};
