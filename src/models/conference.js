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
      status:{
          type:DataTypes.BOOLEAN,
          allowNull:false,
          defaultValue:0
      }
    },
    {
    //   timestamps: false,
      freezeTableName: true,
      tableName: "conference",
    }
  );

  return conference;
};
