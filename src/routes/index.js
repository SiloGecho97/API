const app = (module.exports = require("express")());
const callController = require("../controllers/call.controller");
const redisController = require("../controllers/redis.controller");
const userController = require("../controllers/user.controller");
const controller = require("../controllers/user.controller")

app.get("/api/checkuser",controller.checkUserByPhone)
app.post("/api/updtlang",controller.updateLangauge);
app.post("/api/updtsex",controller.updateSex);
app.post("/api/updtage",controller.updateAge);
app.post("/api/updtstatus",controller.updateRegStatus);
app.post("/api/updtagree",controller.updateIsAgree);
app.post("/api/updtavailable",controller.updateIsAvailable);
app.post("/api/updtoncall",controller.updateIsOnCall);
app.get("/api/isavailable",controller.checkAvailable);
app.get("/api/isoncall",controller.checkOnCall);
app.get("/api/preffered/:id",controller.getPreffered)
app.post("/api/preffered",controller.updateUserPreffered)

//oncalls APIS
app.put("/api/:id/isoncall",callController.updateUserOncall)
//add to call
app.post("/api/call",callController.addCall);

//Close the call
app.put("/api/call/close/:id",callController.closeCall)
//API Check available conference to join
app.get("/api/conference",callController.getConference);
//add to conference with preferance
app.post("/api/conference",callController.addConference);

//If available conference join the two conferance (reserve and occupy the conferance)
app.put("/api/conference/join",callController.occupyConference);
/**
 * Hangup time
 * 
 * close the conferance
 * End call of the that hangups up
 * return the other user to the main menu
 * 
*/
app.put("/api/conference/close",callController.closeConference)
/**
 * free 
 * 
 * Close Conference
 *
 **/

//Brigdes when two use connect
app.post("/api/bridge",callController.addBridge)

//Add Friend
app.post("/api/user/friend",userController.addFriend);

//Resource Manage
app.get("/api/resource",redisController.getResouceLeft)