const userSerice = require("../services/user.service");

const moment = require("moment");
const { saveToRedis, holdResource } = require("./redis.controller");
const redisController = require("./redis.controller");
const { getUserById } = require("../services/user.service");
const { addCallHandler } = require("./call.controller");
// const callController = require("./call.controller");

function checkUserByPhone(req, res, next) {
  const { phoneNumber } = req.query;
  const { callId } = req.query;
  if (!callId) {
    res.status(400).send({ success: false, error: "callId is required" });
  }
  checkUserHandler(phoneNumber || "", callId || "")
    .then((resp) => res.status(200).send(resp))
    .catch((err) => {
      console.log(err);
      res.status(500).send({ sucess: false, message: err });
    });
}

async function checkUserHandler(phoneNumber, callId) {
  let changedPhone = changePhoneNumber(phoneNumber);
  if (!changedPhone) {
    throw "invalid phoneNumber";
  }
  if (isNaN(changedPhone) || changedPhone.length != 10) {
    throw "invalid phoneNumber";
  }
  const user = await userSerice.getUserByPhone(changedPhone);
  if (user) {

    const addCaller = await addCallHandler({
      callId: callId,
      userId: user.id,
      start_date: Date.now(),
    });

    return {
      success: true,
      status: user.regStatus,
      id: user.id,
      preferredSexId: user.preferredSexId,
      preferredAgeId: user.preferredAgeId,
      preferredLanguageId: user.preferredLanguageId,
      isAvailable: user.isAvailable,
      isOnCall: user.isOnCall,
      isAgreedToTerms: user.isAgreedToTerms,
    };
  } else {
    const createUser = await userSerice.addUser({ phoneNumber: changedPhone });
    if (!createUser) {
      return { success: false };
    }
    const code = await userSerice.addUserCode(createUser.id);
    await addCallHandler({
      callId: callId,
      userId: createUser.id,
      start_date: Date.now(),
    });

    // saveToRedis(changedPhone, "NEW").catch((err) => console.log(err));
    return { success: true, status: createUser.regStatus, id: createUser.id };
  }
}

function changePhoneNumber(phoneNumber) {
  if (phoneNumber.startsWith("0")) {
    return phoneNumber;
  } else if (phoneNumber.startsWith("251")) {
    return "0" + phoneNumber.substr(3, 12);
  } else if (phoneNumber.startsWith("+251")) {
    return "0" + phoneNumber.substr(4, 12);
  } else if (phoneNumber.startsWith(" 251")) {
    return "0" + phoneNumber.substr(4, 12);
  } else if (phoneNumber.startsWith("9")) {
    return "0" + phoneNumber;
  } else {
    return false;
  }
}

function updateLangauge(req, res, next) {
  // console.log(req.body)
  const { id, languageId } = req.body;
  if (!id || !languageId) {
    return res.status(200).send("Invalid Request");
  }
  updateLangaugeHandler(req.body)
    .then((resp) => res.status(200).send(resp))
    .catch((err) => res.status(500).send({ message: err }));
}

async function updateLangaugeHandler(body) {
  const user = await userSerice.getUserById(body.id);
  if (user) {
    const updateUser = await userSerice.updateUser(user, {
      languageId: body.languageId,
    });
    if (updateUser && updateUser.regStatus !== 10) {
      const updateStatus = await userSerice.updateUser(user, { regStatus: 2 });
      if (updateStatus) {
      
        return { success: true, status: "LANGUAGE" };
      }
    }
  }
  return { success: false, status: "LANGUAGE" };
}

function updateSex(req, res, next) {
  const { id, sexId } = req.body;
  if (!id || !sexId) {
    return res.status(400).send("Invalid Request");
  }
  updateSexHandler(req.body)
    .then((resp) => res.status(200).send(resp))
    .catch((err) => res.status(500).send({ message: err }));
}

async function updateSexHandler(body) {
  const user = await userSerice.getUserById(body.id);
  if (user) {
    const sexcheck = await userSerice.getSexById(body.sexId);
    if (!sexcheck) {
      throw "Invalid sex Id";
    }
    const updateUser = await userSerice.updateUser(user, { sexId: body.sexId });
    if (updateUser && updateUser.regStatus !== 10) {
      const updateStatus = await userSerice.updateUser(user, { regStatus: 3 });
      return { success: true, status: "SEX" };
    }
  }
  return { success: false, status: "SEX" };
}

