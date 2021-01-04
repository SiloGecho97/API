module.exports = function (sequelize, DataTypes) {
    let bridge = sequelize.define(
      "bridge",
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
        status: {
          type: DataTypes.ENUM("ACTIVE", "CLOSED"),
          allowNull: false,
          defaultValue: "ACTIVE",
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
        tableName: "bridge",
      }
    );
  
    return bridge;
  };
  