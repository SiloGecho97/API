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
  let changedPhone = changePhoneNumber(phoneNumber);
  if (!changedPhone) {
    throw "invalid phoneNumber";
  }
  if (isNaN(changedPhone) || changedPhone.length != 10) {
    throw "invalid phoneNumber";
  }
  const user = await userSerice.getUserByPhone(changedPhone);
  if (user) {
    const userStatus = await userSerice.getStatusById(user.regStatus)
    return { success: true, status: userStatus.status, id: user.id }
  } else {
    const createUser = await userSerice.addUser({ phoneNumber: changedPhone })
    if (!createUser) {
      return { success: false, status: "NEW", id: user.id }
    }
    return { success: true, status: "NEW", id: createUser.id }
  }
}

function changePhoneNumber(phoneNumber) {
  if (phoneNumber.startsWith("0")) {
    return phoneNumber;
  } else if (phoneNumber.startsWith("251")) {
    return "0" + phoneNumber.substr(3, 12);
  } else if (phoneNumber.startsWith('+251')) {
    return "0" + phoneNumber.substr(4, 12);
  } else if (phoneNumber.startsWith(' 251')) {
    return "0" + phoneNumber.substr(4, 12);
  } else if (phoneNumber.startsWith('9')) {
    return "0" + phoneNumber;
  } else {
    return false;
  }
}

function updateLangauge(req, res, next) {
  console.log(req.body)
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
    return res.status(400).send("Invalid Request")
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
    const sexcheck = await userSerice.getSexById(body.sexId);
    if (!sexcheck) {
      throw "Invalid sex Id"
    }
    const updateUser = await userSerice.updateUser(user, { sexId: body.sexId })
    if (updateUser) {
      const updateStatus = await userSerice.updateUser(user, { regStatus: 3 })
      return { success: true, status: "SEX" }
    }
  }
  return { success: false, status: 'SEX' }
}


