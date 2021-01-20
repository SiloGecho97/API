module.exports = function (sequelize, DataTypes) {
    let bridge = sequelize.define(
      "bridges",
      {
        id: {
          primaryKey: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
        },
        callerId: {
          type: DataTypes.INTEGER(11),
          allowNull: false,
        },
        calleeId: {
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
          defaultValue:DataTypes.NOW
        },
        end_time:{
          type:DataTypes.DATE,
        }
      },
      {
        timestamps: false,
        freezeTableName: true,
        tableName: "bridges",
      }
    );
  
    return bridge;
  };
  