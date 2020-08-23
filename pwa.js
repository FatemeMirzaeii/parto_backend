require("express-async-errors");
require("./models/index");

const express = require("express");
const logger = require("./config/logger/logger");

const  pwa = express();

pwa.use(express.static(`../../Fattahi/parto-pwa`));
pwa.get("/*", (req, res) => {
  res.sendFile("index.html", { root: "../../Fattahi/parto-pwa" });
});
pwa.listen(3925, () => logger.info("Listening on port 3925..."));
