require("express-async-errors");
require("./models/index");

const express = require("express");
const cors = require("cors");
// const { createProxyMiddleware } = require("http-proxy-middleware");
const logger = require("./config/logger/logger");

const developmentApp = express();
developmentApp.use(cors());

// developmentApp.use(
//     '/rest/api/**',
//     createProxyMiddleware({
//       target: 'https://ketab.partobanoo.com',
//       changeOrigin: true,
//       secure:false,
//     })
//   );

//   developmentApp.use(
//     '/download/attachment/**',
//     createProxyMiddleware({
//       target: 'https://ketab.partobanoo.com',
//       changeOrigin: true,
//       secure:false,
//     })
//   );

developmentApp.use(express.static(`../../Fattahi/deploy/staging/build`));
developmentApp.get("/*", (req, res) => {
  res.sendFile("index.html", { root: "../../Fattahi/deploy/staging/build" });
});
developmentApp.listen(2216, () => logger.info("Listening on port 2216..."));