function updateAge(req, res, next) {
  const { id, ageRangeId } = req.body;
  if (!id || !ageRangeId) {
    return res.status(400).send("Invalid Request");
  }
  updateAgeHandler(req.body)
    .then((resp) => res.status(200).send(resp))
    .catch((err) => res.status(500).send({ message: err }));
}

async function updateAgeHandler(body) {
  const user = await userSerice.getUserById(body.id);
  if (user) {
    const updateUser = await userSerice.updateUser(user, {
      ageRengId: body.ageRangeId,
    });
    if (updateUser && updateUser.regStatus !== 10) {
      const updateStatus = await userSerice.updateUser(user, { regStatus: 4 });
      return { success: true, status: "AGE" };
    }
  }
  return { success: false, status: "AGE" };
}

function updateRegStatus(req, res, next) {
  console.log(req.body);
  const { id, regStatus } = req.body;
  if (!id || !regStatus) {
    return res.status(400).send("Invalid Request");
  }
  updateRegStatusHandler(req.body)
    .then((resp) => res.status(200).send(resp))
    .catch((err) => res.status(500).send({ message: err }));
}

async function updateRegStatusHandler(body) {
  const user = await userSerice.getUserById(body.id);
  const regStatus = await userSerice.getRegStatusById(body.regStatus);
  if (user && regStatus) {
    const updateUser = await userSerice.updateUser(user, {
      regStatus: body.regStatus,
    });
    if (updateUser) {
      return { success: true, status: regStatus.status };
    }
  }
  return { success: false, status: regStatus.status };
}

function updateIsAgree(req, res, next) {
  const { id, agree } = req.body;
  if (!id || !agree) {
    return res.status(400).send("Invalid Request");
  }
  updateIsAgreeHandler(req.body)
    .then((resp) => res.status(200).send(resp))
    .catch((err) => res.status(500).send({ message: err }));
}

async function updateIsAgreeHandler(body) {
  const user = await userSerice.getUserById(body.id);
  if (user) {
    if (body.agree) {
      const updateUser = await userSerice.updateUser(user, {
        isAgreedToTerms: 1,
        regStatus: 10,
      });
      // saveToRedis(user.phoneNumber, "AGREED").catch((err) => console.log(err));
      return { success: true, status: "AGREED" };
    }
  }
  return { success: false, status: "AGREED" };
}

function updateIsAvailable(req, res, next) {
  const { id, available } = req.body;
  if (!id && available !== undefined) {
    return res.status(400).send("Invalid Request");
  }
  updateIsAvailableHandler(req.body)
    .then((resp) => res.status(200).send(resp))
    .catch((err) => res.status(500).send({ message: err }));
}

async function updateIsAvailableHandler(body) {
  const user = await userSerice.getUserById(body.id);
  if (user) {
    if (body.available || body.available == 1) {
      const updateUser = await userSerice.updateUser(user, { isAvailable: 1 });
      if (updateUser) {
        return { success: true, isAvailable: true };
      }
    } else if (!body.available || body.available == 0) {
      const updateUser = await userSerice.updateUser(user, { isAvailable: 0 });
      if (updateUser) {
        return { success: true, isAvailable: false };
      }
    }
  }
  return { success: false, isAvaliable: user.isAvaliable ? true : false };
}
function updateIsOnCall(req, res, next) {
  console.log(req.body);
  const { id, onCall } = req.body;
  if (!id && onCall !== undefined) {
    return res.status(400).send("Invalid Request");
  }
  updateIsOnCallHadler(req.body)
    .then((resp) => res.status(200).send(resp))
    .catch((err) => res.status(500).send({ message: err }));
}

async function updateIsOnCallHadler(body) {
  const user = await userSerice.getUserById(body.id);
  if (user) {
    if (body.onCall || body.onCall == 1) {
      const updateUser = await userSerice.updateUser(user, { isOnCall: 1 });
      if (updateUser) {
        return { success: true, isOnCall: true };
      }
    } else if (!body.onCall || body.onCall == 0) {
      const updateUser = await userSerice.updateUser(user, { isOnCall: 0 });
      if (updateUser) {
        return { success: true, isOnCall: false };
      }
    }
  }
  return { success: false, isOnCall: user.isOnCall ? true : false };
}

