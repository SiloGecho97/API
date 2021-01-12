module.exports = function (sequelize, DataTypes) {
  let conference = sequelize.define(
    "conference",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        autoIncrement: true,
      },
      userId_1: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      userId_2: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      gender: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        defaultValue:3,
      },
      age: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        defaultValue:5,
      },
      language: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        defaultValue:10,
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
