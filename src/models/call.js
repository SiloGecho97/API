

module.exports = function (sequelize, DataTypes) {
    let call = sequelize.define(
        "call",
        {
            id: {
                primaryKey: true,
                type: DataTypes.STRING,
                allowNull: false,
                autoIncrement: true,
            },
            callId: {
                unique: true,
                type: DataTypes.STRING,
                allowNull: false,
            },
            start_date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.NOW
            },
            end_date: {
                type: DataTypes.DATE,
            },
            userId: {
                type: DataTypes.INTEGER(11)
            },
            status: {
                type: DataTypes.ENUM("ACTIVE", "CLOSED"),
                allowNull: false,
                defaultValue: "ACTIVE",
            },
            deletedAt: {
                type: DataTypes.DATE,
            }
        },
        {

            freezeTableName: true,
            tableName: "call_log",
        }
    );

    return call;
};