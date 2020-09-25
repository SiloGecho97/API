const app = (module.exports = require("express")());
const controller = require("../controllers/message.controller")

app.get("/api/checkuser",controller.checkUserByPhone)
app.get("/api/updtlang",controller.updateLangauge);
app.get("/api/updtsex",controller.updateSex);
app.get("/api/updtage",controller.updateAge);
