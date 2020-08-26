
const express = require("express");
const logger = require("./config/logger/logger");
const next = require('next');
const dev = process.env.NODE_ENV!=='production'
const pwa = next({dev});

const handle = app.getRequestHandler();

const pwa = express();

pwa.use(express.static(`../../Fattahi/parto-pwa`));
pwa.get("/*", (req, res) => {
  res.sendFile("out/index.html", { root: "../../Fattahi/parto-pwa" });
});
pwa.listen(3925, () => logger.info("Listening on port 3925..."));


