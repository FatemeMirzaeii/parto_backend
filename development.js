require("express-async-errors");
require("./models/index");
const swaggerUi = require("swagger-ui-express");
const fileUpload = require('express-fileupload');
const swaggerDocument = require("./swagger.json");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const nodeadmin = require("nodeadmin");
const rateLimit = require("express-rate-limit");
const error = require("./middleware/error");
const logger = require("./config/logger/logger");
const cycle = require("./routes/cycle");
const pregnancy = require("./routes/pregnancy");
const interview = require("./routes/interview");
const healthTracking = require("./routes/health-tracking");
const note = require("./routes/notes");
const user = require("./routes/user");
const auth = require("./routes/auth");
const contactUs = require("./routes/contactUs");
const survey = require("./routes/survey");
const profile = require("./routes/profile");
const cookieParser = require('cookie-parser');

const developmentApp = express();

developmentApp.use(cookieParser());
const whitelist = ['https://test.parto.app', 'http://localhost:3925', 'http://localhost:2216', 'https://dev.parto.app']
developmentApp.use(cors({
  origin: function (origin, callback) {
    // bypass the requests with no origin (like curl requests, mobile apps, etc )
    if (!origin) return callback(null, true);

    if (whitelist.indexOf(origin) === -1) {
      var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  exposedHeaders: 'x-auth-token'
}));
// developmentApp.set('trust proxy', 1) // trust first proxy

const authenticatedLimiter = rateLimit({
  windowMs: 1000, // 1 second window
  max: 50, // start blocking after 20 requests
  message:
  { message: "تعداد درخواست های شما در چند دقیقه گذشته بیش از حد مجاز بوده است، لطفا پس از چند دقیقه دوباره امتحان کنید "},
  headers: true,
});

developmentApp.use("/cycle", authenticatedLimiter);
developmentApp.use("/pregnancy", authenticatedLimiter);
developmentApp.use("/interview", authenticatedLimiter);
developmentApp.use("/healthTracking", authenticatedLimiter);
developmentApp.use("/notes", authenticatedLimiter);
developmentApp.use("/user", authenticatedLimiter);
developmentApp.use("/auth", authenticatedLimiter);
developmentApp.use("/profile", authenticatedLimiter);

const unauthenticatedLimiter = rateLimit({
  windowMs: 2*60 * 1000, // 2 minet window
  max: 9, // start blocking after 1 requests
  message:
  { message: "تعداد درخواست های شما در چند دقیقه گذشته بیش از حد مجاز بوده است، لطفا پس از چند دقیقه دوباره امتحان کنید "},
  headers: true,
});
developmentApp.use("/auth", unauthenticatedLimiter);
developmentApp.use("/contactUs", unauthenticatedLimiter);
developmentApp.use("/survey", authenticatedLimiter);

developmentApp.use(fileUpload());
developmentApp.use(helmet());
developmentApp.use(nodeadmin(developmentApp));
developmentApp.use(express.json({limit: '50mb'}));
developmentApp.use(express.urlencoded({limit: '50mb'}));
developmentApp.use("/cycle", cycle);
developmentApp.use("/pregnancy", pregnancy);
developmentApp.use("/interview", interview);
developmentApp.use("/healthTracking", healthTracking);
developmentApp.use("/notes", note);
developmentApp.use("/user", user);
developmentApp.use("/auth", auth);
developmentApp.use("/contactUs", contactUs);
developmentApp.use("/survey", survey);
developmentApp.use("/profile", profile);
developmentApp.use(error);


developmentApp.use(
  "/api-doc", //todo: It is better to change the name to: api.pa torto.app/docs
  function (req, res, next) {
    swaggerDocument.host = req.get("https://dev.parto.app");
    req.swaggerDoc = swaggerDocument;
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup()
);

console.log(process.env.NODE_PORT);
// developmentApp.use(function(req, res, next) {
//   res.setHeader("Content-Security-Policy", "script-src 'self'");
//   next();
// });

developmentApp.use(express.static(`../../Fattahi/deploy/staging/build`));
developmentApp.get("/*", (req, res) => {
  res.sendFile("index.html", { root: "../../Fattahi/deploy/staging/build" });
});


const developmentServer = developmentApp.listen(2216, () =>
  logger.info("Listening on port 2218...")
);
module.exports = developmentServer;