function checkAvailable(req, res, next) {
  checkAvailableHandler(req.query.id)
    .then((resp) => res.status(200).send(resp))
    .catch((err) => res.status(500).send({ message: err }));
}

async function checkAvailableHandler(id) {
  console.log(id);
  const user = await userSerice.getUserById(id);
  if (user) {
    return { success: true, isAvailable: user.isAvailable ? true : false };
  }
  return { success: false };
}

function checkOnCall(req, res, next) {
  checkOnCallHandler(req.query.id)
    .then((resp) => res.status(200).send(resp))
    .catch((err) => res.status(500).send({ message: err }));
}

async function checkOnCallHandler(id) {
  const user = await userSerice.getUserById(id);
  if (user) {
    return { success: true, isOnCall: user.isOnCall ? true : false };
  }
  return { success: false };
}
function getPreffered(req, res, next) {
  getPrefferedHandler(req.params.id)
    .then((resp) => res.status(200).send(resp))
    .catch((err) => res.status(500).send({ message: err }));
}

async function getPrefferedHandler(id) {
  const user = await userSerice.getUserById(id);
  if (user) {
    return {
      success: true,
      preferredSexId: user.preferredSexId,
      preferredAgeId: user.preferredAgeId,
      preferredLanguageId: user.preferredLanguageId,
    };
  }
  return { success: false };
}

function updateUserPreffered(req, res, next) {
  const { id } = req.body;
  if (!id) {
    return res.status(400).send("Invalid Request");
  }
  updateUserPrefferedHandler(req.body)
    .then((resp) => res.status(200).send(resp))
    .catch((err) => res.status(500).send({ message: err }));
}

async function updateUserPrefferedHandler(body) {
  const user = await userSerice.getUserById(body.id);
  if (user) {
    if (body.languageId) {
      const lang = await userSerice.getLanguageById(body.languageId);
      if (lang) {
        const updateUser = await userSerice.updateUser(user, {
          preferredLanguageId: body.languageId,
        });
        if (updateUser)
          return { success: true, preferredLanguageId: body.languageId };
      }
    } else if (body.sexId) {
      const sex = await userSerice.getSexById(body.sexId);
      if (sex) {
        const updateUser = await userSerice.updateUser(user, {
          preferredSexId: body.sexId,
        });
        if (updateUser) return { success: true, preferredSexId: body.sexId };
      }
    } else if (body.ageRangeId) {
      const age = await userSerice.getAgeById(boyd.ageRangeId);
      if (age) {
        const updateUser = await userSerice.updateUser(user, {
          preferredAgeId: body.ageRangeId,
        });
        if (updateUser)
          return { success: true, preferredAgeId: body.ageRangeId };
      }
    }
    return {
      success: false,
      preferredSexId: user.preferredSexId,
      preferredAgeId: user.preferredAgeId,
      preferredLanguageId: user.preferredLanguageId,
    };
  }
  return { success: false };
}

function addFriend(req, res, next) {
  addFriendHandler(req.body)
    .then((resp) =>
      resp
        ? res.status(200).send(resp)
        : res.status(400).send({ success: false, error: "Failed to Create" })
    )
    .catch((err) => next(err));
}

async function addFriendHandler(body) {
  const count = await userSerice.howManyFriendById(body.userId);
  console.log(count);
  if (count <= 5 && count >= 0) {
    const friend = await userSerice.addFriend(body);
    return { success: true, added: true, id: friend.id, friendId: friend.id };
  }
  return { success: true, added: false, message: "Maxium limit" };
}

function getOneFriend(req, res, next) {
  getFriendHandler(req.query)
    .then((resp) =>{
      console.log('resp', resp)
      resp
        ? res.status(200).send(resp)
        : res.status(404).send({ success: false, error: "Not Found" })
    })
    .catch((err) => next(err));
}

async function getFriendHandler(query) {
  let notCalls = [];
  const getCalls = await redisController.getFromRedis(`oncall:${query.id}`);
  getCalls ? notCalls.push(...getCalls.split(",")) : null;

  // console.log(notCalls);
  const friend = await userSerice.getOneFriend(query.id, notCalls);
  if (friend.length > 0) {
    if (friend) {
      const user = await userSerice.getUserById(friend[0].friendId);

      if (user) {
        const addCache = await redisController.cacheInRedis(
          `oncall:${friend[0].friendId}`,
          `${user.phoneNumber},`
        );
        const usertry = await redisController.cacheAppendInRedis(
          `usercall:${query.id}`,
          `${user.id},`
        );
        await holdResource();
        return {
          success: true,
          isAvailable: true,
          userId: user.id,
          phoneNumber: user.phoneNumber,
        };
      }
    }
    return { success: true, isAvailable: false };
  }

  return { success:true, isAvailable:false };
}

