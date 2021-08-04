require("express-async-errors");
require("./models/index");

const swaggerUi = require("swagger-ui-express");
const fileUpload = require('express-fileupload');
const swaggerDocument = require("./swagger.json");
const testSwaggerDocument = require("./testSwagger.json");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const nodeadmin = require("nodeadmin");
const rateLimit = require("express-rate-limit");
const error = require("./middleware/error");
const logger = require("./config/logger/logger");
const cookieParser = require('cookie-parser');


// v1
const cycle1 = require("./routes/v1/cycle");
const pregnancy1 = require("./routes/v1/pregnancy");
const interview1 = require("./routes/v1/interview");
const healthTracking1 = require("./routes/v1/health-tracking");
const notes1 = require("./routes/v1/notes");
const user1 = require("./routes/v1/user");
const auth1 = require("./routes/v1/auth");
const contactUs1 = require("./routes/v1/contactUs");
const survey1 = require("./routes/v1/survey");
const payment1 = require("./routes/v1/payment");
const profile1 = require("./routes/v1/profile");
const message1= require("./routes/v1/message");


// v2
const healthTracking2 = require("./routes/v2/health-tracking");
const user2 = require("./routes/v2/user");


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


const authenticatedLimiter = rateLimit({
  windowMs: 1000, // 1 second window
  max: 50, // start blocking after 20 requests
  message:
  { message: "تعداد درخواست های شما در چند دقیقه گذشته بیش از حد مجاز بوده است، لطفا پس از چند دقیقه دوباره امتحان کنید "},
  headers: true,
});
// v1
developmentApp.use("/cycle", authenticatedLimiter);
developmentApp.use("/pregnancy", authenticatedLimiter);
developmentApp.use("/interview", authenticatedLimiter);
developmentApp.use("/healthTracking", authenticatedLimiter);
developmentApp.use("/notes", authenticatedLimiter);
developmentApp.use("/user", authenticatedLimiter);
developmentApp.use("/profile", authenticatedLimiter);
developmentApp.use("/payment", authenticatedLimiter);
developmentApp.use("/message", authenticatedLimiter);
// v2
developmentApp.use("/v2/healthTracking", authenticatedLimiter);
developmentApp.use("/v2/user", authenticatedLimiter);


const unauthenticatedLimiter = rateLimit({
  windowMs: 2*60 * 1000, // 2 minet window
  max: 30, // start blocking after 1 requests
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
// v1 route
developmentApp.use("/cycle", cycle1);
developmentApp.use("/pregnancy", pregnancy1);
developmentApp.use("/interview", interview1);
developmentApp.use("/healthTracking", healthTracking1);
developmentApp.use("/notes", notes1);
developmentApp.use("/user", user1);
developmentApp.use("/auth", auth1);
developmentApp.use("/contactUs", contactUs1);
developmentApp.use("/survey", survey1);
developmentApp.use("/profile", profile1);
developmentApp.use("/payment", payment1);
developmentApp.use("/message", message1);
// v2 
developmentApp.use("/v2/healthTracking", healthTracking2);
developmentApp.use("/v2/user", user2);

developmentApp.use(error);


developmentApp.use(
  "/doc", //url is dev.parto.app/doc
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

console.log('The value of PORT is:', process.env);
const developmentServer = developmentApp.listen(2216, () =>
  logger.info("Listening on port 2218...")
);
module.exports = developmentServer;
