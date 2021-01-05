const redis = require("redis");
const { RESOURCE } = require("../../constants");
const port_redis = process.env.PORT || 6379;

var client;

function createRedisConnection() {
  const redis_client = redis.createClient(port_redis);

  redis_client.on("connect", function () {
    console.log("Redis are now connected");
  });

  redis_client.on("error", function (err) {
    console.log("Redis error: " + err);
  });

  client = redis_client;
  // console.log(redis_client);
  return redis_client;
}

function saveToRedis(phone, status) {
  let keys = JSON.stringify({ status });
  return new Promise((resolve, reject) => {
    client.set(`${phone.trim()}`, keys, (reply, error) => {
      console.log(reply);
      if (error) reject(false);
    });
    resolve(true);
  });
}
function incrementResource(){
  return new Promise((resolve, reject) => {
    client.incr(`resource`, (reply, error) => {
      console.log(reply);
      if (error) reject(false);
    });
    resolve(true);
  });
}

function decrementResource(){
  return new Promise((resolve, reject) => {
    client.decr(`resource`, (reply, error) => {
      console.log(reply);
      if (error) reject(false);
    });
    resolve(true);
  });
}

function getFromRedis(id) {
  return new Promise((resolve, reject) => {
    client.get(id, (error, reply) => {
      console.log(reply,error)
      if (error) reject(error);
      resolve(reply);
    });
  });
}

function redisMiddlerware(req, res, next) {
  redisMiddlerwareHandler(req.query.id)
    .then((resp) =>
      resp ? res.status(200).send(resp) : res.status(400).send("Failed")
    )
    .catch((err) => res.status(500).send(err));
}

async function redisMiddlerwareHandler(id) {
  const result = await getFromRedis(id);
  if (result) {
    return result;
  }
}

function getResouceLeft(req, res, next) {
  getResourceLeftHandler()
    .then((data) =>
      data ? res.status(200).send(data) : res.status(400).send(false)
    )
    .catch((err) => res.status(200).send(err));
}

async function getResourceLeftHandler() {
  const resource = await getFromRedis("resource");
  return {resourceLeft:RESOURCE - resource};
}

function addUserCalls(id,body){
  return new Promise((resolve, reject) => {
    client.append(`${id}`,body, (reply, error) => {
      console.log(reply);
      if (error) reject(false);
    });
    resolve(true);
  });
}

function deleteCallCache(id){
  return new Promise((resolve, reject) => {
    client.del(`${id}`, (reply, error) => {
      console.log(reply);
      if (error) reject(false);
    });
    resolve(true);
  });
}

module.exports = {
  saveToRedis,
  getFromRedis,
  createRedisConnection,
  redisMiddlerware,
  getResouceLeft,
  addUserCalls,
  incrementResource,
  decrementResource,
  deleteCallCache
};
