const callService = require("../services/call.service");
const userService = require("../services/user.service");

function updateUserOncall(req, res, next) {
  updateUseronCallHandler(req.params.id)
    .then((data) =>
      data ? res.status(200).send(true) : res.status(400).send(false)
    )
    .catch((err) => res.status(500).send(false));
}

async function updateUseronCallHandler(id) {
  const user = userService.updateUser(user, { isOnCall: true });
  if (user) {
    return true;
  }
}

function addConference(req, res, next) {
  addConferenceHandler(req.body)
    .then((data) =>
      data ? res.status(200).send(true) : res.status(400).send(false)
    )
    .catch((err) => res.status(500).send(err));
}

async function addConferenceHandler(body) {
  const conference = await callService.addConference(body);
  if (conference) {
    return conference;
  }
}

function addCall(req, res, next) {
  addCallHandler(req.body)
    .then((data) =>
      data ? res.status(200).send(true) : res.status(400).send(false)
    )
    .catch((err) => res.status(500).send(err));
}

async function addCallHandler(body) {
  const call = await callService.addCall(body);
  if (call) {
    return call;
  }
}

module.exports = {
  updateUserOncall,
  addConference,
  addCall,
};
