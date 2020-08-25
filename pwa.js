
const express = require("express");
const logger = require("./config/logger/logger");
const next = require('next');
const dev = process.env.NODE_ENV!=='production'
const pwa = next({dev});

const handle = app.getRequestHandler();

pwa.prepare().then(() => {
    const server = express();
    
    server.use(express.static(`../../Fattahi/parto-pwa`));
    server.get('*', (req, res) => {
      res.sendFile("./next/server/pages/index.html", { root: "../../Fattahi//parto-pwa" });
      return handle(req, res);
    });
    server.listen(3925, () => logger.info("Listening on port 3925..."));
});

