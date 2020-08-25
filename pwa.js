
require("express-async-errors");
require("./models/index");

const express = require("express");
const logger = require("./config/logger/logger");

const developmentApp = express();

developmentApp.use(express.static(`../../Fattahi/parto-pwa`));
developmentApp.get("/*", (req, res) => {
  res.sendFile("pages/index.js", { root: "../../Fattahi/parto-pwa" });
});
developmentApp.listen(3925, () => logger.info("Listening on port 3925..."));
