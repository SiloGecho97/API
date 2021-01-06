const callService = require("../services/call.service");
const userService = require("../services/user.service");
const {
  holdResource,
  releaseResource,
  deleteCallCache,
} = require("./redis.controller");

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
      data ? res.status(200).send(data) : res.status(400).send(false)
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
    const user = userService.updateUser(user, { isOnCall: true });
    holdResource();
    return call;
  }
}

function closeCall(req, res, next) {
  closeCallHandler(req.params.id)
    .then((data) =>
      data ? res.status(200).send(true) : res.status(400).send(false)
    )
    .catch((err) => next(err));
}

async function closeCallHandler(id) {
  const call = await callService.getCallById(id);
  if(call){
    const update = await callService.updateCall(call,
      { status: "CLOSED", end_date: Date.now() }
    );
    if (call) {
      releaseResource();
      //Delete Main user cache
      //delete if it have suspedent user 
      deleteCallCache(`oncall:${call.userId}`);
      return call;
    }
  }
 
}

function getConference(req, res, next) {
  getConferenceHandler(req.query)
    .then((data) => {
      data ? res.status(200).send(data) : res.status(400).send(false);
    })
    .catch((err) => res.status(500).send(err));
}

async function getConferenceHandler(query) {
  const conference = await callService.getConference(query);
  return conference;
}

function occupyConference(req, res, next) {
  occupyConferenceHandler(req.query)
    .then((data) => {
      data ? res.status(200).send(data) : res.status(400).send(false);
    })
    .catch((err) => res.status(500).send(err));
}

async function occupyConferenceHandler(query) {
  const conference = await callService.updateConference(
    {
      status: "OCCUPIED",
      callId2: query.callId,
    },
    query.id
  );
  if (conference) {
    return conference;
  }
}

function closeConference(req, res, next) {
  closeConferenceHandler(req.body)
    .then((data) => {
      data ? res.status(200).send(data) : res.status(400).send(false);
    })
    .catch((err) => next(err));
}

async function closeConferenceHandler(body) {
  // console.log(body);
  const conference = await callService.updateConference(
    {
      status: "CLOSED",
      end_time: Date.now(),
    },
    body.id
  );

  if (conference) {
    const call = await callService.closeCall(
      body.callId
    );
    releaseResource();
    return conference;
  }
}

function endConference(req, res, next) {
  endConferenceHandler(req.body)
    .then((data) => {
      data ? res.status(200).send(data) : res.status(400).send(false);
    })
    .catch((err) => next(err));
}
async function endConferenceHandler(body) {
  // console.log(body);
  const conference = await callService.updateConference(
    {
      status: "CLOSED",
      end_time: Date.now(),
    },
    body.id
  );
  if (conference) {
    return conference;
  }
}
function addBridge(req, res, next) {
  addBridgeHandler(req.body)
    .then((resp) =>
      resp ? res.status(201).send(resp) : res.status(400).send("error")
    )
    .catch((err) => next(err));
}

async function addBridgeHandler(body) {
  const bridges = await callService.addBridges(body);
  return bridges;
}

module.exports = {
  updateUserOncall,
  addConference,
  getConference,
  occupyConference,
  addCall,
  closeCall,
  closeConference,
  addBridge,
  endConference,
};
