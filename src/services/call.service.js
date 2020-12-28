const { Conference,Call } = require("../models");

function addCall(body){
    return Call.create(body)
}
function addConference(body) {
  return Conference.create(body);
}

function updateConference(body, id) {
  return Conference.update(body, { where: { id } });
}

module.exports = {
    addCall,
  addConference,
  updateConference,
};
