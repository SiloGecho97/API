const { Conference, Call, Bridge, OutGoing_Call } = require("../models");

function addCall(body) {
  return Call.create(body);
}
function addConference(body) {
  return Conference.create(body);
}

function updateConference(body, id, conference) {
  if (conference) {
    return conference.update(body);
  }
  return Conference.update(body, { where: { id } });
}
function getConference(query) {
  return Conference.findOne({ where: getConferenceWhere(query) });
}
function getConferenceById(id) {
  return Conference.findOne({ where: { id } });
}
function getCallById(callId) {
  return Call.findOne({ where: { callId } });
}

function updateCall(call, body) {
  return call.update(body);
}

function closeCall(id) {
  return Call.update(
    { status: "CLOSED", end_date: Date.now() },
    { where: { id } }
  );
}
/**
 * Build where clause for findOne
 * @param {*} query
 */
function getConferenceWhere(query) {
  let where = {};
  where["status"] = "WAITING";
  query.gender ? (where["gender"] = query.gender) : {};
  query.age ? (where["age"] = query.age) : {};
  query.language ? (where["language"] = query.language) : {};
  return where;
}

function addBridges(body) {
  return Bridge.create(body);
}
function closeBridge(body, id) {
  return Bridge.update(body, { where: { id } });
}
function addOutGoing(body) {
  return OutGoing_Call.create(body);
}
function closeOutGoing(body, callId) {
  return OutGoing_Call.update(body, { where: { callId } });
}
module.exports = {
  addCall,
  addConference,
  addBridges,
  closeBridge,
  updateConference,
  getCallById,
  updateCall,
  getConference,
  getConferenceById,
  closeCall,
  addOutGoing,
  closeOutGoing,
};
