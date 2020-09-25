/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    let code = sequelize.define(
        "code",
        {
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
            },
            code: {
                type: DataTypes.STRING(5),
                allowNull: false,
            },
            isUsed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "code",
        }
    );

    return code;
};
