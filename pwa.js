require("express-async-errors");
require("./models/index");

const express = require("express");
const logger = require("./config/logger/logger");
const next = require('next');
const pwa = next({});
const handle = app.getRequestHandler();

pwa.prepare().then(() => {
    const server = express();
    
    //server.use(express.static(`../../Fattahi/parto-pwa`));
    server.get('*', (req, res) => {
      return handle(req, res);
    });
    server.listen(3925, () => logger.info("Listening on port 3925..."));
});