function updateAge(req, res, next) {
  console.log(req.body)
  const { id, ageRangeId } = req.body;
  if (!id || !ageRangeId) {
    return res.status(400).send("Invalid Request")
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

function updateRegStatus(req, res, next) {
  console.log(req.body)
  const { id, regStatus } = req.body;
  if (!id || !regStatus) {
    return res.status(400).send("Invalid Request")
  }
  updateRegStatusHandler(
    req.body
  )
    .then(resp => res.status(200).send(resp))
    .catch(err => res.status(500).send({ message: err }));
}

async function updateRegStatusHandler(body) {
  const user = await userSerice.getUserById(body.id);
  const regStatus = await userSerice.getRegStatusById(body.regStatus)
  if (user && regStatus) {
    const updateUser = await userSerice.updateUser(user, { regStatus: body.regStatus })
    if (updateUser) {
      return { success: true, status: regStatus.status }
    }
  }
  return { success: false, status: regStatus.status }
}

function updateIsAgree(req, res, next) {
  console.log(req.body)
  const { id, agree } = req.body;
  if (!id || !agree) {
    return res.status(400).send("Invalid Request")
  }
  updateIsAgreeHandler(
    req.body
  )
    .then(resp => res.status(200).send(resp))
    .catch(err => res.status(500).send({ message: err }));
}

async function updateIsAgreeHandler(body) {
  const user = await userSerice.getUserById(body.id);
  if (user) {
    if (body.agree) {
      const updateUser = await userSerice.updateUser(user, { isAgreedToTerms: 1, regStatus: 10 })
      return { success: true, status: 'AGREED' }
    }
  }
  return { success: false, status: 'AGREED' }
}

function updateIsAvailable(req, res, next) {
  console.log(req.body)
  const { id, available } = req.body;
  if (!id || !available) {
    return res.status(400).send("Invalid Request")
  }
  updateIsAvailableHandler(
    req.body
  )
    .then(resp => res.status(200).send(resp))
    .catch(err => res.status(500).send({ message: err }));
}

async function updateIsAvailableHandler(body) {
  const user = await userSerice.getUserById(body.id);
  if (user) {
    if (body.available || body.available == 1) {
      const updateUser = await userSerice.updateUser(user, { isAvailable: 1 });
      if (updateUser) {
        return { success: true, isAvailable: true }
      }
    } else if (!body.available || body.available == 0) {
      const updateUser = await userSerice.updateUser(user, { isAvailable: 0 })
      if (updateUser) {
        return { success: false, isAvailable: false }
      }
    }
  }
  return { success: false, isAvaliable: user.isAvaliable ? true : false }
}
function updateIsOnCall(req, res, next) {
  console.log(req.body)
  const { id, onCall } = req.body;
  if (!id || !onCall) {
    return res.status(400).send("Invalid Request")
  }
  updateIsOnCallHadler(
    req.body
  )
    .then(resp => res.status(200).send(resp))
    .catch(err => res.status(500).send({ message: err }));
}

async function updateIsOnCallHadler(body) {
  const user = await userSerice.getUserById(body.id);
  if (user) {
    if (body.onCall || body.onCall == 1) {
      const updateUser = await userSerice.updateUser(user, { isOnCall: 1 });
      if (updateUser) {
        return { success: true, isOnCall: true }
      }
    } else if (!body.onCall || body.onCall == 0) {
      const updateUser = await userSerice.updateUser(user, { isOnCall: 0 });
      if (updateUser) {
        return { success: true, isOnCall: false }
      }
    }
  }
  return { success: false, isOnCall: user.isOnCall ? true : false }
}

function checkAvailable(req, res, next) {
  checkAvailableHandler(req.params.id
  )
    .then(resp => res.status(200).send(resp))
    .catch(err => res.status(500).send({ message: err }));
}

async function checkAvailableHandler(id) {
  const user = await userSerice.getUserById(id);
  if (user) {
    return { success: true, isAvailable: user.isAvailable ? true : false }
  }
  return { success: false }
}

function checkOnCall(req, res, next) {
  checkOnCallHandler(req.params.id
  )
    .then(resp => res.status(200).send(resp))
    .catch(err => res.status(500).send({ message: err }));
}

async function checkOnCallHandler(id) {
  const user = await userSerice.getUserById(id);
  if (user) {
    return { success: true, isOnCall: user.isOnCall ? true : false }
  }
  return { success: false }
}
function getPreffered(req, res, next) {
  getPrefferedHandler(req.params.id
  )
    .then(resp => res.status(200).send(resp))
    .catch(err => res.status(500).send({ message: err }));
}

async function getPrefferedHandler(id) {
  const user = await userSerice.getUserById(id);
  if (user) {
    return { success: true, preferredSexId: user.preferredSexId, preferredAgeId: user.preferredAgeId, preferredLanguageId: user.preferredLanguageId }
  }
  return { success: false }
}

function updateUserPreffered(req, res, next) {
  const { id } = req.body;
  if (!id) {
    return res.status(400).send("Invalid Request")
  }
  updateUserPrefferedHandler(req.body
  )
    .then(resp => res.status(200).send(resp))
    .catch(err => res.status(500).send({ message: err }));
}

async function updateUserPrefferedHandler(body) {
  const user = await userSerice.getUserById(body.id);
  if (user) {
    if (body.languageId) {
      const lang = await userSerice.getLanguageById(body.languageId)
      if (lang) {
        const updateUser = await userSerice.updateUser(user, { preferredLanguageId: body.languageId });
        if (updateUser) return { success: true, preferredLanguageId: body.languageId }
      }
    }
    else if (body.sexId) {
      const sex = await userSerice.getSexById(body.sexId)
      if (sex) {
        const updateUser = await userSerice.updateUser(user, { preferredSexId: body.sexId });
        if (updateUser) return { success: true, preferredSexId: body.sexId }
      }
    } else if (body.ageRangeId) {
      const age = await userSerice.getAgeById(boyd.ageRangeId);
      if (age) {
        const updateUser = await userSerice.updateUser(user, { preferredAgeId: body.ageRangeId });
        if (updateUser) return { success: true, preferredAgeId: body.ageRangeId }
      }
    }
    return { success: false, preferredSexId: user.preferredSexId, preferredAgeId: user.preferredAgeId, preferredLanguageId: user.preferredLanguageId }
  }
  return { success: false }
}


module.exports = {
  checkUserByPhone,
  updateLangauge,
  updateSex,
  updateAge,
  updateRegStatus,
  updateIsAgree,
  updateIsAvailable,
  updateIsOnCall,
  checkAvailable,
  checkOnCall,
  getPreffered,
  updateUserPreffered
};
