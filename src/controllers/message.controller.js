const userSerice = require("../services/user.service");

const moment = require("moment");

function checkUserByPhone(req, res, next) {
  const { phoneNumber } = req.query;
  checkUserHandler(
    phoneNumber || ""
  )
    .then(resp => res.status(200).send(resp))
    .catch(err => res.status(500).send({ message: err }));
}

async function checkUserHandler(phoneNumber) {
  const user = await userSerice.getUserByPhone(phoneNumber);
  if (user) {
    const userStatus = await userSerice.getStatusById(user.regStatus)
    return { status: userStatus.status, id: user.id }
  } else {
    const createUser = await userSerice.addUser({ phoneNumber: phoneNumber })
    if (!createUser) {
      throw "Failed to create User"
    }
    return { status: "NEW", id: createUser.id }
  }
}

function updateLangauge(req, res, next) {
  const { id, languageId } = req.body;
  if (!id || !languageId) {
    return res.status(200).send("Invalid Request")
  }
  updateLangaugeHandler(
    req.body
  )
    .then(resp => res.status(200).send(resp))
    .catch(err => res.status(500).send({ message: err }));
}

async function updateLangaugeHandler(body) {
  const user = await userSerice.getUserById(body.id);
  if (user) {
    const updateUser = await userSerice.updateUser(user, { languageId: body.languageId })
    if (updateUser) {
      const updateStatus = await userSerice.updateUser(user, { regStatus: 2 })
      if (updateStatus) {
         return { success: true, status: "LANGUAGE" }
      }
    }
  }
  return { success: false, status: 'LANGUAGE' }
}

function updateSex(req, res, next) {
  const { id, sexId } = req.body;
  if (!id || !sexId) {
    return res.status(200).send("Invalid Request")
  }
  updateSexHandler(
    req.body
  )
    .then(resp => res.status(200).send(resp))
    .catch(err => res.status(500).send({ message: err }));
}

async function updateSexHandler(body) {
  const user = await userSerice.getUserById(body.id);
  if (user) {
    const updateUser = await userSerice.updateUser(user, { sexId: body.sexId })
    if (updateUser) {
      const updateStatus = await userSerice.updateUser(user, { regStatus: 3 })
      return { success: true, status: "SEX" }
    }
  }
  return { success: false, status: 'SEX' }
}


function updateAge(req, res, next) {
  const { id, ageRangeId } = req.body;
  if (!id || !ageRangeId) {
    return res.status(200).send("Invalid Request")
  }
  updateAgeHandler(
    req.body
  )
    .then(resp => res.status(200).send(resp))
    .catch(err => res.status(500).send({ message: err }));
}

async function updateAgeHandler(body) {
  const user = await userSerice.getUserById(body.id);
  if (user) {
    const updateUser = await userSerice.updateUser(user, { ageRengId: body.ageRangeId })
    if (updateUser) {
      const updateStatus = await userSerice.updateUser(user, { regStatus: 4 })
      return { success: true, status: "AGE" }
    }
  }
  return { success: false, status: 'AGE' }
}

module.exports = {
  checkUserByPhone,
  updateLangauge,
  updateSex,
  updateAge
};
