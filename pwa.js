require("express-async-errors");
require("./models/index");

const express = require("express");
const logger = require("./config/logger/logger");
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const next = require('next')

const app = next({ })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    if (pathname === '../../Fattahi/parto-pwa') {
      app.render(req, res, '../../Fattahi/parto-pwa', query)
    }
  }).listen(3925, () => logger.info("Listening on port 3925..."));
})

// pwa.use(express.static(`../../Fattahi/parto-pwa`));
// pwa.get("/*", (req, res) => {
//   res.sendFile("index.html", { root: "../../Fattahi/parto-pwa" });
// });
// pwa.listen(3925, () => logger.info("Listening on port 3925..."));
