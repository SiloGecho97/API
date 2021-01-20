/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    let code = sequelize.define(
        "code",
        {
            
            code: {
                primaryKey: true,
                type: DataTypes.STRING(7),
                allowNull: false,
            },
            isUsed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue:0
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
