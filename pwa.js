require("express-async-errors");
require("./models/index");

const express = require("express");
const logger = require("./config/logger/logger");
// const next = require('next');
// const pwa = next({});
// const handle = app.getRequestHandler();

// pwa.prepare().then(() => {
//     const server = express();
    
//     //server.use(express.static(`../../Fattahi/parto-pwa`));
//     server.get('*', (req, res) => {
//       return handle(req, res);
//     });
//     server.listen(3925, () => logger.info("Listening on port 3925..."));
// });

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    if (pathname === '*') {
      app.render(req, res, `../../Fattahi/parto-pwa`, query)
    }
  }).listen(3925, () => logger.info("Listening on port 3925..."));
})