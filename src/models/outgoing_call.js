module.exports = function (sequelize, DataTypes) {
  let call = sequelize.define(
    "out_going_call",
    {
      callId: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
      },
      caller: {
        type: DataTypes.STRING,
      },
      callee: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("ACTIVE", "CLOSED"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      end_time: {
        type: DataTypes.DATE,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "out_going_call",
    }
  );

  return call;
};
