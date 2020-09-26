const sequelize = require("../database/connection");


const Code = sequelize.import("./code.js");
const Sex = sequelize.import("./sex.js");
const Friend = sequelize.import("./friend.js")
const User = sequelize.import("./user.js");

const UserCode = sequelize.import("./userCode.js");

const RegStatus = sequelize.import("./regStatus.js");
const Language = sequelize.import("./language.js");
const AgeRange = sequelize.import("./ageRange.js");

module.exports = {
  User,
  UserCode,
  Code,
  Sex,
  Language,
  RegStatus,
  AgeRange,
  Friend
};
