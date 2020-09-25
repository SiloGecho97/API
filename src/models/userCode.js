/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    let userCode = sequelize.define(
        "userCode",
        {
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "user",
                    key: "id",
                },
            },
            codeId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "userCode",
        }
    );

    return userCode;
};
