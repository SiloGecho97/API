const app = (module.exports = require("express")());
const callController = require("../controllers/call.controller");
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
app.post("/api/conference",callController.addConference)
app.post("/api/call",callController.addCall)