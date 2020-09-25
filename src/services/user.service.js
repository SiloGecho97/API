

const axios = require('axios');
const { User, RegStatus } = require('../models');

function addUser(body) {
  return User.create(body).catch((err) => console.log(err));
}

/**
 * 
 * @param {*} phoneNumber
 *  
 */
function getUserByPhone(phoneNumber) {
  return User.findOne({ where: { phoneNumber } }).catch(err => console.log(err));
}

function getStatusById(id) {
  return RegStatus.findOne({ where: { id } }).catch(err => console.log(err));
}

/**
 * 
 * @param {*} id
 * @returns user 
 */
function getUserById(id) {
  return User.findOne({ where: { id } }).catch(err => console.log(err));
}
/**
 * 
 * @param {*} user 
 * @param {*} body
 * @returns updated user 
 */
function updateUser(user, body) {
  return user.update(body).catch(err => console.log(err));
}


module.exports = {
  addUser,
  getUserByPhone,
  getStatusById,
  getUserById,
  updateUser,
};
