require("express-async-errors");
require("./models/index");
const fileUpload = require('express-fileupload');
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
const notes = require("./routes/notes");
const user = require("./routes/user");
const auth = require("./routes/auth");
const contactUs = require("./routes/contactUs");
const survey = require("./routes/survey");
const payment = require("./routes/payment");
const profile = require("./routes/profile");
const message= require("./routes/message");
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
const whitelist = ['https://my.parto.app', 'http://localhost:3925','http://localhost:2216']
app.use(cors({
  origin: function (origin, callback) {
    // bypass the requests with no origin (like curl requests, mobile apps, etc )
    if (!origin) return callback(null, true);
 
    if (whitelist.indexOf(origin) === -1) {
      var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials :true,
  exposedHeaders: 'x-auth-token'
}));

// const authenticatedLimiter = rateLimit({
//   windowMs: 1000, // 1 second window
//   max: 50, // start blocking after 10 requests
//   message:
//   { message: "تعداد درخواست های شما در چند دقیقه گذشته بیش از حد مجاز بوده است، لطفا پس از چند دقیقه دوباره امتحان کنید "},
//   headers: true,
// });

app.use("/cycle", authenticatedLimiter);
app.use("/pregnancy", authenticatedLimiter);
app.use("/interview", authenticatedLimiter);
app.use("/healthTracking", authenticatedLimiter);
app.use("/notes", authenticatedLimiter);
app.use("/user", authenticatedLimiter);
app.use("/auth", authenticatedLimiter);
app.use("/profile", authenticatedLimiter);
app.use("/payment", authenticatedLimiter);
app.use("/message", authenticatedLimiter);


// const unauthenticatedLimiter = rateLimit({
//   windowMs: 2*60 * 1000, // 2 minet window
//   max: 15, // start blocking after 1 requests
//   message:
//   { message: "تعداد درخواست های شما در چند دقیقه گذشته بیش از حد مجاز بوده است، لطفا پس از چند دقیقه دوباره امتحان کنید "},
//   headers: true,
// });
app.use("/auth", unauthenticatedLimiter);
app.use("/contactUs", unauthenticatedLimiter);
app.use("/survey", authenticatedLimiter);

app.use(fileUpload());
app.use(helmet());
app.use(nodeadmin(app));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use("/cycle", cycle);
app.use("/pregnancy", pregnancy);
app.use("/interview", interview);
app.use("/healthTracking", healthTracking);
app.use("/notes", notes);
app.use("/user", user);
app.use("/auth", auth);
app.use("/contactUs", contactUs);
app.use("/survey", survey);
app.use("/profile", profile);
app.use("/payment", payment);
app.use("/message", message);
app.use(error);

console.log(process.env.NODE_PORT);

app.use(express.static(`../../Fattahi/deploy/production/build`));
app.get("/*", (req, res) => {
  res.sendFile("index.html", { root: "../../Fattahi/deploy/production/build" });
});

const server = app.listen(2218, () => logger.info("Listening on port 2218..."));
module.exports = server;
