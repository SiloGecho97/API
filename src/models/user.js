/* jshint indent: 2 */


module.exports = function (sequelize, DataTypes) {
 
  let user = sequelize.define(
    "user",
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      phoneNumber: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      preferredLanguageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:10
      },
      preferredSexId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 3,
      },
      preferredAgeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 5,
      },
      regStatus: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      isOnCall: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      isAgreedToTerms: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      isProfileValied: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      profileAudio:{
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      languageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "language",
          key: "id",
        },
      },
      sexId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "sex",
          key: "id",
        },
      },
      ageRengId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "ageRange",
          key: "id",
        },
      },
      
    },{
      timestamps: false,
      freezeTableName: true
    },
    {
      tableName: "user",
     
    }
  );

  return user;
};
