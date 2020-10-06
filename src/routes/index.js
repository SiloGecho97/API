const app = (module.exports = require("express")());
const controller = require("../controllers/user.controller")

app.get("/api/checkuser",controller.checkUserByPhone)
app.post("/api/updtlang",controller.updateLangauge);
app.post("/api/updtsex",controller.updateSex);
app.post("/api/updtage",controller.updateAge);
app.post("/api/updtstatus",controller.updateRegStatus);
app.post("/api/updtagree",controller.updateIsAgree);
app.post("/api/updtavailable",controller.updateIsAvailable);
app.post("/api/updtoncall",controller.updateIsOnCall);

