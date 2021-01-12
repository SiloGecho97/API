

module.exports = function (sequelize, DataTypes) {
    let call = sequelize.define(
        "call",
        {
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
            },
            
            start_date:{
                type:DataTypes.DATE,
                allowNull:false,
                defaultValue:sequelize.NOW
            },
            end_date:{
                type:DataTypes.DATE,
            },
            userId:{
                type:DataTypes.INTEGER(11)
            },
            uuid:{
                type:DataTypes.UUID,
                defaultValue: DataTypes.UUIDV1,
                unique:true
            },
            status: {
                type: DataTypes.ENUM("ACTIVE", "CLOSED"),
                allowNull: false,
                defaultValue: "ACTIVE",
              },
            deletedAt:{
                type:DataTypes.DATE,
            }
        },
        {
           
            freezeTableName: true,
            tableName: "call_log",
        }
    );

    return call;
};