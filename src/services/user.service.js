

const axios = require('axios');
const {  User, RegStatus } = require('../models');

function addUser(body) {
  return User.create(body).catch((err) => console.log(err));
}

function getAllMessages(offset, limit, date, message, phonenumber) {
  // console.log(message, phonenumber, moment(date).format('YYYY-MM-DD hh:mm:ss'), moment(date).add(24, 'hours').format('YYYY-MM-DD hh:mm:ss'));
  var dates = moment(date);
  var searchedDate = moment(date).format("YYYY-MM-DD");
  if (dates.isValid()) {
    return Message.findAndCountAll({
      where: {
        [Op.and]: [
          { message: { [Op.like]: "%" + message + "%" } },
          { phoneNumber: { [Op.like]: "%" + phonenumber + "%" } }
        ],
        createdAt: {
          [Op.gte]: searchedDate,
          [Op.lt]: moment(searchedDate)
            .add(24, "hours")
            .format("YYYY-MM-DD ")
        }
      },
      offset,
      limit,
      order: [["createdAt", "DESC"]]

    }).catch(err => console.log(err));
  } else {
    return Message.findAndCountAll({
      where: {
        [Op.and]: [
          { message: { [Op.like]: "%" + message + "%" } },
          { phoneNumber: { [Op.like]: "%" + phonenumber + "%" } }
        ]
      },
      offset,
      limit,
      order: [["createdAt", "DESC"]]
    }).catch(err => console.log(err));
  }
}

function getUserByPhone(phoneNumber) {
  User.findOne({ where: { phoneNumber } }).catch(err => console.log(err));
}
function getStatusById(id) {
  RegStatus.findOne({ where: { id } }).catch(err => console.log(err));
}

/**
 * 
 * @param {*} id
 * @returns user 
 */
function getUserById(id){
  User.findOne({where:{id}}).catch(err => console.log(err));
}
/**
 * 
 * @param {*} user 
 * @param {*} body
 * @returns updated user 
 */
function updateUser(user,body){
  user.update(body).catch(err => console.log(err));
}


module.exports = {
  addUser,
  getAllMessages,
  getUserByPhone,
  getStatusById,
  getUserById,
  updateUser,
};
