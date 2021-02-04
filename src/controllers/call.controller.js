const callService = require("../services/call.service");
const userService = require("../services/user.service");
const redisController = require("./redis.controller");
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
      data
        ? res.status(200).send(data)
        : res.status(400).send({ success: false })
    )
    .catch((err) =>
      res.status(500).send({
        success: false,
        error: "Internal Server Error. User may not exist.",
      })
    );
}

async function addConferenceHandler(body) {
  // const user = await userService.getUserById(body.userId);
  // if (!user) {
  //   throw "Not Found";
  // }
  const conference = await callService.addConference({
    ...body,
    userId_1: body.userId,
    start_date: Date.now(),
  });
  if (conference) {
    await redisController.cacheInRedis(
      `conference:${conference.gender}:${conference.id}`,
      JSON.stringify(conference)
    );
    return { success: true, conferenceId: conference.id };
  }
  return { success: false };
}

function addCall(req, res, next) {
  addCallHandler(req.body)
    .then((data) =>
      data ? res.status(200).send(true) : res.status(400).send(false)
    )
    .catch((err) => res.status(500).send(err));
}

async function addCallHandler(body) {
  console.log(body);
  const call = await callService.addCall(body);
  if (call) {
    const user = await userService.getUserById(body.userId);
    if (user) {
      const update = userService.updateUser(user, { isOnCall: true });
    }
    await redisController.cacheInRedis(
      `oncall:${user.id}`,
      `${user.phoneNumber}`
    );
    holdResource();
    return call;
  }
}

function closeCall(req, res, next) {
  let { userId, callId } = req.body;
  if (!userId || !callId) {
    res.status(400).send({ success: false, error: "invalid request" });
    return;
  }
  closeCallHandler(userId, callId)
    .then((data) =>
      data
        ? res.status(200).send({ success: true })
        : res.status(400).send({ success: false })
    )
    .catch((err) => next(err));
}

async function closeCallHandler(userId, callId) {
  const call = await callService.getCallById(callId);
  if (call) {
    const update = await callService.updateCall(call, {
      status: "CLOSED",
      end_date: Date.now(),
    });
    if (call) {
      releaseResource();
      //Delete Main user cache
      //delete if it have suspedent user
      const userscall = await redisController.getFromRedis(
        `usercall:${userId}`
      );
      if (userscall) {
        console.log('userscall', userscall)
        userscall.split(",").map((item) => {
          if (item) {
            releaseResource();
            deleteCallCache(`oncall:${item}`);
          }
        });

       await deleteCallCache(`usercall:${userId}`);
      }
      await deleteCallCache(`oncall:${call.userId}`);
      return call;
    }
  }
}

function getConference(req, res, next) {
  getConferenceHandler(req.query)
    .then((data) => {
      data
        ? res.status(200).send(data)
        : res.status(400).send({ success: false, error: "Failed" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ success: false, error: err });
    });
}

async function getConferenceHandler(query) {
  const conference = await redisController.getConference(query);
  // const conference = await callService.getConference(query);
  console.log(conference, "Conf");
  if (conference) {
    await occupyConferenceHandler({
      userId: query.userId,
      conferenceId: conference.id,
    });
    await deleteCallCache(`conference:${conference.gender}:${conference.id}`);
    return {
      success: true,
      conferenceId: conference.id,
      userId: conference.userId_1,
      isAvailable: true,
    };
  }
  return { success: true, isAvailable: false };
}

function occupyConference(req, res, next) {
  occupyConferenceHandler(req.query)
    .then((data) => {
      data ? res.status(200).send(data) : res.status(400).send(false);
    })
    .catch((err) => next(err));
}

async function occupyConferenceHandler(body) {
  const conference = await callService.updateConference(
    {
      status: "OCCUPIED",
      userId_2: body.userId,
    },
    body.conferenceId
  );
  if (conference) {
    return true;
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
    // await closeCallHandler(body.userId_1);

    return conference;
  }
}

function endConference(req, res, next) {
  endConferenceHandler(req.body)
    .then((data) => {
      data
        ? res.status(200).send(data)
        : res.status(400).send({ success: false });
    })
    .catch((err) => res.status(400).send({ success: false }));
}

async function endConferenceHandler(body) {
  // console.log(body);
  const conf = await callService.getConferenceById(body.conferenceId);
  if (conf) {
    const conference = await callService.updateConference(
      {
        status: "CLOSED",
        end_time: Date.now(),
      },
      body.conferenceId,
      conf
    );
    // console.log(conference);
    if (conference) {
      await redisController.deleteCallCache(
        `conference:${conf.gender}:${body.conferenceId}`
      );
      return conference ? { success: true } : { success: false };
    }
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
  return { success: true, id: bridges.id };
}

function closeBridge(req, res, next) {
  closeBridgeHandler(req.body)
    .then((resp) =>
      resp
        ? res.status(201).send(resp)
        : res.status(400).send({ success: false, error: "error" })
    )
    .catch((err) => next(err));
}

async function closeBridgeHandler(body) {
  const bridges = await callService.closeBridge(
    { end_time: Date.now(), status: "CLOSED" },
    body.id
  );
  return bridges[0] ? { success: true } : { success: false };
}

function addOutGoingCall(req, res, next) {
  console.log('req.body', req.body)
  addOutGoingCallHandler(req.body)
    .then((resp) =>{
      resp ? res.status(201).send(resp) : res.status(400).send("error")
    })
    .catch((err) =>next(500));
}

async function addOutGoingCallHandler(body) {
  const bridges = await callService.addOutGoing(body);
  return {success:true};
}

function closeOutgoing(req, res, next) {
  closeOutgoingHandler(req.body)
    .then((resp) =>
      resp
        ? res.status(201).send(resp)
        : res.status(400).send({ success: false, error: "error" })
    )
    .catch((err) => next(err));
}

async function closeOutgoingHandler(body) {
  console.log(body);
  const bridges = await callService.closeOutGoing(
    { status: "CLOSED", end_time: Date.now() },
    body.callId
  );
  return bridges[0] ? { success: true } : { success: false };
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
  closeBridge,
  endConference,
  addCallHandler,
  addOutGoingCall,
  closeOutgoing,
};
