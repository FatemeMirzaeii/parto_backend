
const express = require("express");
const logger = require("./config/logger/logger");
const next = require('next');
const dev = process.env.NODE_ENV!=='production'
const pwa = next({dev});

const handle = app.getRequestHandler();

const developmentApp = express();

developmentApp.use(express.static(`../../Fattahi/parto-pwa`));
developmentApp.get("/*", (req, res) => {
  res.sendFile("pages/index.js", { root: "../../Fattahi/parto-pwa" });
});
developmentApp.listen(3925, () => logger.info("Listening on port 3925..."));