function getOneUser(req, res, next) {
  getUserHandler(req.query)
    .then((resp) =>{
      console.log('resp', resp)
      resp
        ? res.status(200).send(resp)
        : res.status(404).send({ success: false, error: "Failed to Create" })
    })
    .catch((err) => next(err));
}
function extactIdFromCache(calls) {
  return calls.map((item) => {
    return item.split(":")[1];
  });
}
async function getUserHandler(query) {
  const user = await userSerice.getUserById(query.id);
  if (!user) {
    return { success: true, isAvailable: false, message: "User not found" };
  }
  let notCall = [];
  const getCalls = await redisController.getOnCallsKeys(`oncall:*`);
  notCall = extactIdFromCache(getCalls);
  const newFriend = await userSerice.getOneUserNext(notCall, {
    sex: user.sexId,
    age: user.ageRengId,
    language: user.languageId,
  });
  if (newFriend.length > 0) {
    const addUserCalls = await redisController.cacheInRedis(
      `oncall:${newFriend[0].id}`,
      `${newFriend[0].phoneNumber}`
    );
    const usertry = await redisController.cacheAppendInRedis(
      `usercall:${query.id}`,
      `${newFriend[0].id},`
    );
    await holdResource();
    return {
      success: true,
      isAvailable: true, 
      userId: `${newFriend[0].id}`,
      phoneNumber: newFriend[0].phoneNumber,
    };
  }
  return { success: true, isAvaliable: false };
}

function releaseResource(req, res, next) {
  releaseResourceHandler(req.body)
    .then((resp) =>
      resp
        ? res.status(200).send(resp)
        : res.status(400).send({ success: false, error: "Failed to release" })
    )
    .catch((err) => next(err));
}

async function releaseResourceHandler(body) {
  const removeCache = await redisController.deleteCallCache(
    `oncall:${body.userId}`
  );
  if (removeCache) {
    const resource = await redisController.releaseResource();
    return { success: true };
  }
}

function getUser(req, res, next) {
  getUserByChatIdHandler(req.query.chatNumber || "", req.query.userId || "")
    .then((resp) =>{
      console.log(resp);
      resp
        ? res.status(200).send(resp)
        : res.status(404).send({ success: false, error: "Not Found" })
    })
    .catch((err) => next(err));
}

/**
 * Return User if exist
 * @param {*} id
 */
async function getUserByChatIdHandler(codeId, userId) {
  const code = await userSerice.getUserByCode(codeId);
  if (code) {
    const user = await userSerice.getUserById(code.userId);
    // console.log(user,"isavailable");
    if (!user || !user.isAvailable || userId==code.userID ) {
      // console.log();
      return { success: true, isAvailable: false, isOnline: false };
    }
    const check = await redisController.getFromRedis(`oncall:${user.id}`);
    if (!check) {
      const addCache = await redisController.cacheInRedis(
        `oncall:${user.id}`,
        `${user.phoneNumber}`
      );
      const usertry = await redisController.cacheAppendInRedis(
        `usercall:${userId}`,
        `${user.id},`
      );

      await redisController.holdResource()
     
      return {
        success: true,
        isAvailable: true,
        isOnline: true,
        phoneNumber: user.phoneNumber,
        userId:user.id
      };
    }
    return {
      success: true,
      isAvailable: true,
      isOnline: false,
    };
  }
  return { success: true, isAvailable: false, isOnline: false };
}

function isFriend(req, res, next) {
  isFriendCheck(req.query.friendId || "", req.query.userId || "")
    .then((resp) =>
      resp
        ? res.status(200).send(resp)
        : res.status(404).send({ success: false, error: "Not Found" })
    )
    .catch((err) => next(err));
}

async function isFriendCheck(friendId, userId) {
  const friend = await userSerice.checkFriend(userId, friendId);
  if (friend) {
    return { success: true, isFriend: true };
  }
  return { success: true, isFriend: false };
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
  updateUserPreffered,
  addFriend,
  getOneFriend,
  getOneUser,
  getUser,
  releaseResource,
  isFriend,
};
