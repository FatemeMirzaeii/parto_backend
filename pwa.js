
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
      return server.render(req, res, '/', query)
    });
    server.listen(3925, () => logger.info("Listening on port 3925..."));
});

