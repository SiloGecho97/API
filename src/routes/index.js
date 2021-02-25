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
app.post("/api/changelang",controller.changeLangauge)
//oncalls APIS
app.put("/api/:id/isoncall",callController.updateUserOncall)

//add to call
app.post("/api/call",callController.addCall);

//Close the call
app.put("/api/call/close",callController.closeCall)

//API Check available conference to join
//Check is profile if any is on waiting 
app.get("/api/conference",callController.getConference);

//add to conference with preferance
app.post("/api/conference",callController.addConference);

//If available conference join the two conferance (reserve and occupy the conferance)
app.put("/api/conference/join",callController.occupyConference);

/**
 * Hangup time
 * close the conferance
 * End call of the that hangups up
 * return the other user to the main menu
 * 
*/

app.put("/api/conference/close",callController.closeConference)
/**
 * free 
 * End Conference
 *
 **/
app.put("/api/conference/end",callController.endConference)

//Add Friend
app.post("/api/addfriend",userController.addFriend);

//Get random Friend
//Should not be taken check its oncall
//If two user ask the same friend check its status
app.get("/api/friend",redisController.getResourceLeft,userController.getOneFriend)

//Resource management
//get Resource limitted when try to reach 
//Release resource if failed and bridge end
app.post("/api/release/resource",userController.releaseResource)

//get user
//add resource available check
app.get("/api/newfriend",redisController.getResourceLeft, userController.getOneUser)

//Resource Manage
app.get("/api/resource",redisController.getResource)
// app.put("/api/resource/release",redisController.releaseResource)

//two type of hangup scenarios outgoing and ingoing
//outgoing call logs
//resource management
app.post("/api/outgoing",callController.addOutGoingCall)
app.put("/api/endoutgoing",callController.closeOutgoing)
//Brigdes when two use connect
app.post("/api/bridge",callController.addBridge);
app.put("/api/endbridge",callController.closeBridge);
//get user with chat id
//make chat id 6 digit number

//three scenarios invalid user | ISAVAILABLE |user is not available | isoffline=true | ISOFFLINE=FALSE
app.get("/api/user",redisController.getResourceLeft,userController.getUser)

app.get("/api/checkconference",callController.checkConference)

//isFriend check
app.get("/api/isfriend",userController.isFriend)


app.all("*", (req, res) => {
    res.status(404).send({ success:false,msg: "not found" });
});
  


//note
/**
 * check is available when call by chatnumber and new friend
 * 
 */