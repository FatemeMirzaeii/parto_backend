require("express-async-errors");
require("./models/index");

const express = require("express");
const logger = require("./config/logger/logger");

const next = require('next')
const pwa = next({})

pwa.use(express.static(`../../Fattahi/parto_PWA`));
pwa.get("/*", (req, res) => {
  res.sendFile("index.html", { root: "../../Fattahi/parto_PWA" });
});
pwa.listen(3925, () => logger.info("Listening on port 3925..."));
