const axios = require("axios");
const {
  User,
  RegStatus,
  Sex,
  Language,
  AgeRange,
  Friend,
} = require("../models");

const Sequelize = require("sequelize");
const { Op } = require("sequelize");
function addUser(body) {
  return User.create(body).catch((err) => console.log(err));
}

/**
 *
 * @param {*} phoneNumber
 *
 */
function getUserByPhone(phoneNumber) {
  return User.findOne({ where: { phoneNumber } }).catch((err) =>
    console.log(err)
  );
}

function getStatusById(id) {
  return RegStatus.findOne({ where: { id } }).catch((err) => console.log(err));
}

/**
 *
 * @param {*} id
 * @returns user
 */
function getUserById(id) {
  return User.findOne({ where: { id } }).catch((err) => console.log(err));
}
/**
 *
 * @param {*} user
 * @param {*} body
 * @returns updated user
 */
function updateUser(user, body) {
  return user.update(body).catch((err) => console.log(err));
}

/**
 * Get Sex by Sex Id
 * @param {*} id
 */
function getSexById(id) {
  return Sex.findOne({ where: { id } }).catch((err) => console.log(err));
}
/**
 * Get Status By Id
 * @param {*} id
 */
function getRegStatusById(id) {
  return RegStatus.findOne({ where: { id } }).catch((err) => console.log(err));
}
function getLanguageById(id) {
  return Language.findOne({ where: { id } }).catch((err) => console.log(err));
}
function getAgeById(id) {
  return AgeRange.findOne({ where: { id } }).catch((err) => console.log(err));
}

function addFriend(body) {
  return Friend.create(body);
}

function getOneFriend(id,ids) {
  return Friend.findAll({
    where: { userId: id, friendId: { [Op.notIn]: ids } },
    order: Sequelize.literal("rand()"),
    limit: 1,
  });
}

function getOneUser() {
  return User.findAll({ order: Sequelize.literal("rand()"), limit: 1 });
}

function getOneUserNext(ids) {
  return User.findAll({
    attributes: ['id', 'phoneNumber','sexId','ageRengId'],
    where: { id: { [Op.notIn]: ids } },
    order: Sequelize.literal("rand()"),
    limit: 1,
  });
}

module.exports = {
  addUser,
  addFriend,
  getUserByPhone,
  getStatusById,
  getUserById,
  updateUser,
  getSexById,
  getAgeById,
  getLanguageById,
  getRegStatusById,
  getOneFriend,
  getOneUser,
  getOneUserNext
};
